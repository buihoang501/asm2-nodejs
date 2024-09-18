import React, { useEffect, useState, useMemo, useRef } from "react";
import classes from "./Hotel.module.css";
import { fetchHotelDetail } from "../../services/hotel/hotelServices";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { useNavigate } from "react-router-dom";
import { reserveHotel } from "../../services/hotel/hotelServices";

//React redux hooks
import { useSelector, useDispatch } from "react-redux";

//Hotel actions
import { hotelActions } from "../../redux/reducers/hotelReducer";

//React router dom
import { useParams, useLocation } from "react-router-dom";

//get CurrentUser func
import { getCurrentUser } from "../../services/auth/authServices";

const HotelContentDetail = () => {
  //location
  const location = useLocation();

  //get search data state
  const { searchData } = useSelector((state) => state.hotel);
  //navigate
  const navigate = useNavigate();
  //dispatch func
  const dispatch = useDispatch();
  //get hotel detail state
  const { hotel, transactions } = useSelector((state) => state.hotel);
  //Get authenticated state
  const { isAuthenticated, userEmail, token } = useSelector(
    (state) => state.auth
  );

  //toggle click reserve or book hotel
  const [isBook, setIsBook] = useState(false);

  // user state
  const [user, setUser] = useState({
    fullName: "",
    phone: "",
    card: "",
  });

  //Select method payment
  const [paymentMethod, setPaymentMethod] = useState("");

  //checkbox state
  const [reservedRooms, setReservedRooms] = useState([]);

  //handle change user input
  const userInputChange = (e) => {
    setUser((prevUserState) => {
      return {
        ...prevUserState,

        [e.target.name]: e.target.value,
      };
    });
  };

  //Select Range
  const selectionRange = {
    startDate: searchData?.selectDate.startDate
      ? new Date(searchData?.selectDate.startDate)
      : new Date(),
    endDate: searchData?.selectDate.endDate
      ? new Date(searchData?.selectDate.endDate)
      : new Date(),
    key: "selection",
  };
  //Input date value
  const [dateState, setDateState] = useState(selectionRange);
  //Handle onchange input

  //get params object
  const params = useParams();

  //get hotel Id
  const { hotelId } = params;

  //Handle call data
  useEffect(() => {
    const fetchCurrentUser = async (token) => {
      const data = await getCurrentUser(token);
      if (data) {
        setUser((prevUser) => {
          return {
            ...prevUser,
            fullName: data.fullName,
            card: data.card,
            phone: data.phone,
          };
        });
      }
    };

    const fetchHotel = async (hotelId) => {
      const data = await fetchHotelDetail(hotelId, userEmail);
      if (data) {
        //Dispatch set hotel detail
        dispatch(
          hotelActions.setDetailHotel({
            hotel: data.hotel,
            transactions: data.transactions,
          })
        );
      } else {
        return;
      }
    };
    //fetch current user logged in
    fetchCurrentUser(token);
    //Call fetch
    fetchHotel(hotelId);
  }, [hotelId, dispatch, userEmail]);

  //Click book/ reserve hotel handler
  const clickBookHandler = () => {
    if (!isAuthenticated) {
      //return to login page and save link to redirect after login
      alert("You need to login!");
      localStorage.setItem("redirectUrl", hotelId);
      navigate("/login");
    } else {
      //remove old saving link
      localStorage.removeItem("redirectUrl");
      setIsBook(!isBook);
    }
  };

  //Function handle change data range
  const handleChangeDate = (date) => {
    //Set date when click date picker
    setDateState(date.selection);
  };

  let resultRoomsValid = useRef([]);

  //rooms filterd by  dates selected
  const roomsFiltered = useMemo(() => {
    // resultRoomsValid.current = [];
    const availableRooms = transactions
      .filter((transaction) => {
        return !(
          new Date(dateState?.startDate) > new Date(transaction.dateEnd) ||
          new Date(dateState?.endDate) < new Date(transaction.dateStart)
        );
      })
      .map((transaction) => transaction.room);

    let availableRoomsCombine = []
      .concat(...availableRooms)
      .filter((value, index, self) => self.indexOf(value) === index);

    resultRoomsValid.current = availableRoomsCombine;

    return hotel?.rooms;
  }, [dateState?.startDate, dateState?.endDate, hotel?.rooms, transactions]);

  useEffect(() => {
    // reset when change date range picker
    document
      .querySelectorAll('input[type="checkbox"')
      .forEach((input) => (input.checked = false));

    setReservedRooms([]);
  }, [resultRoomsValid?.current.length, location.pathname]);

  // total bill
  const totalBill = useMemo(() => {
    let dateTotal =
      +new Date(dateState?.endDate).getDate() -
      +new Date(dateState?.startDate).getDate();

    const bill = reservedRooms?.reduce((acc, curr) => {
      return acc + curr.roomPrice * (dateTotal + 1);
    }, 0);
    return bill || 0;
  }, [reservedRooms, dateState?.startDate, dateState?.endDate]);

  //handle checkbox change
  const handleCheckboxChange = (e, roomNumber, price) => {
    if (e.target.checked) {
      setReservedRooms((prevCheckboxValue) => {
        if (prevCheckboxValue.length > 0) {
          return [
            ...prevCheckboxValue,
            {
              roomNumber,
              roomPrice: price,
            },
          ];
        }

        return [
          {
            roomNumber,
            roomPrice: price,
          },
        ];
      });
    } else {
      setReservedRooms((prevCheckboxValue) => {
        if (prevCheckboxValue.length > 0) {
          return prevCheckboxValue.filter(
            (room) => room.roomNumber !== roomNumber
          );
        }
      });
    }
  };

  //handle reserve hotel
  const handleReserve = async (e) => {
    //prevent default behaviour
    e.preventDefault();
    //Check phone number valid
    if (!/^\d{10}$/.test(user.phone)) {
      alert("Invalid phone number, 10 digits");
    }
    //Check card number valid
    if (paymentMethod === "Credit Card" && !/^\d{16}$/.test(user.card)) {
      alert("Invalid card number, 16 digits");
      return;
    }
    if (paymentMethod === "Cash" && user.card) {
      alert(
        "You don't need to provide a card number when choosing a cash payment method"
      );
      setUser((prevUserState) => {
        return { ...prevUserState, card: "" };
      });
      return;
    }
    //Check no room is chosen
    if (totalBill === 0) {
      alert("Please pick at least a room to reserve");
      return;
    }
    //Reserve rooms
    const reservedRoomArr = reservedRooms.map(
      (reservedRoom) => reservedRoom.roomNumber
    );

    //data send
    const dataSend = {
      roomNumbers: reservedRoomArr,
      email: userEmail,
      phone: user.phone,
      card: user.card ? user.card : "",
      fullName: user.fullName,
      paymentMethod: paymentMethod,
      price: totalBill,
      date: dateState,
    };

    const data = await reserveHotel(dataSend, hotelId, token);
    if (data.message) {
      alert("Book rooms successfully!");
      return navigate("/transactions");
    }
  };

  return (
    <div className={classes["hotel-detail"]}>
      {hotel ? (
        <div className={classes.container}>
          <h1>{hotel.title}</h1>
          <p className={classes.address}>
            <i className="fa-solid fa-location-dot"></i>
            {hotel.address}
          </p>
          <p className={classes.distance}>
            Excellent location - {hotel.distance}m from center
          </p>
          <p className={classes.labelPrice}>
            Book a stay over ${hotel.cheapestPrice} at this property and get a
            free airport taxi
          </p>
          <div className={classes["image-container"]}>
            {hotel.photos.map((photo) => {
              return <img key={photo} src={photo} alt="Hotel" />;
            })}
          </div>
          <div className={classes.bottom}>
            <div>
              <h2>{hotel.name}</h2>
              <p>{hotel.desc}</p>
            </div>
            <div className={classes.price}>
              <p>
                ${hotel.cheapestPrice} <span>(1 night)</span>
              </p>
              <button onClick={clickBookHandler}>Reserve or Book Now!</button>
            </div>
          </div>
          {isBook && isAuthenticated && (
            <div className={classes["book-form"]}>
              <form onSubmit={handleReserve}>
                <div className={classes["reserve-info"]}>
                  <div className={classes.dates}>
                    <h3>Dates</h3>

                    <DateRange
                      retainEndDateOnFirstSelection={true}
                      editableDateInputs={true}
                      moveRangeOnFirstSelection={false}
                      className={`data ${classes["date-style"]}`}
                      minDate={new Date()}
                      onChange={handleChangeDate}
                      ranges={[dateState]}
                      date={new Date()}
                    />
                  </div>
                  <div className={classes.info}>
                    <h3>Reserve Info</h3>
                    <div className={classes["form-container"]}>
                      <div className={classes["form-control"]}>
                        <label htmlFor="fullName">Your Full Name</label>
                        <input
                          type="text"
                          id="fullName"
                          placeholder="Full Name"
                          required
                          name="fullName"
                          value={user.fullName}
                          onChange={userInputChange}
                        />
                      </div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="email">Your Email</label>
                        <input
                          type="email"
                          id="email"
                          placeholder="Email"
                          required
                          name="email"
                          value={userEmail}
                        />
                      </div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="phone">Your Phone Number</label>
                        <input
                          type="text"
                          id="phone"
                          placeholder="Phone Number"
                          name="phone"
                          value={user.phone}
                          onChange={userInputChange}
                          required
                        />
                      </div>
                      <div className={classes["form-control"]}>
                        <label htmlFor="phone">Your Identity Card Number</label>
                        <input
                          type="text"
                          id="card"
                          name="card"
                          value={user.card}
                          placeholder="Card Number"
                          required={
                            paymentMethod === "Credit Card" ? true : false
                          }
                          onChange={userInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes["select-room"]}>
                  <h3>Select Rooms</h3>
                  <div className={classes.rooms}>
                    {roomsFiltered &&
                      roomsFiltered?.length > 0 &&
                      roomsFiltered.map((room) => (
                        <div key={room._id} className={classes.room}>
                          <h4>{room.title}</h4>
                          <p className={classes.desc}>{room.desc}</p>
                          <div className={classes["room-info"]}>
                            <p className={classes["max-people"]}>
                              Max people: <span>{room.maxPeople}</span>
                            </p>
                            <div className={classes["select-rooms"]}>
                              {resultRoomsValid &&
                                room.roomNumbers.length > 0 &&
                                room.roomNumbers
                                  .filter(
                                    (roomNumber) =>
                                      !resultRoomsValid?.current?.includes(
                                        roomNumber
                                      )
                                  )
                                  .map((roomNumber) => {
                                    return (
                                      <div key={roomNumber}>
                                        <p>{roomNumber}</p>
                                        <input
                                          type="checkbox"
                                          name="room-number"
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              e,
                                              roomNumber,
                                              room.price
                                            )
                                          }
                                        />
                                      </div>
                                    );
                                  })}
                            </div>
                          </div>
                          <p className={classes.price}>${room.price}</p>
                        </div>
                      ))}
                  </div>
                </div>
                {roomsFiltered?.length > 0 && (
                  <>
                    <h3 className={classes.bill}>Total Bill: ${totalBill}</h3>
                    <div className={classes["payment-reserve"]}>
                      <select
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        name="payment-method"
                        id="payment-method"
                        required
                      >
                        <option value="">Select Payment Method</option>

                        <option value="Credit Card">Credit Card</option>
                        <option value="Cash">Cash</option>
                      </select>
                      <button type="submit">Reserve Now</button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}
        </div>
      ) : (
        <p>We couln't find hotel with this hotelId</p>
      )}
    </div>
  );
};

export default HotelContentDetail;
