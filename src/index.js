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

const app = express();
app.use(morgan("tiny"));
app.use(bodyParser.json());

app.post("/api/signin", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    assert.ok(username, "Missing username or password");
    assert.ok(password, "Missing username or password");

    const player = await db.Player.findOne({ username });
    assert.ok(player, "Invalid username or password");

    const matched = await bcrypt.compare(password, player.password);
    assert.ok(matched, "Invalid username or password");

    const token = jwt.sign({ id: player.id }, process.env.SECRET_KEY);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

app.post("/api/signup", multipart.single("image"), async (req, res, next) => {
  let image;
  try {
    image = req.file;
    const { username, password } = req.body;
    assert.ok(image, "Missing image");
    assert.ok(username, "Missing username or password");
    assert.ok(password, "Missing username or password");

    const player = await db.Player.findOne({ username });
    assert.ok(!player, "Player with this name already exists");

    const uploadedImage = await upload(image.path, username);
    const hashedPassword = await bcrypt.hash(password, 10);
    const { id } = await db.Player.create({
      username,
      password: hashedPassword,
      image: uploadedImage,
    });
    const token = jwt.sign({ id }, process.env.SECRET_KEY);

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  } finally {
    if (image) {
      fs.unlinkSync(image.path);
    }
  }
});

app.get("/api/players/:id", async (req, res) => {
  res.status(200).json({});
});

app.use((err, req, res, next) => {
  if (err instanceof AssertionError) {
    res.status(400);
  } else {
    res.status(500);
  }
  res.json({ error: err.message });
});

app.listen(process.env.PORT);
