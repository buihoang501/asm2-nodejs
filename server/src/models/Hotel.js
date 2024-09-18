//Get mongoose package
const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;

//Define Hotel Schema
const hotelSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
  },
  cheapestPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ["hotel", "apartments", "resorts", "villas", "cabins"],
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  distance: {
    type: String,
    required: true,
    min: 0,
  },
  photos: {
    type: [String],
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  featured: {
    type: Boolean,
    required: true,
  },
  rooms: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Room",
      required: true,
      trim: true,
    },
  ],
});

//Export Hotel Model
module.exports = mongoose.model("Hotel", hotelSchema);
