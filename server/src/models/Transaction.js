//Get mongoose package
const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;

//Define Transaction Schema
const transacSchema = new Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    room: {
      type: [Number],
      required: true,
    },
    dateStart: {
      type: Date,
      required: true,
    },
    dateEnd: {
      type: Date,

      required: true,
    },
    price: { type: Number, required: true },
    payment: {
      type: String,
      enum: ["Credit Card", "Cash"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Booked", "Checkin", "Checkout"],
      default: "Booked",
    },
  },
  { timestamps: true }
);

//Export Transaction Model
module.exports = mongoose.model("Transaction", transacSchema);
