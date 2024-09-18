//Get Transaction API url
import { TRANSACTION_API } from "../../api/api";

//Fetch transactions of current user

export const getUserTransactions = async (token) => {
  try {
    //call user transactions api
    const response = await fetch(`${TRANSACTION_API}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    //When something went wrong
    if (!response.ok) {
      return;
    }

    //Success case
    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};
