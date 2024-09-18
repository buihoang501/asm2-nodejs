//Get AUTH API url
import { AUTH_API } from "../../api/api";

//Auth
export const handleAuthRequest = async (pathname, dataSend) => {
  try {
    //Call api
    const response = await fetch(`${AUTH_API}/${pathname}/admin`, {
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

    if (!response.ok && response.status === 403) {
      alert("Your account is not admin role!");
      return;
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
