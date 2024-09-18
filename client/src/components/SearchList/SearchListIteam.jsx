import React from "react";
import styles from "./SearchListItem.module.css";

//React router dom
import { Link } from "react-router-dom";

const SearchListIteam = (props) => {
  //Get search data
  const { search: searchData, suitableRooms } = props;
  return (
    <div>
      {/*Map through search data array */}
      {searchData &&
        searchData?.length > 0 &&
        searchData?.map((hotel, index) => {
          return (
            <div key={hotel._id} className={styles["item-container"]}>
              <div>
                <Link to={`/hotels/${hotel._id}`}>
                  <img src={hotel.photos[0]} alt="Hotel" />
                </Link>{" "}
              </div>
              <div className={styles["desc"]}>
                <h3>
                  <Link to={`/hotels/${hotel._id}`}>{hotel.name}</Link>
                </h3>
                <p>{hotel.distance}m from center</p>
                <p>
                  {hotel.desc.length > 100
                    ? hotel.desc.substring(0, 100) + "..."
                    : hotel.desc}
                </p>
                <p className={styles.city}>
                  {hotel.type.substring(0, 1).toUpperCase() +
                    hotel.type.substring(1)}{" "}
                  in {hotel.city}
                </p>
                <p className={styles["label"]}>{suitableRooms[index]?.desc}</p>
                <p>You can cancel later, so lock in this great price today!</p>
              </div>
              <div className={styles["rate"]}>
                <div>
                  <p>{hotel.rate_text}</p>
                  <p>{hotel.rating}</p>
                </div>
                <div>
                  <p>${hotel.cheapestPrice}</p>
                  <p>Includes taxes and fees</p>

                  <Link to={`/hotels/${hotel._id}`}>See availability</Link>
                </div>
              </div>
            </div>
          );
        })}
      {(!searchData || searchData?.length === 0) && (
        <p>No results found - Please try again!</p>
      )}
    </div>
  );
};

export default SearchListIteam;
