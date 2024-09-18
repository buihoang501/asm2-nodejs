//json web token package
const jwt = require("jsonwebtoken");

//User model
const User = require("../models/User");

//check auth token
exports.checkAuthToken = (req, res, next) => {
  //Get token from headers
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  //Token is empty
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: Missing Token!" });
  }
  try {
    //Decode get value
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    //Token is invalid
    return res.status(403).json({ message: "Forbidden: invalid token" });
  }
};

//check admin
exports.checkIsAdmin = async (req, res, next) => {
  try {
    //Get user with req.userId
    const user = await User.findById(req.userId);

    //Not admin
    if (!user.isAdmin) {
      return res
        .status(403)
        .json({ message: "Forbidden: Your are unauthorized!" });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};
