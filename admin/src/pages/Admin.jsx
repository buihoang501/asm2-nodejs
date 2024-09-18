import React from "react";

import classes from "./Admin.module.css";
import Sidebar from "../components/Sidebar";
import InfoBoard from "../components/InfoBoard";

const Admin = () => {
  return (
    <div className={classes.admin}>
      <header></header>
      <main>
        <Sidebar />
        <InfoBoard />
      </main>
    </div>
  );
};

export default Admin;
