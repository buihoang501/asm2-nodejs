//Get express package
const express = require("express");
//Router
const router = express.Router();

//Hotel model
const Hotel = require("../models/Hotel");

//Hotel model
const Room = require("../models/Room");

//Room controllers
const roomControllers = require("../controllers/Room");

//Validating body
const { body } = require("express-validator");

//check jwt token middleware
const { checkAuthToken, checkIsAdmin } = require("../middlewares/auth");

//get rooms
router.get("/", checkAuthToken, checkIsAdmin, roomControllers.getRooms);

//create new room
router.post(
  "/new-room",
  checkAuthToken,
  checkIsAdmin,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .custom(async (value, { req }) => {
        // trim value
        const newValueString = value.trimRight().trimLeft();

        // query exist with title
        const existingRoom = await Room.findOne({ title: newValueString });
        console.log(newValueString);
        if (existingRoom) {
          return Promise.reject(
            `Room already exists with ${newValueString} title`
          );
        }
        return true;
      }),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price is numeric")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Price must be equal or greater than 0");
        }
        return true;
      }),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Description is at least 10 characters"),
    body("hotel")
      .notEmpty()
      .withMessage("Hotel is required")
      .custom(async (value, { req }) => {
        const hotel = await Hotel.findOne({ name: value });
        if (!hotel) {
          return Promise.reject(`Cannot find ${value}  in hotels collection`);
        }
        return true;
      }),
    body("rooms")
      .notEmpty()
      .withMessage("Rooms are required")
      .custom((value, { req }) => {
        const roomNumbers = value.replace(/\s/g, "").split(",");

        const findNonNumberEl = roomNumbers.find((room) => {
          return isNaN(room);
        });
        if (findNonNumberEl) {
          throw new Error("Rooms input is not valid");
        }
        return true;
      }),
    body("maxPeople")
      .notEmpty()
      .withMessage("Max people is required")
      .isNumeric()
      .withMessage("Max people is numeric")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Max people must be equal or greater than 0");
        }
        return true;
      }),
  ],
  roomControllers.postAdminNewRoom
);

//get admin room detail
router.get("/:roomId", checkAuthToken, roomControllers.getAdminRoomDetail);

//patch admin room detail
router.patch(
  "/:roomId",
  checkAuthToken,
  checkIsAdmin,
  [
    body("title")
      .notEmpty()
      .withMessage("Title is required")
      .custom(async (value, { req }) => {
        //current room
        const currentRoom = await Room.findById(req.params.roomId);

        // trim value
        const newValueString = value.trimRight().trimLeft();

        // query exist with title
        const existingRoom = await Room.findOne({ title: newValueString });
        if (existingRoom && existingRoom.title !== currentRoom.title) {
          return Promise.reject(
            `Room already exists with ${newValueString} title`
          );
        }
        return true;
      }),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .isNumeric()
      .withMessage("Price is numeric")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Price must be equal or greater than 0");
        }
        return true;
      }),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Description is at least 10 characters"),
    body("hotel").custom(async (value, { req }) => {
      //roomId
      const { roomId } = req.params;
      const hotel = await Hotel.findOne({ name: value });
      const rooms = hotel?.rooms;
      if (rooms?.length > 0) {
        const existingRoom = rooms.find((room) => room.toString() === roomId);
        if (existingRoom) {
          throw new Error(`Room already exists in ${value} hotel`);
        }
      }

      return true;
    }),
    body("rooms")
      .notEmpty()
      .withMessage("Rooms are required")
      .custom((value, { req }) => {
        const roomNumbers = value.replace(/\s/g, "").split(",");

        const findNonNumberEl = roomNumbers.find((room) => {
          return isNaN(room);
        });
        if (findNonNumberEl) {
          throw new Error("Rooms input is not valid");
        }
        return true;
      }),
    body("maxPeople")
      .notEmpty()
      .withMessage("Max people is required")
      .isNumeric()
      .withMessage("Max people is numeric")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Max people must be equal or greater than 0");
        }
        return true;
      }),
  ],
  roomControllers.patchAdminRoomDetail
);

//delete room
router.delete(
  "/:roomId",
  checkAuthToken,
  checkIsAdmin,
  roomControllers.deleteAdminRoom
);

//Router Auth Router
module.exports = router;
