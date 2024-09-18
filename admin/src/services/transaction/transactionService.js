import { TRANSACTION_API } from "../../api/api";

//fetch latest transactions
export const fetchLatestTransaction = async (token) => {
  try {
    //call fetch api
    const response = await fetch(`${TRANSACTION_API}/latest`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    //any errors exit process
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

//fetch all transactions
export const fetchAllTransactions = async (token) => {
  try {
    //call fetch api
    const response = await fetch(`${TRANSACTION_API}/all`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    //any errors exit process
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
