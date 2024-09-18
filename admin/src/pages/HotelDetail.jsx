import React, { useEffect, useState } from "react";
import NewForm from "../components/NewForm";

//React redux hooks
import { useSelector } from "react-redux";
import classes from "./HotelDetail.module.css";
import Sidebar from "../components/Sidebar";

//hotel services
import { fetchAdminHotelDetail } from "../services/hotel/hotelServices";

//React router dom
import { useParams, useNavigate } from "react-router-dom";

const HotelDetail = () => {
  const { hotelId } = useParams();

  // navigate
  const navigate = useNavigate();

  //isLoading state
  const [isLoading, setIsLoading] = useState(false);

  //rooms state
  const [rooms, setRooms] = useState([]);

  //hotel detail state
  const [hotelDetail, setHotelDetail] = useState(null);

  //token
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const getData = async (token, hotelId) => {
      setIsLoading(true);
      //get hotel detail data from backend
      const hotelData = await fetchAdminHotelDetail(token, hotelId);
      setIsLoading(false);
      //Set hotel state
      setHotelDetail(hotelData?.hotel);
    };

    getData(token, hotelId);

    //When reloading page
    window.addEventListener("load", () => {
      navigate(`/hotels/${hotelId}`);
    });
    return () => {
      window.removeEventListener("load", () => {
        navigate(`/hotels/${hotelId}`);
      });
    };
  }, [token, hotelId, navigate]);
  return (
    <div className={classes.admin}>
      <header></header>
      <main>
        <Sidebar editing />
        <div className={classes.info}>
          {hotelDetail && (
            <NewForm
              isLoading={isLoading}
              hotel
              rooms={rooms}
              setRooms={setRooms}
              editing
              hotelDetail={hotelDetail}
            />
          )}
          {!isLoading && !hotelDetail && (
            <p>We couldn't find hotel detail with current params hotelId</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default HotelDetail;
