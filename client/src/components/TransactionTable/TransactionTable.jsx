import React from "react";
import classes from "./TransactionTable.module.css";

const TransactionTable = ({ transactions }) => {
  return (
    <div className={classes.transactions}>
      {transactions && transactions.length > 0 && (
        <>
          <h3>Your Transactions</h3>
          <div className={classes["table-transaction"]}>
            <table>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Hotel</th>
                  <th scope="col">Room</th>
                  <th scope="col">Date</th>
                  <th scope="col">Price</th>
                  <th scope="col">Payment Method</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => {
                  return (
                    <tr
                      key={transaction._id}
                      className={
                        (index + 1) % 2 !== 0
                          ? `${classes["background-gray"]}`
                          : ""
                      }
                    >
                      <td>{index < 10 ? `0${index + 1}` : `${index + 1}`}</td>
                      <td>{transaction?.hotel?.name}</td>
                      <td>{transaction.room.join(", ")}</td>
                      <td>
                        {`${new Date(transaction.dateStart).toLocaleDateString(
                          "vi",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )} - ${new Date(transaction.dateEnd).toLocaleDateString(
                          "vi",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}`}
                      </td>
                      <td>${transaction.price}</td>
                      <td>{transaction.payment}</td>
                      <td>
                        {transaction.status.trim() === "Booked" && (
                          <span className={classes.booked}>
                            {transaction.status}
                          </span>
                        )}
                        {transaction.status.trim() === "Checkin" && (
                          <span className={classes.checkin}>
                            {transaction.status}
                          </span>
                        )}
                        {transaction.status.trim() === "Checkout" && (
                          <span className={classes.checkout}>
                            {transaction.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {transactions.length === 0 && (
        <div className={classes["empty-transaction"]}>
          <h3>We couldn't find your transactions!</h3>
          <p>Please book at least one and go back!</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
