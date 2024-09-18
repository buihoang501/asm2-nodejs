//Get mongoose package
const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;

//Define Room Schema
const roomSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    maxPeople: {
      type: Number,
      required: true,
      min: 0,
    },
    desc: {
      type: String,
      required: true,
    },

    roomNumbers: {
      type: [Number],
      required: true,
    },
  },
  { timestamps: true }
);

//Export User Model
module.exports = mongoose.model("Room", roomSchema);
