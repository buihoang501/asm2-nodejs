//Get Redirect component from react-router-dom
import { Navigate } from "react-router-dom";

//get auth token
export const getTokenDuration = () => {
  //Get expiration from local storage
  const expiration = localStorage.getItem("expiration");

  const storedExpiration = new Date(expiration);
  // Get current time
  const now = new Date();

  //Calculate duration time
  const duration = storedExpiration.getTime() - now.getTime();

  return duration;
};

//Get auth token
export const getAuthToken = () => {
  //Get token from local storage
  const token = localStorage.getItem("jwt_token");

  //Token not found
  if (!token) {
    return null;
  }

  const tokenDuration = getTokenDuration();

  //token expired
  if (tokenDuration < 0) {
    return "TOKEN_EXPIRED";
  }

  return token;
};
//Logout user
export const logout = () => {
  //remove token JWT and expiration time
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("expiration");
  localStorage.removeItem("user_email");
  return null;
};

//Check auth token
export const checkAuthToken = () => {
  const token = getAuthToken();
  const tokenDuration = getTokenDuration();

  //check token exist
  if (!token) {
    //redirect to login
    return <Navigate to="/login" />;
  }
  if (token === "TOKEN_EXPIRED") {
    logout();
    //redirect to login
    return <Navigate to="/login" />;
  }

  return { token, valid: true, tokenDuration };
};
