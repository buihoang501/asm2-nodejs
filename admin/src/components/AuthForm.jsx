//Get relavant react
import React, { useState } from "react";
//Import classes css module
import classes from "./AuthForm.module.css";
//Get function call api
import { handleAuthRequest } from "../services/auth/authServices";
//Use hooks from react-redux
import { useSelector, useDispatch } from "react-redux";
//Get auth actions
import { authActions } from "../redux/reducers/authReducer";

const AuthForm = ({ login }) => {
  //Select state from auth redux
  const errorEmailMsg = useSelector((state) => state.auth.errorEmailMsg);
  const errorPasswordMsg = useSelector((state) => state.auth.errorPasswordMsg);
  //Dispatch func
  const dispatch = useDispatch();

  //auth form state
  const [authState, setAuthState] = useState({
    email: "",
    password: "",
  });

  //define pathname
  let pathname = login ? "login" : "signup";

  //handle input change
  const inputChangeHandler = (e) => {
    //set state when typing input
    setAuthState((prevAuthState) => {
      return {
        ...prevAuthState,
        [e.target.name]: e.target.value,
      };
    });

    //reset error message when typing input
    dispatch(
      authActions.setAuthErrorMsg({
        password: "",
        email: "",
      })
    );
  };

  //Handle submit form
  const authSubmitHandler = async (e) => {
    //prevent default html submit
    e.preventDefault();

    //Receice data after call api login/signup
    const data = await handleAuthRequest(pathname, authState);

    //Validation errors
    if (data?.errors && data?.errors?.length > 0) {
      //Email errors
      let errorsEmail = data.errors.filter((error) => error.path === "email");
      //Password errors
      let errorsPassword = data.errors.filter(
        (error) => error.path === "password"
      );
      //Only email errors
      if (errorsEmail && errorsEmail?.length > 0) {
        //Call dispatch to set errors state
        dispatch(
          authActions.setAuthErrorMsg({
            email: errorsEmail[0].msg,
            password: "",
          })
        );
      }
      //Only password errors
      if (errorsPassword && errorsPassword?.length > 0) {
        //Call dispatch to set errors state
        dispatch(
          authActions.setAuthErrorMsg({
            password: errorsPassword[0].msg,
            email: "",
          })
        );
      }

      //Both password and email errors
      if (
        errorsPassword &&
        errorsPassword?.length > 0 &&
        errorsEmail &&
        errorsEmail?.length > 0
      ) {
        //Call dispatch to set errors state
        dispatch(
          authActions.setAuthErrorMsg({
            password: errorsPassword[0].msg,
            email: errorsEmail[0].msg,
          })
        );
      }
    }

    //Success case
    if (data?.token) {
      //Reset default errors messages
      dispatch(
        authActions.setAuthErrorMsg({
          password: "",
          email: "",
        })
      );

      //set auth
      dispatch(
        authActions.setAuth({ token: data?.token, userEmail: data?.email })
      );

      //set in localStorage
      const expires = new Date();
      expires.setHours(expires.getHours() + 3); //  three hours expire

      localStorage.setItem("user_email", data?.email);
      localStorage.setItem("expiration", expires); // set expire time to localStorage
      localStorage.setItem("jwt_token", data?.token); // set JWT token to localStorage

      //Clear inputs data
      setAuthState({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes["auth-form"]}>
        <h1>{login ? "Login" : "Signup"}</h1>
        {/* Auth form */}
        <form onSubmit={authSubmitHandler} noValidate>
          <div className={classes["form-control"]}>
            <input
              onChange={inputChangeHandler}
              type="email"
              name="email"
              value={authState.email}
              placeholder="Enter your email"
            />
          </div>
          <div className={classes["form-control"]}>
            <input
              onChange={inputChangeHandler}
              value={authState.password}
              type="password"
              name="password"
              placeholder="Enter your password"
            />
          </div>
          <button type="submit">{login ? "Login" : "Signup"}</button>
        </form>
        {/* Auth form */}
        <div
          className={
            errorEmailMsg || errorPasswordMsg
              ? `${classes.error}`
              : `${classes.hide}`
          }
        >
          {errorEmailMsg && <p>{errorEmailMsg}</p>}
          {errorPasswordMsg && <p>{errorPasswordMsg}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
