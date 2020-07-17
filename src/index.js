require("dotenv").config();
const { AssertionError, strict: assert } = require("assert");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const multer = require("multer");
const db = require("./db");
const { upload } = require("./s3");

const multipart = multer({ dest: "src/uploads" });

class NotFoundError extends Error {}

const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.get("/api/leaderboard", async (req, res, next) => {
  try {
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
    player = await db.Player.create({
      username,
      password: hashedPassword,
      image: uploadedImage,
      money: 10000,
      stamina: 100,
      city: amsterdam.id,
      customers: [],
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

app.get("/api/players/:id/customers", async (req, res, next) => {
  try {
    const { customers } = await db.Player.findById(req.params.id, "customers");
    assert.ok(customers);
    res.status(200).json(customers);
  } catch (err) {
    next(new NotFoundError("Player not found"));
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
    assert.ok(city);
    res.status(200).json(city);
  } catch (err) {
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
