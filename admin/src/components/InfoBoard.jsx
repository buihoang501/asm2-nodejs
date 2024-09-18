import React, { useState, useEffect } from "react";

//css module
import classes from "./InfoBoard.module.css";

//react-router-dom
import { useSearchParams } from "react-router-dom";

//transaction services
import {
  fetchLatestTransaction,
  fetchAllTransactions,
} from "../services/transaction/transactionService";

//room services
import { getAllRooms } from "../services/room/roomServices";

//hotel services
import { fetchAdminHotels } from "../services/hotel/hotelServices";

//react redux hooks
import { useSelector } from "react-redux";
import Transactions from "./Transactions";
import Hotels from "./Hotels";
import NewForm from "./NewForm";
import Rooms from "./Rooms";

const InfoBoard = () => {
  //get location query
  const [location, setLocation] = useSearchParams({ find: "" });

  //loading
  const [isLoading, setIsLoading] = useState(false);

  //get jwt token
  const { token } = useSelector((state) => state.auth);
  //statistic state
  const [statistic, setStatistic] = useState({
    users: 0,
    orders: 0,
    earnings: 0,
    balance: 0,
  });

  //latest transactions state
  const [latestTransactions, setLatestTransactions] = useState([]);

  //All transactions state
  const [transactions, setTransactions] = useState([]);

  //Hotels state
  const [hotels, setHotels] = useState([]);

  //Rooms state
  const [rooms, setRooms] = useState([]);

  // path
  const path = location.get("find");

  //handle side effects call api
  useEffect(() => {
    if (!path) {
      const getLatestTransactions = async (token) => {
        setIsLoading(true);
        const data = await fetchLatestTransaction(token);
        //set statistic state
        setStatistic({
          users: data.totalUsers,
          orders: data.totalOrders,
          earnings: data.earnings,
          balance: data.balance,
        });
        setIsLoading(false);
        //set latest transactions state
        setLatestTransactions(data.latestTransactions);
      };
      getLatestTransactions(token);
    } else if (path === "hotels" || path === "new-room") {
      const getAdminHotels = async (token) => {
        setIsLoading(true);
        //get hotels data from backend
        const data = await fetchAdminHotels(token);

        setIsLoading(false);
        //Set hotels state
        setHotels(data.hotels);
      };
      getAdminHotels(token);
    } else if (path === "new-hotel" || path === "rooms") {
      const getRooms = async (token) => {
        setIsLoading(true);
        //get hotels data from backend
        const data = await getAllRooms(token);
        setIsLoading(false);
        //Set rooms state
        setRooms(data.rooms);
      };

      getRooms(token);
    } else if (path === "transactions") {
      const getAllTransactions = async (token) => {
        setIsLoading(true);
        const data = await fetchAllTransactions(token);

        setIsLoading(false);
        //set  transactions state
        setTransactions(data.transactions);
      };
      getAllTransactions(token);
    }

    //Handle when reload page
    setLocation({ find: path });
  }, [path, token, setLocation]);

  return (
    <div className={classes.info}>
      {/* Render Latest Transactions */}
      {!path && (
        <Transactions
          statistic={statistic}
          transactions={latestTransactions}
          isLoading={isLoading}
          dashboard
        />
      )}

      {/*Render Full Transactions */}
      {path === "transactions" && (
        <Transactions transactions={transactions} isLoading={isLoading} />
      )}

      {/* Render Hotels */}
      {path === "hotels" && (
        <Hotels isLoading={isLoading} setHotels={setHotels} hotels={hotels} />
      )}
      {/* Render New Hotel */}
      {path === "new-hotel" && (
        <NewForm
          isLoading={isLoading}
          hotel
          rooms={rooms}
          setRooms={setRooms}
        />
      )}
      {/* Render New Room */}
      {path === "new-room" && (
        <NewForm
          isLoading={isLoading}
          room
          rooms={rooms}
          setRooms={setRooms}
          hotels={hotels}
        />
      )}
      {/* Render rooms */}
      {path === "rooms" && (
        <Rooms isLoading={isLoading} setRooms={setRooms} rooms={rooms} />
      )}
    </div>
  );
};

export default InfoBoard;
