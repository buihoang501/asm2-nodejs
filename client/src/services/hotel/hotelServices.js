//Get Hotel API url
import { HOTEL_API } from "../../api/api";

//Fetch hotels data func
export const fetchHotel = async () => {
  try {
    //Call hotels API
    const response = await fetch(`${HOTEL_API}`);

    //Errors case
    if (!response.ok) {
      return;
    }

    //Success
    const hotelsData = await response.json();
    //return data
    return hotelsData;
  } catch (error) {
    console.log(error);
  }
};

//Post find hotels func
export const findHotels = async (dataSend) => {
  try {
    //send post request
    const response = await fetch(`${HOTEL_API}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dataSend),
    });

    if (response.status === 404) {
      const hotels = [];
      return hotels;
    }

    //Request failed
    if (!response.ok && response.status !== 404) {
      return;
    }

    //Success
    const hotels = await response.json();
    return hotels;
  } catch (error) {
    console.log(error);
  }
};

//Fetch hotel detail
export const fetchHotelDetail = async (hotelId) => {
  try {
    //Call get hotel detail API
    const response = await fetch(`${HOTEL_API}/${hotelId}`);

    //When failed
    if (!response.ok) {
      return;
    }

    //When success
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//Reserve hotel
export const reserveHotel = async (dataSend, hotelId, token) => {
  try {
    //Call request
    const response = await fetch(`${HOTEL_API}/${hotelId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      method: "POST",
      body: JSON.stringify(dataSend),

      //When failed
    });
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
