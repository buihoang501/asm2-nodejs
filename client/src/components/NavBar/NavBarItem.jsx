import React from "react";

import styles from "./Navbar.module.css";

const NavBarItem = (props) => {
  //Get navData
  const navData = props.navData;

  return (
    <ul className={styles["item-container"]}>
      {/*map through nav data to render list item */}
      {navData.map((item) => (
        <li
          /*Dynamic className */
          className={`${styles["item"]} ${item.active ? styles.active : ""}`}
          key={item.type}
        >
          {/*Icon tag*/}
          <i className={`fa ${item.icon} ${styles["icon"]}`}></i>
          <span>{item.type}</span>
        </li>
      ))}
    </ul>
  );
};

export default NavBarItem;
