//GET JWT
const jwt = require("jsonwebtoken");
//Bcryptjs
const bcrypt = require("bcryptjs");

//Get result validation from express validator
const { validationResult } = require("express-validator");

//User Model
const User = require("../models/User");

//Sign up logic handler
exports.postSignup = async (req, res, next) => {
  //Get body value
  const email = req.body?.email || "";
  const password = req.body?.password || "";
  //Errors when validating
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Send response errors array
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    //Hash pasword
    const hashedPassword = await bcrypt.hash(password, 10);
    //Create new user
    const user = new User({
      email: email,
      password: hashedPassword,
    });

    //Save user to database
    const savedUser = await user.save();

    //Create jwt token
    const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    //Send response token
    res.status(201).json({ token, email: savedUser.email });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);

    err.httpStatus = 500;
    next(err);
  }
};

//Sign up logic handler
exports.postLogin = async (req, res, next) => {
  //Get body email
  const email = req.body.email;

  //Errors when validating
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Send response errors array
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email: email });
    //Create jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    //Send response token
    res.status(201).json({ token, email: user.email });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//Admin login logic handler
exports.postAdminLogin = async (req, res, next) => {
  //Get body email
  const email = req.body.email;

  //Errors when validating
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Send response errors array
    return res.status(422).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email: email });
    //Create jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3h",
    });

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Forbidden - UnAuthorized" });
    }

    //Send response token
    res.status(201).json({ token, email: user.email });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//get current user logged in
exports.getUser = async (req, res, next) => {
  //get email from body
  try {
    if (!req.userId) {
      return res.status(400).json({ message: "Could not find userId" });
    }
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({
      fullName: user.fullName,
      phone: user.phoneNumber,
      card: user.cardNumber,
    });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};
