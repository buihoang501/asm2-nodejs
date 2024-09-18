import React from "react";
import styles from "./Type.module.css";
const Type = (props) => {
  //Get types prop
  const types = props.types;
  return (
    <div className={styles["type"]}>
      <h3>Browse by property type</h3>
      <div className={styles["container"]}>
        {/* Map through types data array */}
        {types.map((type) => (
          <div key={type.name} className={styles["item"]}>
            <img src={type.image} alt="Hotel Type" />
            <h4>{type.name}</h4>
            <p>{type.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Type;
