import React, { useState, useEffect } from "react";

//import relevant components
import Footer from "../../components/Footer/Footer";
import NavBar from "../../components/NavBar/NavBar";
import Subscribe from "../../components/Subscribe/Subscribe";

//get user transactions func
import { getUserTransactions } from "../../services/transaction/transactionServices";

//react redux hooks
import { useSelector } from "react-redux";
import TransactionTable from "../../components/TransactionTable/TransactionTable";

const Transactions = () => {
  //user transactions state
  const [userTransactions, setUserTransactions] = useState([]);
  //get token from auth state
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  //Handle fetch user transactions with useEffect
  useEffect(() => {
    const fetchUserTransactions = async (token) => {
      try {
        const data = token && (await getUserTransactions(token));

        if (data?.transactions?.length > 0) {
          setUserTransactions(data.transactions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    //call fetch
    fetchUserTransactions(token);
  }, [token]);

  // not authenticated && not token
  const loginInformStyleContainer = {
    maxWidth: "1200px",
    margin: "0 auto",
    height: "350px",
    fontWeight: "500",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
  const isNotLoginStyle = {
    border: "1px solid #ccc",
    color: "#f82929",
    padding: "1rem 2rem",
    borderRadius: "0.25rem",
    backgroundColor: "#d9e3cc",
  };

  return (
    <React.Fragment>
      <NavBar />
      {/*Render transactions*/}
      {isAuthenticated && token ? (
        <TransactionTable transactions={userTransactions} />
      ) : (
        <div style={loginInformStyleContainer}>
          <p style={isNotLoginStyle}>You must have logged in!</p>
        </div>
      )}

      <Subscribe />
      <Footer />
    </React.Fragment>
  );
};

export default Transactions;
