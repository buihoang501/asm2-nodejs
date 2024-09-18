//Hotel Model
const Hotel = require("../models/Hotel");

//Transaction Model
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const Room = require("../models/Room");

// Validation result
const { validationResult } = require("express-validator");

//get hotels
exports.getHotels = async (req, res, next) => {
  try {
    /* The number of hotels in HCM, Hanoi, DaNang, hotel type, apartments type,resorts type
      villas type, cabins type, Hotel sort by desending rating => top 3 rating
    */

    const [
      countHotelHCM,
      countHotelHanoi,
      countHotelDanang,
      countHotel,
      countApartments,
      countResorts,
      countVillas,
      countCabins,
      hotelSortDesRating,
    ] = await Promise.all([
      Hotel.find({
        city: "Ho Chi Minh",
      }).countDocuments(),
      Hotel.find({
        city: "Ha Noi",
      }).countDocuments(),
      Hotel.find({
        city: "Da Nang",
      }).countDocuments(),
      Hotel.find({
        type: "hotel",
      }).countDocuments(),
      Hotel.find({
        type: "apartments",
      }).countDocuments(),
      Hotel.find({
        type: "resorts",
      }).countDocuments(),
      Hotel.find({
        type: "villas",
      }).countDocuments(),
      Hotel.find({
        type: "cabins",
      }).countDocuments(),
      Hotel.find({}).sort({ rating: -1 }).limit(3),
    ]);

    //Response Json
    res.status(200).json({
      countHotelHCM,
      countHotelHanoi,
      countHotelDanang,
      countHotel,
      countApartments,
      countResorts,
      countVillas,
      countCabins,
      hotelSortDesRating,
    });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//post find hotels
exports.postFindHotels = async (req, res, next) => {
  //get body data
  const totalRoom = req.body.totalRoom;
  const maxPeople = req.body.maxPeople;
  const city = req.body.city;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  try {
    if (!city || !totalRoom || !maxPeople) {
      return res.status(404).json({ message: "Please provide a full info" });
    }

    //Get hotels by  query condition
    const hotels = await Hotel.find({}).populate("rooms");
    // apply conditions
    const hotelsByCity = hotels.filter((hotel) => {
      return (
        hotel.city.toString().toLowerCase().replace(/\s/g, "") ===
        city.toString().toLowerCase().replace(/\s/g, "")
      );
    });
    //When city not found
    if (hotelsByCity.length === 0) {
      return res.status(201).json({ hotelsFiltered: [], suitableRooms: [] });
    }

    //When city found => filterd by totalRoom and maxPeople
    const hotelsFiltered = hotelsByCity.filter((hotel) => {
      return hotel?.rooms?.some((room) => {
        return (
          +room.maxPeople === +maxPeople &&
          +room.roomNumbers.length === +totalRoom
        );
      });
    });

    //Array rooms suitable with maxPeople and  the number of rooms
    const suitableRooms = [];
    if (hotelsFiltered.length > 0) {
      hotelsFiltered.forEach((hotel) => {
        hotel.rooms.forEach((room) => {
          if (
            room.maxPeople === +maxPeople &&
            room.roomNumbers.length === +totalRoom
          ) {
            suitableRooms.push(room);
            return;
          }
        });
      });
    }

    // hotelsFiltered in hotelTransactions
    const hotelsFilteredIds = hotelsFiltered.map((hotel) => hotel._id);

    //hotel transactions
    const hotelTransactions = await Transaction.find({
      hotel: { $in: hotelsFilteredIds },
    });

    //hotel transactions by date range
    const hotelTransactionsByDate = hotelTransactions
      .filter((hotelTransaction) => {
        return !(
          new Date(startDate) > new Date(hotelTransaction.dateEnd) ||
          new Date(endDate) < new Date(hotelTransaction.dateStart)
        );
      })
      .map((hotelTransaction) => {
        return { hotelId: hotelTransaction.hotel, room: hotelTransaction.room };
      });

    //Case full rooms (No rooms book in date range)
    if (hotelTransactionsByDate?.length === 0) {
      return res
        .status(201)
        .json({ hotelsFiltered: hotelsFiltered, suitableRooms: [] });
    }

    //handle combine hotel rooms booked by date
    const combineResult = hotelTransactionsByDate.reduce((acc, curr) => {
      const { hotelId, room } = curr;
      if (acc[hotelId]) {
        acc[hotelId].room.push(...room);
      } else {
        acc[hotelId] = { hotelId, room };
      }
      return acc;
    }, {});

    const result = Object.values(combineResult).map((eachResult) => {
      return {
        hotelId: eachResult.hotelId,
        room: eachResult.room.filter(
          (value, index, self) => self.indexOf(value) === index
        ),
      };
    });

    const roomNumbers = [];

    //Get hotels with room numbers
    hotelsFiltered.forEach((hotel) => {
      hotel.rooms.forEach((room) => {
        room.roomNumbers.forEach((roomNumber) =>
          roomNumbers.push({ room: roomNumber, hotelId: hotel._id })
        );
      });
    });

    //Handle hotels with room numbers
    const combineResult2 = roomNumbers.reduce((acc, curr) => {
      const { hotelId, room } = curr;
      if (acc[hotelId]) {
        acc[hotelId].push(room);
      } else {
        acc[hotelId] = [room];
      }
      return acc;
    }, {});

    //finalResultIndexes
    const finalResultIndexes = [];
    result.forEach((eachResult, index) => {
      if (
        combineResult2[eachResult.hotelId].length !== eachResult.room.length
      ) {
        finalResultIndexes.push(index);
      }
    });

    //finalResultHotels
    const finalResultHotels = hotelsFiltered.filter((hotel, index) =>
      finalResultIndexes.includes(index)
    );

    //Send response  result
    res.status(200).json({
      hotelsFiltered: finalResultHotels,
      suitableRooms: suitableRooms,
    });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//get hotel detail
exports.getHotel = async (req, res, next) => {
  //get hotelId
  const hotelId = req.params.hotelId;

  //Check hotelId empty
  if (!hotelId) {
    return;
  }

  try {
    //find by Id in hotels collection
    const hotel = await Hotel.findById(hotelId).populate("rooms");

    //hotel transactions
    const hotelTransactions = await Transaction.find({ hotel: hotelId });

    //send result response
    res.status(200).json({ hotel: hotel, transactions: hotelTransactions });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//post reserve hotel
exports.reserveHotel = async (req, res, next) => {
  //get body values
  const {
    roomNumbers,
    email,
    phone,
    card,
    fullName,
    price,
    date,
    paymentMethod,
  } = req.body;

  //params hotelId
  const { hotelId } = req.params;

  if (
    !roomNumbers &&
    !email &&
    !phone &&
    !fullName &&
    !date &&
    !price &&
    !paymentMethod
  ) {
    return res.status(422).json({ message: "Invalid validation" });
  }
  try {
    //Updating user by providing information
    const updatedUser = await User.findById(req.userId);

    updatedUser.phoneNumber = phone;
    updatedUser.fullName = fullName;
    //Check if card exists
    if (card) {
      updatedUser.cardNumber = card;
    }

    //save user into users collection
    await updatedUser.save();
    if (!updatedUser) {
      return res.status(401).json({ message: "Unauthorized user!" });
    }

    //create a new transtation
    const newTransaction = await Transaction({
      payment: paymentMethod,
      dateStart: date.startDate,
      dateEnd: date.endDate,
      room: roomNumbers,
      hotel: hotelId,
      price: price,
      user: updatedUser._id,
    });
    //save into transactions  collection
    await newTransaction.save();
    return res.status(201).json({ message: "Reserve successfully!" });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//get admin hotels
exports.getAdminHotels = async (req, res, next) => {
  try {
    //get all hotels
    const hotels = await Hotel.find({});

    //sending response
    res.status(200).json({ hotels: hotels });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//admin delete hotel byId
exports.deleteAdminHotel = async (req, res, next) => {
  //get hotelId
  const { hotelId } = req.params;

  try {
    //get hotel Ids in transaction
    const transactions = await Transaction.find({});
    const hotelIds = transactions
      .map((transaction) => transaction.hotel.toString())
      .filter((hotelId, index, self) => {
        return self.indexOf(hotelId) === index;
      });

    const hotelInTransactions = hotelIds.find(
      (transactionHotelId) => transactionHotelId === hotelId
    );

    //Having hotel in transactions
    if (hotelInTransactions) {
      return res.status(403).json({
        message:
          "Forbidding to delete this hotel because it exists in transactions",
        delete: false,
      });
    }

    //Delete by Id and  it's not in transactions
    await Hotel.findByIdAndDelete({ _id: hotelId });
    res
      .status(200)
      .json({ message: "Delete hotel successfully", delete: true });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

//Admin create new hotel
exports.postAdminNewHotel = async (req, res, next) => {
  //get hotel body
  const {
    title,
    description,
    type,
    price,
    distance,
    city,
    images,
    feature,
    rooms,
    address,
    name,
  } = req.body;
  try {
    //errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //handle get roomIds to add
    const roomsFromRoom = await Room.find({});
    const roomIds = roomsFromRoom
      .filter((room) => rooms.split("\n").includes(room.title))
      .map((room) => room._id);
    const imageUrls = images.split("\n");

    //tweak type string
    const typeTweak = type.toLowerCase().replace(/\s/g, "");

    //create new hotel
    const newHotel = new Hotel({
      title,
      desc: description,
      type: typeTweak,
      cheapestPrice: price,
      distance,
      city,
      photos: imageUrls,
      featured: feature,
      rooms: roomIds,
      address,
      name: name.trimRight(),
    });
    //save to database
    await newHotel.save();
    res.status(201).json({ message: "Hotel created successfully" });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

// get admin detail hotel
exports.getAdminHotelDetail = async (req, res, next) => {
  //hotel id
  const { hotelId } = req.params;
  try {
    //Find hotel with hotelId
    const hotel = await Hotel.findById(hotelId).populate("rooms");

    //When hotel not found
    if (!hotel) {
      return res.status(404).json({ message: "Could't find hotel" });
    }

    //Sending response
    res.status(200).json({ hotel });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};

// Patch admin detail hotel
exports.patchAdminHotelDetail = async (req, res, next) => {
  //hotel id
  const { hotelId } = req.params;
  //get hotel body
  const {
    title,
    description,
    type,
    price,
    distance,
    city,
    images,
    feature,
    rooms,
    address,
    name,
  } = req.body;
  try {
    //errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    //handle get roomIds to add
    const roomsFromRoom = await Room.find({});
    const roomIds = roomsFromRoom
      .filter((room) => rooms.split("\n").includes(room.title))
      .map((room) => room._id);
    const imageUrls = images.split("\n");

    //tweak type string
    const typeTweak = type.toLowerCase().replace(/\s/g, "");
    //find hotel update
    const updatedHotel = await Hotel.findById({ _id: hotelId });
    updatedHotel.title = title;
    updatedHotel.desc = description;
    updatedHotel.type = typeTweak;
    updatedHotel.cheapestPrice = price;
    updatedHotel.distance = distance;
    updatedHotel.city = city;
    updatedHotel.photos = imageUrls;
    updatedHotel.featured = feature;
    updatedHotel.rooms = roomIds;
    updatedHotel.address = address;
    updatedHotel.name = name.trimRight().trimLeft();

    //save update hotel to database
    await updatedHotel.save();
    res.status(201).json({ message: "Hotel updated successfully" });
  } catch (error) {
    //Config error to error middleware
    const err = new Error(error);
    err.httpStatus = 500;
    next(err);
  }
};
