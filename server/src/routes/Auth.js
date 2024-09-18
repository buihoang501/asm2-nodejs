//Get express package
const express = require("express");

//Get body check from express validator
const { body } = require("express-validator");

//Get auth controllers
const authControllers = require("../controllers/Auth");

//User Model
const User = require("../models/User");

//check Authtoken
const { checkAuthToken } = require("../middlewares/auth");

//Router
const router = express.Router();

//Bcrypt
const bcrypt = require("bcryptjs");

//Signup Route
router.post(
  "/signup",
  [
    //Validate body signup
    //Check email
    body("email")
      //Check empty
      .notEmpty()
      .withMessage("Please enter your email")
      //Check valid email
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        //Check user exists in database
        if (user) {
          return Promise.reject("Email already exists");
        }
        return true;
      }),
    //Check password
    body("password")
      .notEmpty()
      //Check empty
      .withMessage("Please enter your password")
      //Check length password
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  //Use signup controller
  authControllers.postSignup
);

//Login Route
router.post(
  "/login",
  [
    //Validate body login
    //Check email
    body("email")
      //Check empty
      .notEmpty()
      .withMessage("Please enter your email")
      //Check valid email
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        //Check user exists in database
        if (!user) {
          return Promise.reject("Email does not exist");
        }
        //Fine
        return true;
      }),
    //Check password
    body("password")
      .notEmpty()
      //Check empty
      .withMessage("Please enter your password")
      .custom(async (value, { req }) => {
        //Check email from body
        if (!req.body.email) {
          throw new Error("Please enter your email before entering password");
        }

        //Find user with email
        const user = await User.findOne({ email: req.body.email });

        //Check user doesn't exist in database
        if (!user) {
          return Promise.reject("Invalid password");
        }

        //Comparing password
        const passwordMatching = await bcrypt.compare(value, user.password);

        //Not matching password
        if (!passwordMatching) {
          return Promise.reject("Invalid password");
        }
        //Fine
        return true;
      }),
  ],
  //Use login controller
  authControllers.postLogin
);

//Login Admin Route
router.post(
  "/login/admin",
  [
    //Validate body login
    //Check email
    body("email")
      //Check empty
      .notEmpty()
      .withMessage("Please enter your email")
      //Check valid email
      .isEmail()
      .withMessage("Invalid email")
      .custom(async (value, { req }) => {
        const user = await User.findOne({ email: value });
        //Check user exists in database
        if (!user) {
          return Promise.reject("Email does not exist");
        }
        //Fine
        return true;
      }),
    //Check password
    body("password")
      .notEmpty()
      //Check empty
      .withMessage("Please enter your password")
      .custom(async (value, { req }) => {
        //Check email from body
        if (!req.body.email) {
          throw new Error("Please enter your email before entering password");
        }

        //Find user with email
        const user = await User.findOne({ email: req.body.email });

        //Check user doesn't exist in database
        if (!user) {
          return Promise.reject("Invalid password");
        }

        //Comparing password
        const passwordMatching = await bcrypt.compare(value, user.password);

        //Not matching password
        if (!passwordMatching) {
          return Promise.reject("Invalid password");
        }
        //Fine
        return true;
      }),
  ],
  //Use admin login controller
  authControllers.postAdminLogin
);

//get current user logged in
router.get("/user", checkAuthToken, authControllers.getUser);

//Router Auth Router
module.exports = router;
