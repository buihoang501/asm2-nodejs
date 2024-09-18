//Room model
const Room = require("../models/Room");

//Hotel model
const Hotel = require("../models/Hotel");
//Transaction model
const Transaction = require("../models/Transaction");

//validation result
const { validationResult } = require("express-validator");

//get all rooms
exports.getRooms = async (req, res, next) => {
  try {
    //query all rooms
    const rooms = await Room.find({});
    //sending response
    res.status(200).json({ rooms: rooms });
  } catch (error) {
    //config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//admin delete room byId
exports.deleteAdminRoom = async (req, res, next) => {
  //get roomId
  const { roomId } = req.params;

  try {
    //get room Ids in transaction, and roomIds
    const [transactions, roomsInDB] = await Promise.all([
      Transaction.find({}).populate("hotel"),
      Room.find({}),
    ]);
    //get hotels in transactions
    const hotelsAndRooms = transactions.map((transaction) => {
      return { roomsInHotel: transaction.hotel.rooms, rooms: transaction.room };
    });
    //roomIdsInTransactions
    let roomIdsResult = [];

    //loop through hotelsAndRooms
    hotelsAndRooms.forEach((hotelAndRoom) => {
      hotelAndRoom.roomsInHotel.forEach((roomId) => {
        //Find specific room
        const room = roomsInDB.find((roomInDB) => {
          return roomInDB._id.toString() === roomId.toString();
        });
        const findEl =
          room &&
          hotelAndRoom.rooms.find((roomReserved) => {
            return room.roomNumbers.includes(roomReserved);
          });
        if (findEl && !roomIdsResult.includes(roomId)) {
          roomIdsResult.push(roomId);
        }
      });
    });

    const currentRoomInTransactions = roomIdsResult.find(
      (roomIdResult) => roomIdResult.toString() === roomId
    );

    //Having room in transactions
    if (currentRoomInTransactions) {
      return res.status(403).json({
        message:
          "Forbidding to delete this room because it exists in transactions",
        delete: false,
      });
    }
    // Updating hotels contains this room
    await Hotel.updateMany({}, { $pull: { rooms: roomId } });
    // Delete by Id and  it's not in transactions
    await Room.findByIdAndDelete({ _id: roomId });

    res.status(200).json({ message: "Delete room successfully", delete: true });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//admin create new room
exports.postAdminNewRoom = async (req, res, next) => {
  //get rooms body
  const { title, description, rooms, maxPeople, hotel, price } = req.body;
  try {
    //errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //tweak roomNumbers
    const roomNumbers = rooms.replace(/\s/g, "").split(",");

    //create new room after validating success
    const newRoom = await Room({
      roomNumbers,
      title: title.trimLeft().trimRight(),
      desc: description,
      maxPeople,
      price,
    });
    //save to database
    await newRoom.save();

    //updated hotel after adding new room
    const updatedHotel = await Hotel.findOne({ name: hotel });

    const updatedRoomNumbers = [...updatedHotel.rooms];
    if (!updatedRoomNumbers.includes(newRoom._id.toString())) {
      updatedRoomNumbers.push(newRoom._id.toString());
    }

    updatedHotel.rooms = updatedRoomNumbers;
    await updatedHotel.save();

    res.status(201).json({ message: "Room created successfully" });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//get admin room detail
exports.getAdminRoomDetail = async (req, res, next) => {
  //room id
  const { roomId } = req.params;
  try {
    //Find room with roomId
    const room = await Room.findById(roomId);

    //When room not found
    if (!room) {
      return res.status(404).json({ message: "Could't find room" });
    }

    //Sending response
    res.status(200).json({ room });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//patch admin room detail
exports.patchAdminRoomDetail = async (req, res, next) => {
  //room id
  const { roomId } = req.params;
  //get rooms body
  const { title, description, rooms, maxPeople, hotel, price } = req.body;
  try {
    //errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    //tweak roomNumbers
    const roomNumbers = rooms.replace(/\s/g, "").split(",");

    //create updating room after validating success

    const updatedRoom = await Room.findById({ _id: roomId });
    updatedRoom.title = title.trimLeft().trimRight();
    updatedRoom.desc = description;
    updatedRoom.maxPeople = maxPeople;
    updatedRoom.price = price;
    updatedRoom.roomNumbers = roomNumbers;

    //save to database
    await updatedRoom.save();

    //updated hotel after adding new room
    if (hotel) {
      const updatedHotel = await Hotel.findOne({ name: hotel });

      const updatedRoomNumbers = [...updatedHotel.rooms];
      if (!updatedRoomNumbers.includes(newRoom._id.toString())) {
        updatedRoomNumbers.push(newRoom._id.toString());
      }

      updatedHotel.rooms = updatedRoomNumbers;
      await updatedHotel.save();
    }

    res.status(201).json({ message: "Room updated successfully" });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};
