//Config env
require("dotenv").config();
//Get package/module/ relavant objects
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/Auth");
const hotelRoutes = require("./src/routes/Hotel");
const transactionRoutes = require("./src/routes/Transaction");
const roomRoutes = require("./src/routes/Room");

//Initializing express app
const app = express();
//applying middleware
app.use(express.json()); // json body parsing
app.use(cors()); // crossing site resource sharing
app.use("/api/auth", authRoutes); //Using auth routes middleware
app.use("/api/hotel", hotelRoutes); //Using hotel routes middleware
app.use("/api/transactions", transactionRoutes); //Using transaction routes middleware
app.use("/api/rooms", roomRoutes); //Using room routes middleware
//Error middleware
app.use((error, req, res, next) => {
  res.status(error.httpStatus).json({ message: error.message });
});

//PORT definition
const PORT = 5000;

//DB connection
connectDB()
  .then(() => {
    console.log("DB Connected");
    //Listening server on port 5000
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
