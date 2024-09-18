import React, { useEffect, useRef } from "react";
//outlet components
import { Outlet } from "react-router-dom";
//utils functions
import { checkAuthToken } from "../../utils/auth";

//react-redux hook
import { useDispatch } from "react-redux";

//auth actions
import { authActions } from "../../redux/reducers/authReducer";

const Root = () => {
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

  return (
    <React.Fragment>
      <Outlet />
    </React.Fragment>
  );
};

export default Root;
