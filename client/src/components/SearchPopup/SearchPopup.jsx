import React, { useEffect, useState } from "react";

import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import styles from "./SearchPopup.module.css";

//Call api find hotels
import { findHotels } from "../../services/hotel/hotelServices";

//Hotel actions
import { hotelActions } from "../../redux/reducers/hotelReducer";

//React Redux hooks
import { useSelector, useDispatch } from "react-redux";

const SearchPopup = () => {
  //get search data state
  const { searchData } = useSelector((state) => state.hotel);

  //show modal state
  const [show, setShow] = useState(false);

  //Select Range
  const selectionRange = {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  };
  //Input date value
  const [dateState, setDateState] = useState(selectionRange);
  //Handle onchange input
  const onChangeInput = () => {};

  //dispatch func
  const dispatch = useDispatch();

  //Handle call find hotels when sending context from home page
  useEffect(() => {
    const handleFindHotels = async () => {
      const data = await findHotels({
        maxPeople: +searchData?.maxPeople,
        city: searchData?.city,
        totalRoom: +searchData?.totalRoom,
        startDate: new Date(searchData?.selectDate.startDate),
        endDate: new Date(searchData?.selectDate.endDate),
      });

      dispatch(
        hotelActions.setFindHotels({
          hotels: data?.hotelsFiltered,
          suitableRooms: data?.suitableRooms,
        })
      );
    };
    handleFindHotels();
  }, []);
  //Function handle change data range
  const handleChangeDate = (date) => {
    //Set date when click date picker
    setDateState(date.selection);
    //Set hidden modal Date-range
    setShow(false);
  };

  //Handle click input date range
  const clickDateHandler = () => {
    setShow(true);
  };

  //Handle room state chagne
  const roomChangeHandler = (e) => {
    setRoomState((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };
  //Input room state
  const [roomState, setRoomState] = useState({
    city: searchData?.city ? searchData?.city : "",
    adult: searchData?.adult ? searchData?.adult : null,
    children: searchData?.children ? searchData?.children : null,
    totalRoom: searchData?.totalRoom ? searchData?.totalRoom : null,
  });

  //handle search submit
  const handleSearchSubmit = async (e) => {
    //prevent default behavior
    e.preventDefault();
    const data = await findHotels({
      maxPeople: +roomState?.children + +roomState?.adult,
      city: roomState?.city,
      totalRoom: +roomState?.totalRoom,
      startDate: new Date(dateState?.startDate).toISOString(),
      endDate: new Date(dateState?.endDate).toISOString(),
    });
    if (data) {
      dispatch(
        hotelActions.setFindHotels({
          hotels: data?.hotelsFiltered,
          suitableRooms: data?.suitableRooms,
        })
      );
    } else {
      return;
    }
  };
  return (
    <div className={styles["search-popup"]}>
      <div className={styles["container"]}>
        <h3>Search</h3>
        <form className={styles["search-form"]} onSubmit={handleSearchSubmit}>
          <div className={styles["form-control"]}>
            <label htmlFor="destination">Destination</label>
            <input
              type="text"
              name="city"
              id="destination"
              value={roomState.city}
              onChange={roomChangeHandler}
              required
            />
          </div>
          <div className={styles["form-control"]}>
            <div className={styles["date"]}>
              <label htmlFor="date">Check-in Date</label>
              <input
                required
                value={
                  dateState &&
                  `${dateState.startDate.toLocaleDateString("defaut", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })} to ${dateState.endDate.toLocaleDateString("defaut", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}`
                }
                onClick={clickDateHandler}
                type="text"
                placeholder="09/1/2022 to 12/31/2022"
                onChange={onChangeInput}
              />
            </div>
          </div>
          {/* <div className={styles["form-control"]}>
            <label>Options</label>
          </div> */}
          {/* <div className={styles["other-form-control"]}>
            <label>Min price per night</label>
            <input type="number" min="0" />
          </div>
          <div className={styles["other-form-control"]}>
            <label>Max price per night</label>
            <input type="number" min="0" />
          </div> */}
          <div className={styles["other-form-control"]}>
            <label>Adult</label>
            <input
              type="number"
              name="adult"
              min="0"
              onChange={roomChangeHandler}
              value={roomState.adult}
              placeholder="1"
              required
            />
          </div>
          <div className={styles["other-form-control"]}>
            <label>Children</label>
            <input
              type="number"
              name="children"
              min="0"
              onChange={roomChangeHandler}
              value={roomState.children}
              placeholder="0"
              required
            />
          </div>
          <div className={styles["other-form-control"]}>
            <label>Room</label>
            <input
              type="number"
              name="totalRoom"
              min="0"
              onChange={roomChangeHandler}
              value={roomState.totalRoom}
              placeholder="1"
              required
            />
          </div>
          {show && (
            <DateRange
              editableDateInputs={true}
              moveRangeOnFirstSelection={true}
              className={`data ${styles["date-style"]}`}
              minDate={new Date()}
              onChange={handleChangeDate}
              ranges={[dateState]}
              date={new Date()}
            />
          )}
          <button type="submit">Search</button>
        </form>
        {/*Date range component */}
      </div>
    </div>
  );
};

export default SearchPopup;
