//React router dom
import { Navigate } from "react-router-dom";

//React redux hook
import { useSelector } from "react-redux";

const ProtectedAuthRoutes = ({ children }) => {
  //get isAuthenticated state
  const { isAuthenticated } = useSelector((state) => state.auth);
  const redirectUrl = localStorage.getItem("redirectUrl");
  if (isAuthenticated && redirectUrl) {
    return <Navigate to={`/hotels/${redirectUrl}`} />;
  }

  //if authenticated state
  if (isAuthenticated) {
    //When entering login/signup => redirect home page
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedAuthRoutes;
