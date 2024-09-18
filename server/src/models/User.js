//Get mongoose package
const mongoose = require("mongoose");

//Schema
const Schema = mongoose.Schema;

//Define User Schema
const userSchema = new Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  fullName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  cardNumber: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

//Export User Model
module.exports = mongoose.model("User", userSchema);
