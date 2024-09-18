import React from "react";

import styles from "./Hotel.module.css";
import { Link } from "react-router-dom";

const Hotel = (props) => {
  //Get hotels prop
  const hotels = props.hotels;
  return (
    <div className={styles["hotel"]}>
      <h3>Homes guests love</h3>
      <div className={styles["container"]}>
        {/*Map through hotel list */}
        {hotels.map((hotel) => (
          <div key={hotel._id} className={styles["item"]}>
            <img src={hotel.photos[0]} alt="Hotel"></img>

            <Link to={`/hotels/${hotel._id}`}>
              <h4>{hotel.name}</h4>
            </Link>

            <p>{hotel.city}</p>
            <h4>Starting from ${hotel.cheapestPrice}</h4>
            {/* <div className={styles["sub-item"]}>
              <p>{hotel.rate}</p>
              <p>{hotel.type}</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotel;
