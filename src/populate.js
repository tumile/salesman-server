require("dotenv").config();
const cities = require("./cities.json");
const db = require("./db");

cities.forEach(async (c) => await db.City.create(c));
