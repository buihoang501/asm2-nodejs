import { BrowserRouter, Routes, Route } from "react-router-dom";
//Import relavant page components
import Home from "./pages/home/Home";
import Search from "./pages/search/Search";
import Auth from "./pages/auth/Auth";
import ProtectedAuthRoutes from "./components/ProtectedRoute/ProtectedAuthRoutes";
import HotelDetail from "./pages/hotel/HotelDetail";

import PageNotFound from "./pages/pagenotfound/PageNotFound";
import Transactions from "./pages/transactions/Transactions";
import Root from "./pages/root/Root";

function App() {
  return (
    //Render routes
    <BrowserRouter>
      <Routes>
        <Route element={<Root />}>
          <Route exact path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          {/* <Route path="/detail" element={<Detail />} /> */}
          <Route
            path="/signup"
            element={
              <ProtectedAuthRoutes>
                <Auth removeItem />
              </ProtectedAuthRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedAuthRoutes>
                <Auth removeItem login />
              </ProtectedAuthRoutes>
            }
          />
          <Route path="/hotels/:hotelId" element={<HotelDetail />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="*" element={<PageNotFound />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
