require("dotenv").config();
const { AssertionError, strict: assert } = require("assert");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const multer = require("multer");
const db = require("./db");
const { uploadS3, random, randomFemaleImage, randomMaleImage, randomFemaleName, randomMaleName } = require("./utils");

class NotFoundError extends Error {}

const app = express();
const multipart = multer({ dest: "src/uploads" });

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.post("/api/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    assert.ok(username, "Missing username or password");
    assert.ok(password, "Missing username or password");

    const player = await db.Player.findOne({ username }, "password");
    assert.ok(player, "Invalid username or password");

    const matched = await bcrypt.compare(password, player.password);
    assert.ok(matched, "Invalid username or password");

    const token = jwt.sign({ id: player.id }, process.env.SECRET_KEY);
    res.status(200).json({ token, id: player.id });
  } catch (err) {
    next(err);
  }
});

app.post("/api/signup", multipart.single("image"), async (req, res, next) => {
  let imageFile;
  try {
    assert.ok((imageFile = req.file), "Missing image");
    const { username, password } = req.body;
    assert.ok(username, "Missing username or password");
    assert.ok(password, "Missing username or password");

    let player = await db.Player.findOne({ username }, "_id");
    assert.ok(!player, "Player with this name already exists");

    const hashedPassword = await bcrypt.hash(password, 10);
    const amsterdam = await db.City.findOne({ name: "Amsterdam" }, "_id");

    const customers = [];
    const cities = await db.City.find({}, "_id");
    for (let i = 0; i < 5; i += 1) {
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

    const uploadedImage = await uploadS3(imageFile.path, username);
    player = await db.Player.create({
      username,
      password: hashedPassword,
      image: uploadedImage,
      money: 10000,
      stamina: 100,
      city: amsterdam.id,
      customers,
    });

    const token = jwt.sign({ id: player.id }, process.env.SECRET_KEY);
    res.status(200).json({ token, id: player.id });
  } catch (err) {
    next(err);
  } finally {
    if (imageFile) {
      fs.unlinkSync(imageFile.path);
    }
  }
});

app.get("/api/leaderboard", async (req, res, next) => {
  try {
    const players = await db.Player.find({}, "username image money").sort({ money: -1 }).limit(10);
    res.status(200).json(players);
  } catch (err) {
    next(err);
  }
});

app.get("/api/players/:id", async (req, res, next) => {
  try {
    const player = await db.Player.findById(req.params.id, "username image money stamina city");
    if (!player) {
      next(new NotFoundError("Player not found"));
      return;
    }
    res.status(200).json(player);
  } catch (err) {
    next(err);
  }
});

app.post("/api/players/:id/flight", async (req, res, next) => {
  try {
    const { destination, price } = req.body;
    const player = await db.Player.findById(req.params.id);
    if (!player) {
      next(new NotFoundError("Player not found"));
      return;
    }
    player.city = destination;
    player.money -= price;
    player.stamina -= 20;
    await player.save();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

app.put("/api/players/:id/activity", async (req, res, next) => {
  try {
    const player = await db.Player.findById(req.params.id);
    if (!player) {
      next(new NotFoundError("Player not found"));
      return;
    }
    player.lastActive = new Date();
    await player.save();
    res.status(200).end();
  } catch (err) {
    next(err);
  }
});

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
    const numSpawn = Math.min(5 - customers.length, Math.floor(numHoursSinceLastActive / 2));

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

    res.status(200).json(customers);
  } catch (err) {
    next(err);
  }
});

app.get("/api/cities/text", async (req, res, next) => {
  try {
    const { q } = req.query;
    const cities = await db.City.find({ name: { $regex: `^${q}`, $options: "i" } }, "name");
    res.status(200).json(cities);
  } catch (err) {
    next(err);
  }
});

app.get("/api/cities/:id", async (req, res, next) => {
  try {
    const city = await db.City.findById(req.params.id, "name coords pointsOfInterest");
    if (!city) {
      next(new NotFoundError("City not found"));
      return;
    }
    res.status(200).json(city);
  } catch (err) {
    next(err);
  }
});

app.get("/api/flights", async (req, res, next) => {
  try {
    const { f, t } = req.query;
    const from = await db.City.findById(f, "name airlines");
    const to = await db.City.findById(t, "name airlines");
    if (!from || !to) {
      next(new NotFoundError("City not found"));
      return;
    }
    let flights = [...to.airlines, ...from.airlines.filter((a) => !to.airlines.find((aa) => a.name === aa.name))];
    const resp = await axios.get(
      `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${from.name}&destinations=${to.name}&key=AIzaSyA0HlNaNB-5MkrqB7FveaBP3mUb4JmZTPQ`
    );
    let { distance } = resp.data.rows[0].elements[0];
    distance = Number(distance.text.replace(/[^0-9.]/g, ""));
    const price = Math.round(50 + distance * 0.11);
    flights = flights.map((a) => ({ _id: a._id, name: a.name, image: a.image, price: price + random(100) }));
    res.status(200).json(flights);
  } catch (err) {
    next(err);
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
