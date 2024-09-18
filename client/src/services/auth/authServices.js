//Get AUTH API url
import { AUTH_API } from "../../api/api";

//Auth
export const handleAuthRequest = async (pathname, dataSend) => {
  try {
    //Call api
    const response = await fetch(`${AUTH_API}/${pathname}`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(dataSend),
    });
    const data = await response.json();

    //Check validation errors
    if (response.status === 422) {
      //Return to handle errors
      return data;
    }

    //Any other errors  exit the process
    if (!response.ok && !response.status === 422) {
      return;
    }
    //Success return data
    return data;
  } catch (error) {
    console.log(error);
  }
};

//get current user
export const getCurrentUser = async (token) => {
  try {
    //Call api
    const response = await fetch(`${AUTH_API}/user`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    //Any  errors  exit the process
    if (!response.ok) {
      return;
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
