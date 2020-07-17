require("dotenv").config();
const { AssertionError, strict: assert } = require("assert");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const express = require("express");
const fetch = require("node-fetch");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const multer = require("multer");
const db = require("./db");
const { upload } = require("./s3");
const names = require("./names.json");

const multipart = multer({ dest: "src/uploads" });

class NotFoundError extends Error {}

const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.get("/api/leaderboard", async (req, res, next) => {
  try {
    const players = await db.Player.find({}, "username image money").sort({ money: -1 }).limit(10);
    res.status(200).json({ players });
  } catch (err) {
    next(err);
  }
});

app.post("/api/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    assert.ok(username, "Missing username or password");
    assert.ok(password, "Missing username or password");

    const player = await db.Player.findOne({ username });
    assert.ok(player, "Invalid username or password");

    const matched = await bcrypt.compare(password, player.password);
    assert.ok(matched, "Invalid username or password");

    const { id, image, money, stamina, city } = player;
    const token = jwt.sign({ id }, process.env.SECRET_KEY);

    res.status(200).json({ token, username, image, money, stamina, city });
  } catch (err) {
    next(err);
  }
});

app.post("/api/signup", multipart.single("image"), async (req, res, next) => {
  let imageFile;
  try {
    imageFile = req.file;
    const { username, password } = req.body;
    assert.ok(imageFile, "Missing image");
    assert.ok(username, "Missing username or password");
    assert.ok(password, "Missing username or password");

    let player = await db.Player.findOne({ username });
    assert.ok(!player, "Player with this name already exists");

    const uploadedImage = await upload(imageFile.path, username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const amsterdam = await db.City.findOne({ name: "Amsterdam" });

    const customers = [];
    const cities = await db.City.find({}, "_id");
    for (let i = 0; i < 5; i++) {
      let city = cities[random(cities.length)].id;
      // eslint-disable-next-line no-loop-func
      while (city === amsterdam.id || customers.find((cust) => cust.city === city)) {
        city = cities[random(cities.length)].id;
      }
      const price = 500 + random(500);
      let customer = {
        message: `I want to buy you product for $${price}!`,
        price,
        city,
        expireTime: new Date(Date.now() + (7200 + random(10800)) * 1000), // between 2 and 5 hours
      };
      if (Math.random() > 0.6) {
        customer = {
          name: randomMaleName(),
          image: randomMaleImage(),
          ...customer,
        };
      } else {
        customer = {
          name: randomFemaleName(),
          image: randomFemaleImage(),
          ...customer,
        };
      }
      customers.push(customer);
    }

    player = await db.Player.create({
      username,
      password: hashedPassword,
      image: uploadedImage,
      money: 10000,
      stamina: 100,
      city: amsterdam.id,
      customers,
    });
    const { id, image, money, stamina, city } = player;
    const token = jwt.sign({ id }, process.env.SECRET_KEY);

    res.status(200).json({ token, username, image, money, stamina, city });
  } catch (err) {
    next(err);
  } finally {
    if (imageFile) {
      fs.unlinkSync(imageFile.path);
    }
  }
});

app.get("/api/players/:id", async (req, res, next) => {
  try {
    const player = await db.Player.findById(req.params.id, "username image money stamina city");
    assert.ok(player);
    res.status(200).json(player);
  } catch (err) {
    next(new NotFoundError("Player not found"));
  }
});

app.put("/api/players/:id/activity", async (req, res, next) => {
  try {
    await db.Player.findByIdAndUpdate(req.params.id, { lastActive: new Date() });
    res.status(200);
  } catch (err) {
    next(new NotFoundError("Player not found"));
  }
});

const random = (max) => {
  return Math.floor(Math.random() * max);
};

const randomMaleName = () => {
  return `${names.maleFirstName[random(names.maleFirstName.length)]} ${names.lastName[random(names.lastName.length)]}`;
};

const randomFemaleName = () => {
  return `${names.femaleFirstName[random(names.femaleFirstName.length)]} ${
    names.lastName[random(names.lastName.length)]
  }`;
};

const randomMaleImage = () => {
  return `male-${random(7)}`;
};

const randomFemaleImage = () => {
  return `female-${random(4)}`;
};

app.get("/api/players/:id/customers", async (req, res, next) => {
  try {
    const player = await db.Player.findById(req.params.id, "customers lastActive").populate({
      path: "customers",
      populate: {
        path: "city",
        select: "name",
      },
    });
    const customers = player.customers.filter((cust) => cust.expireTime > new Date());

    const numHoursSinceLastActive = (new Date() - player.lastActive) / 3600000;
    const numSpawn = Math.min(8 - customers.length, Math.floor(numHoursSinceLastActive / 2));

    if (numSpawn > 0) {
      const cities = await db.City.find({}, "_id name");

      for (let i = 0; i < numSpawn; i += 1) {
        let city = cities[random(cities.length)].id;
        // eslint-disable-next-line no-loop-func
        while (city === player.city || customers.find((cust) => cust.city === city)) {
          city = cities[random(cities.length)].id;
        }

        const price = 500 + random(500);
        let customer = {
          message: `I want to buy you product for $${price}!`,
          price,
          city,
          expireTime: new Date(Date.now() + (7200 + random(10800)) * 1000), // between 2 and 5 hours
        };
        if (Math.random() > 0.6) {
          customer = {
            name: randomMaleName(),
            image: randomMaleImage(),
            ...customer,
          };
        } else {
          customer = {
            name: randomFemaleName(),
            image: randomFemaleImage(),
            ...customer,
          };
        }
        customers.push(customer);
      }
    }
    player.customers = customers;
    await player.save();

    res.status(200).json({ customers });
  } catch (err) {
    next(err);
  }
});

app.get("/api/cities/text", async (req, res, next) => {
  try {
    const { q } = req.query;
    const cities = await db.City.find({ name: { $regex: `^${q}`, $options: "i" } }, "name");
    res.status(200).json({ cities });
  } catch (err) {
    next(err);
  }
});

app.get("/api/cities/:id", async (req, res, next) => {
  try {
    const city = await db.City.findById(req.params.id, "name coords pointsOfInterest");
    assert.ok(city);
    res.status(200).json(city);
  } catch (err) {
    next(new NotFoundError("City not found"));
  }
});

app.get("/api/flights", async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const fromCity = await db.City.findById(from, "name airlines");
    const toCity = await db.City.findById(to, "name airlines");
    let flights = [...fromCity.airlines, ...toCity.airlines];
    const price = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${fromCity.name}&destinations=${toCity.name}&key=AIzaSyA0HlNaNB-5MkrqB7FveaBP3mUb4JmZTPQ`
    )
      .then((res) => res.json())
      .then((res) => res.rows[0].elements[0])
      .then((res) => {
        const distance = Number(res.distance.text.replace(/[^0-9.]/g, ""));
        return Math.round(50 + distance * 0.11);
      });
    flights = flights.map((a) => ({ name: a.name, image: a.image, price: price + random(100) }));
    res.status(200).json({ flights });
  } catch (err) {
    console.log(err);
    next(new NotFoundError("City not found"));
  }
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err instanceof AssertionError) {
    res.status(400);
  } else if (err instanceof NotFoundError) {
    res.status(404);
  } else {
    res.status(500);
  }
  res.json({ error: err.message });
});

app.listen(process.env.PORT);
