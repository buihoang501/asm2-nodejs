//Get express package
const express = require("express");
//Router
const router = express.Router();

//Room model
const Room = require("../models/Room");

//Hotel model
const Hotel = require("../models/Hotel");

//express validator
const { body } = require("express-validator");

//Hotel controllers
const hotelControllers = require("../controllers/Hotel");

//check jwt token middleware
const { checkAuthToken, checkIsAdmin } = require("../middlewares/auth");

//Get hotels
router.get("/", hotelControllers.getHotels);

//Post queries hotels
router.post("/", hotelControllers.postFindHotels);

//Post new hotel
router.post(
  "/new-hotel",
  checkAuthToken,
  checkIsAdmin,
  //Check body validation
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .custom(async (value, { req }) => {
        const existingHotelWithUniqueName = await Hotel.findOne({
          name: value.trimRight().trimLeft(),
        });
        if (existingHotelWithUniqueName) {
          return Promise.reject("Hotel is existing with this name already");
        }
        return true;
      }),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .custom((value, { req }) => {
        //tweaking value string
        const typeLiteral = value.toLowerCase().replace(/\s/g, "");
        console.log();
        //Check type is matching with enum in hotel model?
        if (
          !(
            typeLiteral === "hotel" ||
            typeLiteral === "apartments" ||
            typeLiteral === "resorts" ||
            typeLiteral === "villas" ||
            typeLiteral === "cabins"
          )
        ) {
          throw new Error(
            "Type is only in hotel/apartments/resorts/villas/cabins"
          );
        }
        return true;
      }),
    body("city").notEmpty().withMessage("City is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("distance")
      .notEmpty()
      .withMessage("Distance is required")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Distance must be equal or greater than 0");
        }
        return true;
      }),
    body("title").notEmpty().withMessage("Title is required"),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Description is required and at least 10 characters"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Price must be equal or greater than 0");
        }
        return true;
      }),
    body("images")
      .notEmpty()
      .withMessage("Images is required")
      .custom((value, { req }) => {
        //get image URLs arr
        const imageUrls = value.split("\n");

        //error type url
        const errorImageUrl = imageUrls.find((url) => {
          return !(
            url.trim().startsWith("http://") ||
            url.trim().startsWith("https://")
          );
        });

        //check error type url
        if (errorImageUrl) {
          throw new Error("Images URL have some invalid URL");
        }

        //error image urls have whitespace
        const errorImageUrlSpace = imageUrls.find((url) => url.includes(" "));
        //Check error image urls have whitespace
        if (errorImageUrlSpace) {
          throw new Error("Images URL could not contain whitespace");
        }
        return true;
      }),
    body("feature").isBoolean().withMessage("Feature must be boolean"),
    body("rooms")
      .notEmpty()
      .withMessage("Rooms is required")
      .custom(async (value, { req }) => {
        //get rooms body
        const roomBodyTitles = value.split("\n");

        //get all rooms in rooms collection
        const rooms = await Room.find({});

        //room titles
        const roomTitles = rooms.map((room) => room.title);

        //Find any roomsBodyTitle not in roomTitles from db
        const roomNotInDb = roomBodyTitles.find(
          (roomBodyTitle) => !roomTitles.includes(roomBodyTitle.trimRight())
        );

        //Check rooms in not matching rooms in database
        if (roomNotInDb) {
          throw new Error("Sorry It looks like you just added non exist-rooms");
        }
        return true;
      }),
  ],
  hotelControllers.postAdminNewHotel
);

//Get admin hotels
router.get(
  "/hotels",
  checkAuthToken,
  checkIsAdmin,
  hotelControllers.getAdminHotels
);

//Get admin hotel detail
router.get(
  "/hotels/:hotelId",
  checkAuthToken,
  checkIsAdmin,
  hotelControllers.getAdminHotelDetail
);
//Patch admin hotel detail
router.patch(
  "/hotels/:hotelId",
  checkAuthToken,
  checkIsAdmin,
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required")
      .custom(async (value, { req }) => {
        // hotelId
        const { hotelId } = req.params;
        const currentHotel = await Hotel.findById(hotelId);

        const existingHotelWithUniqueName = await Hotel.findOne({
          name: value.trimRight().trimLeft(),
        });

        if (
          existingHotelWithUniqueName &&
          existingHotelWithUniqueName.name !== currentHotel.name
        ) {
          return Promise.reject("Hotel is existing with this name already");
        }
        return true;
      }),
    body("type")
      .notEmpty()
      .withMessage("Type is required")
      .custom((value, { req }) => {
        //tweaking value string
        const typeLiteral = value.toLowerCase().replace(/\s/g, "");
        console.log();
        //Check type is matching with enum in hotel model?
        if (
          !(
            typeLiteral === "hotel" ||
            typeLiteral === "apartments" ||
            typeLiteral === "resorts" ||
            typeLiteral === "villas" ||
            typeLiteral === "cabins"
          )
        ) {
          throw new Error(
            "Type is only in hotel/apartments/resorts/villas/cabins"
          );
        }
        return true;
      }),
    body("city").notEmpty().withMessage("City is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("distance")
      .notEmpty()
      .withMessage("Distance is required")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Distance must be equal or greater than 0");
        }
        return true;
      }),
    body("title").notEmpty().withMessage("Title is required"),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Description is required and at least 10 characters"),
    body("price")
      .notEmpty()
      .withMessage("Price is required")
      .custom((value, { req }) => {
        if (value < 0) {
          throw new Error("Price must be equal or greater than 0");
        }
        return true;
      }),
    body("images")
      .notEmpty()
      .withMessage("Images is required")
      .custom((value, { req }) => {
        //get image URLs arr
        const imageUrls = value.split("\n");

        //error type url
        const errorImageUrl = imageUrls.find((url) => {
          return !(
            url.trim().startsWith("http://") ||
            url.trim().startsWith("https://")
          );
        });

        //check error type url
        if (errorImageUrl) {
          throw new Error("Images URL have some invalid URL");
        }

        //error image urls have whitespace
        const errorImageUrlSpace = imageUrls.find((url) => url.includes(" "));
        //Check error image urls have whitespace
        if (errorImageUrlSpace) {
          throw new Error("Images URL could not contain whitespace");
        }
        return true;
      }),
    body("feature").isBoolean().withMessage("Feature must be boolean"),
    body("rooms")
      .notEmpty()
      .withMessage("Rooms is required")
      .custom(async (value, { req }) => {
        //get rooms body
        const roomBodyTitles = value.split("\n");

        //get all rooms in rooms collection
        const rooms = await Room.find({});

        //room titles
        const roomTitles = rooms.map((room) => room.title);

        //Find any roomsBodyTitle not in roomTitles from db
        const roomNotInDb = roomBodyTitles.find(
          (roomBodyTitle) => !roomTitles.includes(roomBodyTitle.trimRight())
        );

        //Check rooms in not matching rooms in database
        if (roomNotInDb) {
          throw new Error("Sorry It looks like you just added non exist-rooms");
        }
        return true;
      }),
  ],
  hotelControllers.patchAdminHotelDetail
);

//Get hotel
router.get("/:hotelId", hotelControllers.getHotel);

//Delete admin hotel
router.delete(
  "/:hotelId",
  checkAuthToken,
  checkIsAdmin,
  hotelControllers.deleteAdminHotel
);

//Post reserve hotel
router.post("/:hotelId", checkAuthToken, hotelControllers.reserveHotel);

//Router Auth Router
module.exports = router;
