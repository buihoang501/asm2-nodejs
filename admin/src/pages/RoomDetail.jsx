import React, { useEffect, useState } from "react";
import NewForm from "../components/NewForm";

//React redux hooks
import { useSelector } from "react-redux";
import classes from "./HotelDetail.module.css";
import Sidebar from "../components/Sidebar";

//room service
import { fetchAdminRoomDetail } from "../services/room/roomServices";

//hotel service
import { fetchAdminHotels } from "../services/hotel/hotelServices";

//React router dom
import { useParams, useNavigate } from "react-router-dom";

const RoomDetail = () => {
  const { roomId } = useParams();

  // navigate
  const navigate = useNavigate();

  //isLoading state
  const [isLoading, setIsLoading] = useState(false);

  //rooms state
  const [rooms, setRooms] = useState([]);

  //hotels state
  const [hotels, setHotels] = useState([]);

  //Room detail state
  const [roomDetail, setRoomDetail] = useState(null);

  //token
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const getData = async (token, roomId) => {
      setIsLoading(true);
      //get room detail, hotels data from backend
      const [roomData, hotelsData] = await Promise.all([
        fetchAdminRoomDetail(token, roomId),
        fetchAdminHotels(token),
      ]);
      //Set room state
      setRoomDetail(roomData?.room);

      //Set hotels state
      setHotels(hotelsData?.hotels);

      setIsLoading(false);
    };

    getData(token, roomId);

    //When reloading page
    window.addEventListener("load", () => {
      navigate(`/rooms/${roomId}`);
    });
    return () => {
      window.removeEventListener("load", () => {
        navigate(`/rooms/${roomId}`);
      });
    };
  }, [token, roomId, navigate]);
  return (
    <div className={classes.admin}>
      <header></header>
      <main>
        <Sidebar editing />
        <div className={classes.info}>
          {roomDetail && roomDetail._id && (
            <NewForm
              isLoading={isLoading}
              room
              rooms={rooms}
              setRooms={setRooms}
              editing
              roomDetail={roomDetail}
              hotels={hotels}
            />
          )}
          {!isLoading && !roomDetail && (
            <p>We couldn't find room detail with current params hotelId</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default RoomDetail;
