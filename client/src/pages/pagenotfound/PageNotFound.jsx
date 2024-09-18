import React from "react";

//import css classes module
import classes from "./PageNotFound.module.css";

const PageNotFound = () => {
  return (
    <div className={classes.error}>
      <div>
        <p>Something went wrong!</p> <h2>Page not found!</h2>
      </div>
    </div>
  );
};

export default PageNotFound;
