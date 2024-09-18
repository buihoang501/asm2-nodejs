//Room URL
import { ROOM_API } from "../../api/api";

//get all rooms
export const getAllRooms = async (token) => {
  try {
    //call fetch api admin hotels
    const response = await fetch(`${ROOM_API}/`, {
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

//Delete a room by roomId
export const deleteRoomById = async (roomId, token) => {
  try {
    //call delete hotel by hotelId
    const response = await fetch(`${ROOM_API}/${roomId}`, {
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

//New Room
export const createNewRoom = async (token, dataSend) => {
  try {
    //call create new hotel api
    const response = await fetch(`${ROOM_API}/new-room`, {
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

//fetch admin room detail
export const fetchAdminRoomDetail = async (token, roomId) => {
  try {
    //call fetch api admin room
    const response = await fetch(`${ROOM_API}/${roomId}`, {
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

//updating room
export const updateRoom = async (token, dataSend, roomId) => {
  try {
    //call updating room api
    const response = await fetch(`${ROOM_API}/${roomId}`, {
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
