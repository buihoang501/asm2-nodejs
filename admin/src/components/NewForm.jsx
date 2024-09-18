import React, { useState, useEffect } from "react";

//css module
import classes from "./NewForm.module.css";

//react redux hooks
import { useSelector } from "react-redux";

//hotel services
import { createNewHotel, updateHotel } from "../services/hotel/hotelServices";
//room services
import { createNewRoom, updateRoom } from "../services/room/roomServices";

//react router dom
import { useSearchParams, useNavigate } from "react-router-dom";

//error modal
import ErrorModal from "../ui/ErrorModal";

const NewForm = ({
  hotel,
  rooms,
  setRooms,
  isLoading,
  room,
  hotels,
  editing,
  hotelDetail,
  roomDetail,
}) => {
  const [, setLocation] = useSearchParams({
    find: hotel ? "new-hotel" : "new-room",
  });

  //navigate
  const navigate = useNavigate();

  //get token
  const { token } = useSelector((state) => state.auth);

  //errors state
  const [errors, setErrors] = useState([]);

  //set show error modal
  const [showError, setShowError] = useState(false);

  //hotel info state
  const [hotelInfo, setHotelInfo] = useState({
    name: hotelDetail?.name ? hotelDetail.name : "",
    type: hotelDetail?.type ? hotelDetail.type : "",
    city: hotelDetail?.city ? hotelDetail.city : "",
    address: hotelDetail?.address ? hotelDetail.address : "",
    distance: hotelDetail?.distance ? hotelDetail.distance : null,
    title: hotelDetail?.title ? hotelDetail.title : "",
    description: hotelDetail?.desc ? hotelDetail.desc : "",
    price: hotelDetail?.cheapestPrice ? hotelDetail.cheapestPrice : null,
    images:
      hotelDetail?.photos.length > 0 ? hotelDetail?.photos.join("\n") : "",
    feature: hotelDetail?.featured ? hotelDetail?.featured : false,
  });

  // room info state
  const [roomInfo, setRoomInfo] = useState({
    title: roomDetail?.title ? roomDetail?.title : "",
    price: roomDetail?.price ? roomDetail?.price : null,
    maxPeople: roomDetail?.maxPeople ? roomDetail?.maxPeople : null,
    newRooms: roomDetail?.roomNumbers ? roomDetail?.roomNumbers.join(",") : "",
    roomDesc: roomDetail?.desc ? roomDetail?.desc : "",
    hotel: "",
  });

  //handle hotel info change
  const hotelInfoChangeHandler = (e) => {
    setHotelInfo((prevHotelInfo) => {
      return {
        ...prevHotelInfo,
        [e.target.name]: e.target.value,
      };
    });
  };

  //when updating hotel, set rooms
  useEffect(() => {
    if (hotel && editing) {
      setRooms(hotelDetail?.rooms);
    }
  }, [editing, hotelDetail, hotel, setRooms]);

  //handle room info change
  const roomInfoChangeHandler = (e) => {
    setRoomInfo((prevRoomInfo) => {
      return {
        ...prevRoomInfo,
        [e.target.name]: e.target.value,
      };
    });
  };

  // handle submit new hotel or new room
  const addNewHandler = async (e) => {
    // prevent default behavior
    e.preventDefault();

    //Create new hotel
    if (hotel && !editing) {
      const data = await createNewHotel(token, {
        name: hotelInfo.name,
        type: hotelInfo.type,
        city: hotelInfo.city,
        address: hotelInfo.address,
        distance: hotelInfo.distance,
        title: hotelInfo.title,
        description: hotelInfo.description,
        price: hotelInfo.price,
        images: hotelInfo.images
          .split("\n")
          .filter((value) => value !== "")
          .join("\n")
          .trim(),
        feature: hotelInfo.feature,
        rooms: rooms
          .map((room) => {
            if (room.hasOwnProperty("title")) {
              return room.title;
            }
            return room;
          })
          .join("\n"),
      });
      //Errors when validating
      if (!data?.message && data?.errors?.length > 0) {
        setErrors(data.errors);
        setShowError(true);
        return;
      }

      //success
      if (data?.message) {
        setShowError(false);
        //reset input values
        setHotelInfo({
          name: "",
          type: "",
          city: "",
          address: "",
          distance: null,
          title: "",
          description: "",
          price: null,
          images: "",
          feature: false,
        });
        //redirect to hotels
        return setLocation({ find: "hotels" });
      }
    }

    //Create new room
    if (room && !editing) {
      const data = await createNewRoom(token, {
        title: roomInfo.title,
        price: roomInfo.price,
        description: roomInfo.roomDesc,
        rooms: roomInfo.newRooms,
        hotel: roomInfo.hotel,
        maxPeople: roomInfo.maxPeople,
      });

      //Errors when validating
      if (!data?.message && data?.errors?.length > 0) {
        setErrors(data.errors);
        setShowError(true);
        return;
      }

      //success
      if (data?.message) {
        setShowError(false);
        //reset input values
        setRoomInfo({
          title: "",
          price: null,
          maxPeople: null,
          newRooms: "",
          roomDesc: "",
          hotel: "",
        });
        //redirect to rooms
        return setLocation({ find: "rooms" });
      }
    }

    //Updating hotel
    if (hotel && editing) {
      const data = await updateHotel(
        token,
        {
          name: hotelInfo.name,
          type: hotelInfo.type,
          city: hotelInfo.city,
          address: hotelInfo.address,
          distance: hotelInfo.distance,
          title: hotelInfo.title,
          description: hotelInfo.description,
          price: hotelInfo.price,
          images: hotelInfo.images
            .split("\n")
            .filter((value) => value !== "")
            .join("\n")
            .trim(),
          feature: hotelInfo.feature,
          rooms: rooms
            .map((room) => {
              if (room.hasOwnProperty("title")) {
                return room.title;
              }
              return room;
            })
            .join("\n"),
        },
        hotelDetail?._id
      );
      //Errors when validating
      if (!data?.message && data?.errors?.length > 0) {
        setErrors(data.errors);
        setShowError(true);
        return;
      }

      //success
      if (data?.message) {
        setShowError(false);
        //reset input values
        setHotelInfo({
          name: "",
          type: "",
          city: "",
          address: "",
          distance: null,
          title: "",
          description: "",
          price: null,
          images: "",
          feature: false,
        });
        //redirect to hotels
        return navigate("/?find=hotels");
      }
    }
    //Updating room
    if (room && editing) {
      const data = await updateRoom(
        token,
        {
          title: roomInfo.title,
          price: roomInfo.price,
          description: roomInfo.roomDesc,
          rooms: roomInfo.newRooms,
          hotel: roomInfo?.hotel,
          maxPeople: roomInfo.maxPeople,
        },
        roomDetail?._id
      );

      //Errors when validating
      if (!data?.message && data?.errors?.length > 0) {
        setErrors(data.errors);
        setShowError(true);
        return;
      }

      //success
      if (data?.message) {
        setShowError(false);
        //reset input values
        setRoomInfo({
          title: "",
          price: null,
          maxPeople: null,
          newRooms: "",
          roomDesc: "",
          hotel: "",
        });
        //redirect to rooms
        return navigate("/?find=rooms");
      }
    }
  };

  return (
    <>
      {!isLoading && showError && (
        <ErrorModal setShowError={setShowError} errors={errors} />
      )}
      {isLoading && <p>Loading form...</p>}
      {!isLoading && (
        <div className={classes.form}>
          <div className={classes.banner}>
            {hotel && !editing && "Add New Product"}
            {!hotel && !editing && "Add New Room"}
            {hotel && editing && "Editing Product"}
            {!hotel && editing && "Editing Room"}
          </div>
          <form onSubmit={addNewHandler} noValidate>
            <>
              {room && (
                <>
                  <div>
                    <div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="title">
                          Title
                          <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder="2 bed room"
                            value={roomInfo.title}
                            onChange={roomInfoChangeHandler}
                          />
                        </label>
                      </div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="price">
                          Price
                          <input
                            min="0"
                            type="number"
                            id="price"
                            name="price"
                            placeholder="100"
                            value={roomInfo.price}
                            onChange={roomInfoChangeHandler}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="room-description">
                          Description
                          <input
                            type="text"
                            id="room-description"
                            name="roomDesc"
                            placeholder="King size bed, 1 bathroom"
                            value={roomInfo.roomDesc}
                            onChange={roomInfoChangeHandler}
                          />
                        </label>
                      </div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="max-people">
                          Max People
                          <input
                            min="0"
                            type="number"
                            id="max-people"
                            name="maxPeople"
                            placeholder="2"
                            value={roomInfo.maxPeople}
                            onChange={roomInfoChangeHandler}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="new-rooms">
                        Rooms
                        <textarea
                          name="newRooms"
                          id="new-rooms"
                          cols="30"
                          rows="2"
                          value={roomInfo.newRooms}
                          placeholder="give comma between room numbers."
                          onChange={roomInfoChangeHandler}
                        ></textarea>
                      </label>
                    </div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="new-hotel">
                        Choose a hotel
                        <select
                          className={classes["choose-hotel"]}
                          name="hotel"
                          id="new-hotel"
                          onChange={roomInfoChangeHandler}
                        >
                          <option value="">Choose hotel</option>
                          {hotels.length > 0 ? (
                            hotels.map((hotel) => (
                              <option key={hotel._id} value={hotel.name}>
                                {hotel.name}
                              </option>
                            ))
                          ) : (
                            <option value="0">No hotel</option>
                          )}
                        </select>
                      </label>
                    </div>
                    <button type="submit" className={`${classes.submit}`}>
                      Send
                    </button>
                  </div>
                </>
              )}

              {hotel && (
                <div>
                  <div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="name">
                        Name
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="My Hotel"
                          value={hotelInfo.name}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="city">
                        City
                        <input
                          type="text"
                          id="city"
                          name="city"
                          placeholder="New York"
                          value={hotelInfo.city}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="distance">
                        Distance from City Center
                        <input
                          type="number"
                          id="distance"
                          name="distance"
                          placeholder="500"
                          min={0}
                          value={hotelInfo.distance}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="description">
                        Description
                        <input
                          type="text"
                          id="description"
                          name="description"
                          placeholder="Description"
                          value={hotelInfo.description}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="images">
                        Images
                        <textarea
                          name="images"
                          id="images"
                          cols="10"
                          rows="4"
                          value={hotelInfo.images}
                          onChange={hotelInfoChangeHandler}
                        ></textarea>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className={classes["form-control"]}>
                      <label htmlFor="type">
                        Type
                        <input
                          type="text"
                          id="type"
                          name="type"
                          placeholder="hotel"
                          value={hotelInfo.type}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>

                    <div className={classes["form-control"]}>
                      <label htmlFor="address">
                        Address
                        <input
                          type="text"
                          id="address"
                          name="address"
                          placeholder="elton st, 216"
                          value={hotelInfo.address}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>

                    <div className={classes["form-control"]}>
                      <label htmlFor="title">
                        Title
                        <input
                          type="text"
                          id="title"
                          name="title"
                          placeholder="The best hotel"
                          value={hotelInfo.title}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>

                    <div className={classes["form-control"]}>
                      <label htmlFor="price">
                        Price
                        <input
                          type="number"
                          id="price"
                          name="price"
                          placeholder="100"
                          min="0"
                          value={hotelInfo.price}
                          onChange={hotelInfoChangeHandler}
                        />
                      </label>
                    </div>

                    <div className={classes["form-control"]}>
                      <label htmlFor="feature">
                        Feature
                        <select
                          name="feature"
                          id="feature"
                          onChange={hotelInfoChangeHandler}
                          defaultValue={hotelInfo?.feature}
                        >
                          <option value={false}>No</option>
                          <option value={true}>Yes</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              {hotel && (
                <div className={`${classes["form-control"]} ${classes.rooms}`}>
                  <label htmlFor="rooms">
                    Rooms
                    <textarea
                      name="rooms"
                      id="rooms"
                      cols="10"
                      rows="4"
                      onBlur={(e) => {
                        setRooms(
                          e.target.value
                            .split("\n")
                            .filter((value) => value.trim() !== "")
                        );
                      }}
                      onChange={(e) => {
                        setRooms(
                          e.target.value
                            .split("\n")
                            .filter((value) => value.trim() !== "")
                        );
                      }}
                      defaultValue={rooms.map((room) => room.title).join("\n")}
                    ></textarea>
                  </label>
                </div>
              )}
            </>
            {hotel && (
              <button type="submit" className={classes.submit}>
                Send
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};

export default NewForm;
