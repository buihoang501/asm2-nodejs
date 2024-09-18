//Get express package
const express = require("express");
//Router
const router = express.Router();

//Transaction controllers
const transactionControllers = require("../controllers/Transaction");

//check jwt token middleware
const { checkAuthToken } = require("../middlewares/auth");

//get transactions
router.get("/", checkAuthToken, transactionControllers.getTransactions);

//get transactions - admin page
router.get("/all", checkAuthToken, transactionControllers.getAdminTransactions);

//get latest transactions
router.get(
  "/latest",
  checkAuthToken,
  transactionControllers.getLatestTransactions
);

//Router Auth Router
module.exports = router;
