const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

const playerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  money: {
    type: Number,
    required: true,
  },
  stamina: {
    type: Number,
    required: true,
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true,
  },
  customers: {
    type: [
      {
        name: String,
        image: String,
        price: Number,
        message: String,
        city: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "City",
        },
        expireTime: Date,
      },
    ],
    required: true,
  },
  lastActive: {
    type: Date,
    default: new Date(),
  },
});

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  coords: {
    type: [Number, Number],
    required: true,
  },
  airlines: {
    type: [
      {
        name: String,
        image: String,
      },
    ],
    required: true,
  },
  pointsOfInterest: {
    type: [
      {
        name: String,
        image: String,
        description: String,
        coords: [Number, Number],
      },
    ],
    required: true,
  },
});

module.exports = {
  Player: mongoose.model("Player", playerSchema),
  City: mongoose.model("City", citySchema),
};
