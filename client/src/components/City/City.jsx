import React from "react";

import styles from "./City.module.css";

const City = (props) => {
  //Get cities property
  const cities = props.cities;
  return (
    <div className={styles["city"]}>
      <div className={styles["container"]}>
        {/* Map through cities data and render list*/}
        {cities.map((city) => (
          <div className={styles["item"]} key={city.name}>
            <img src={city.image} alt="City" />
            <h2>{city.name}</h2>
            <h3>{city.subText}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default City;
