import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";
//import components
import Auth from "./pages/Auth";
import ProtectedLoginRoute from "./components/ProtectedLoginRoute";
import Admin from "./pages/Admin";
import Root from "./pages/Root";
import PageNotFound from "./pages/PageNotFound";
import HotelDetail from "./pages/HotelDetail";
import RoomDetail from "./pages/RoomDetail";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Root />}>
          <Route exact path="/" element={<Admin />} />

          <Route
            path="/login"
            element={
              <ProtectedLoginRoute>
                <Auth login />
              </ProtectedLoginRoute>
            }
          />
          <Route path="/hotels/:hotelId" element={<HotelDetail />} />
          <Route path="/rooms/:roomId" element={<RoomDetail />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
