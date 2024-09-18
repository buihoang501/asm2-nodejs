import React, { useState } from "react";
import styles from "./Header.module.css";

//Import react-data-range
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Link } from "react-router-dom";

//react-router
import { useNavigate } from "react-router-dom";

//React redux hooks
import { useSelector, useDispatch } from "react-redux";

//Hotel actions
import { hotelActions } from "../../redux/reducers/hotelReducer";

const Header = () => {
  //dispatch func
  const dispatch = useDispatch();

  const navigate = useNavigate();

  //Get isAuthenticated state
  const { isAuthenticated } = useSelector((state) => state.auth);

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
  //Input room state
  const [roomState, setRoomState] = useState({
    city: "",
    adult: null,
    children: null,
    totalRoom: null,
  });

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

  //Handle onchange input
  const onChangeInput = () => {};

  //Handle room state chagne
  const roomChangeHandler = (e) => {
    setRoomState((prevState) => {
      return {
        ...prevState,
        [e.target.name]: e.target.value,
      };
    });
  };

  //Function  handle click search button
  const searchSubmitHandler = async (e) => {
    //prevent default behavior
    e.preventDefault();

    //dispatch setDataSearch
    dispatch(
      hotelActions.setSearchData({
        maxPeople: +roomState.adult + +roomState.children,
        adult: roomState.adult,
        children: roomState.children,
        totalRoom: roomState.totalRoom,
        city: roomState.city,
        selectDate: dateState,
      })
    );

    navigate("/search");
  };

  return (
    // Style for back-ground color
    <div style={{ background: "#003580" }}>
      <header className={styles["header"]}>
        {/* Header */}
        <h2>A lifetime of discounts? It's Genius.</h2>
        <p>
          Get rewarded for your travels - unlock instant savings of 10% or more
          with a free account
        </p>
        {/*When we don't login*/}
        {!isAuthenticated && (
          <button>
            <Link to="/login">Login</Link>
            <span>/</span>
            <Link to="/signup">Signup</Link>
          </button>
        )}

        {/* Search Form */}
        <form onSubmit={searchSubmitHandler}>
          <div className={styles["search-container"]}>
            <div className={styles["place"]}>
              <i className={`fa-solid fa-bed ${styles["icon"]}`}></i>
              <input
                name="city"
                value={roomState.city}
                onChange={roomChangeHandler}
                type="text"
                placeholder="Where are you going?"
                required
              />
            </div>
            <div className={styles["date"]}>
              <i className={`fa-solid fa-calendar-days ${styles["icon"]}`}></i>
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
            <div className={styles["person"]}>
              <i className={`fa-solid fa-person ${styles["icon"]}`}></i>
              <input
                name="adult"
                value={roomState.adult}
                onChange={roomChangeHandler}
                type="number"
                min="0"
                placeholder="1 adult"
                required
              />
              <input
                name="children"
                value={roomState.children}
                onChange={roomChangeHandler}
                type="number"
                min="0"
                placeholder="• 0 children"
                required
              />
              <input
                name="totalRoom"
                value={roomState.totalRoom}
                onChange={roomChangeHandler}
                type="number"
                min="0"
                placeholder="• 1 room"
                required
              />
            </div>
            {/*Date range component */}
            {show && (
              <DateRange
                editableDateInputs={true}
                moveRangeOnFirstSelection={false}
                className={`data ${styles["date-style"]}`}
                minDate={new Date()}
                onChange={handleChangeDate}
                ranges={[dateState]}
                date={new Date()}
              />
            )}

            <button>Search</button>
          </div>
        </form>
      </header>
    </div>
  );
};

export default Header;
