import React from "react";

import styles from "./Navbar.module.css";
import NavBarItem from "./NavBarItem";
import { Link } from "react-router-dom";

//React redux hooks
import { useSelector, useDispatch } from "react-redux";

//Auth actions
import { authActions } from "../../redux/reducers/authReducer";

//Logout func
import { logout } from "../../utils/auth";

const NavBar = ({ removeItem, noDetail }) => {
  //Get isAuthenticated state
  const { isAuthenticated, userEmail } = useSelector((state) => state.auth);

  //dispatch func
  const dispatch = useDispatch();

  //Nav Bar data from JSON file
  const navData = [
    {
      type: "Stays",
      icon: "fa-bed",
      active: true,
    },
    {
      type: "Flights",
      icon: "fa-plane",
      active: false,
    },
    {
      type: "Car rentals",
      icon: "fa-car",
      active: false,
    },
    {
      type: "Attractions",
      icon: "fa-bed",
      active: false,
    },
    {
      type: "Airport taxis",
      icon: "fa-taxi",
      active: false,
    },
  ];

  //Logout handler
  const logoutHandler = () => {
    //Dispatch set state when logout
    dispatch(authActions.setLogout());

    //Remove from localStorage when logout
    logout();
  };

  return (
    //Style for back-ground color
    <div
      className={removeItem ? styles["auth-navbar"] : ""}
      style={{ background: "#003580" }}
    >
      <nav className={styles["navbar-container"]}>
        <div className={styles["title-container"]}>
          <h3 className={styles["title"]}>
            <Link to="/"> {removeItem ? "Booking" : "Booking Website"}</Link>
          </h3>
          <div>
            {/*Not auth */}
            {!isAuthenticated && (
              <>
                <Link to="/signup" className={styles["register-btn"]}>
                  Sign Up
                </Link>
                <Link to="/login" className={styles["login-btn"]}>
                  Login
                </Link>
              </>
            )}
            {/* Auth */}
            {isAuthenticated && (
              <>
                <span>{userEmail}</span>

                <Link to="/transactions" className={styles["register-btn"]}>
                  Transactions
                </Link>
                <Link
                  onClick={logoutHandler}
                  to="#"
                  className={styles["login-btn"]}
                >
                  Logout
                </Link>
              </>
            )}
          </div>
        </div>
        {/*Render NavBarItem Component*/}
        {!removeItem && (
          <NavBarItem
            /*Passing navData prop to NavBarItem component */
            navData={navData}
          />
        )}
      </nav>
    </div>
  );
};

export default NavBar;
