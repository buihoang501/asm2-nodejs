import React, { useEffect, useRef } from "react";
//outlet components
import { Outlet } from "react-router-dom";
//utils functions
import { checkAuthToken } from "../utils/auth";
// react router dom
import { Navigate, useLocation } from "react-router-dom";

//react-redux hook
import { useDispatch, useSelector } from "react-redux";

//auth actions
import { authActions } from "../redux/reducers/authReducer";
const Root = () => {
  //location
  const location = useLocation();

  //dispatch function
  const dispatch = useDispatch();

  //timeoutID
  const timeOutId = useRef();

  //Check token when component render
  useEffect(() => {
    const { token, valid, tokenDuration } = checkAuthToken();

    //Set auth if token and it valid in localStorage
    if (valid && token) {
      //Get user email
      const userEmail = localStorage.getItem("user_email");
      dispatch(authActions.setAuth({ token: token, userEmail }));
    }
    //Auto logout
    timeOutId.current = setTimeout(() => {
      //When expired token
      dispatch(authActions.setLogout());
    }, tokenDuration);

    return () => {
      //Clear timeout event
      clearTimeout(timeOutId.current);
    };
  }, [dispatch]);
  // get isAuthenticated state
  const { isAuthenticated } = useSelector((state) => state.auth);

  //Check if the user is unauthorized and not in login page=> redirect to login page
  if (!isAuthenticated && !location.pathname.includes("/login")) {
    return <Navigate to="login" />;
  }

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default Root;
