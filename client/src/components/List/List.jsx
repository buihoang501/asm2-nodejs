//Import relevant components
import React, { useEffect, useState } from "react";
import City from "../City/City";
import Hotel from "../Hotel/Hotel";
import Type from "../Type/Type";

//Fetch hotels data func
import { fetchHotel } from "../../services/hotel/hotelServices";

//Css module
import classes from "./List.module.css";

const List = () => {
  //City state
  const [cityData, setCityData] = useState([
    {
      name: "Ha Noi",
      subText: "",
      image: "/images/HaNoi.jpg",
    },
    {
      name: "Ho Chi Minh",
      subText: "",
      image: "/images/HCM.jpg",
    },
    {
      name: "Da Nang",
      subText: "",
      image: "/images/DaNang.jpg",
    },
  ]);

  //Type state
  const [typeData, setTypeData] = useState([
    {
      name: "Hotels",
      count: null,
      image: "./images/type_1.webp",
    },
    {
      name: "Apartments",
      count: null,
      image: "./images/type_2.jpg",
    },
    {
      name: "Resorts",
      count: null,
      image: "./images/type_3.jpg",
    },
    {
      name: "Villas",
      count: null,
      image: "./images/type_4.jpg",
    },
    {
      name: "Cabins",
      count: null,
      image: "./images/type_5.jpg",
    },
  ]);

  //Hotel list  state
  const [hotelList, setHotelList] = useState([]);

  //Call hotels data
  useEffect(() => {
    const callHotelsData = async () => {
      //receive data
      const data = await fetchHotel();
      //set city state
      setCityData((prevState) => {
        //copy current state
        const updatedState = [...prevState];

        //update state
        updatedState?.map((city) => {
          //Check cases
          if (city.name === "Ha Noi") {
            city.subText = `${data.countHotelHanoi} properties`;
          }
          if (city.name === "Ho Chi Minh") {
            city.subText = `${data.countHotelHCM} properties`;
          }
          if (city.name === "Da Nang") {
            city.subText = `${data.countHotelDanang} properties`;
          }
          return city;
        });
        return updatedState;
      });

      //set type state
      setTypeData((prevState) => {
        //copy current state
        const updatedState = [...prevState];

        //update state
        updatedState?.map((type) => {
          //Check cases
          if (type.name === "Hotels") {
            type.count = `${data.countHotel} hotels`;
          }
          if (type.name === "Apartments") {
            type.count = `${data.countApartments} apartments`;
          }
          if (type.name === "Resorts") {
            type.count = `${data.countResorts} resorts`;
          }
          if (type.name === "Villas") {
            type.count = `${data.countVillas} villas`;
          }
          if (type.name === "Cabins") {
            type.count = `${data.countCabins} cabins`;
          }
          return type;
        });
        return updatedState;
      });

      //set hotel list state
      setHotelList(data?.hotelSortDesRating);
    };
    callHotelsData();
  }, []);

  return (
    <div className={classes.list}>
      {/*Render city component*/}
      <City cities={cityData} />
      {/*Render type component */}
      <Type types={typeData} />
      {/*Render hotel component */}
      <Hotel hotels={hotelList} />
    </div>
  );
};

export default List;
