import React from "react";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import HotelContentDetail from "../../components/Hotel/HotelContentDetail";

const HotelDetail = () => {
  return (
    <React.Fragment>
      <NavBar removeItem />
      <HotelContentDetail />
      <Footer />
    </React.Fragment>
  );
};

export default HotelDetail;
