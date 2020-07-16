const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true });

const playerSchema = new mongoose.Schema(
  {
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
  }
  // { autoIndex: false }
);

module.exports = {
  Player: mongoose.model("Player", playerSchema),
};
