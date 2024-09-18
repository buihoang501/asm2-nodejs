// Hotel URL
import { HOTEL_API } from "../../api/api";

//fetch admin hotels
export const fetchAdminHotels = async (token) => {
  try {
    //call fetch api admin hotels
    const response = await fetch(`${HOTEL_API}/hotels`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    //Any errors we exit logic
    if (!response.ok) {
      return;
    }

    // Success case
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//fetch admin hotel detail
export const fetchAdminHotelDetail = async (token, hotelId) => {
  try {
    //call fetch api admin hotels
    const response = await fetch(`${HOTEL_API}/hotels/${hotelId}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    //Any errors we exit logic
    if (!response.ok) {
      return;
    }

    // Success case
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//Delete a hotel by hotelId
export const deleteHotelById = async (hotelId, token) => {
  try {
    //call delete hotel by hotelId
    const response = await fetch(`${HOTEL_API}/${hotelId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: "delete",
    });

    //Any errors we exit logic
    if (!response.ok && response.status !== 403) {
      return;
    }

    //return data
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//New Hotel
export const createNewHotel = async (token, dataSend) => {
  try {
    //call create new hotel api
    const response = await fetch(`${HOTEL_API}/new-hotel`, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(dataSend),
    });

    //Any errors we exit logic
    if (!response.ok && !response.status === 403) {
      return;
    }

    //get errors from validate inputs
    if (response.status === 403) {
      const data = await response.json();
      return data;
    }

    // Success case
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const updateHotel = async (token, dataSend, hotelId) => {
  try {
    //call create new hotel api
    const response = await fetch(`${HOTEL_API}/hotels/${hotelId}`, {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataSend),
    });

    //Any errors we exit logic
    if (!response.ok && !response.status === 403) {
      return;
    }

    //get errors from validate inputs
    if (response.status === 403) {
      const data = await response.json();
      return data;
    }

    // Success case
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
