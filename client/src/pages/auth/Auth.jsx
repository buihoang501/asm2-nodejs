import React from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import NavBar from "../../components/NavBar/NavBar";

const Auth = ({ login, removeItem }) => {
  return (
    <React.Fragment>
      {/*Render Navbar */}
      <NavBar removeItem={removeItem} />
      {/*Render Auth Form */}
      <AuthForm login={login} />
    </React.Fragment>
  );
};

export default Auth;
