import React from "react";
//css module
import classes from "./InfoBoard.module.css";
const Transactions = ({ isLoading, statistic, transactions, dashboard }) => {
  return (
    <React.Fragment>
      {isLoading && <p>Loading progress .........</p>}
      {!isLoading && (
        <div className={classes.index}>
          {dashboard && (
            <div className={classes.statistic}>
              <div>
                <h3>Users</h3>
                <p>{statistic.users}</p>
                <div className={`${classes.icon} ${classes.red}`}>
                  <p>
                    <i className="fa-regular fa-user "></i>
                  </p>
                </div>
              </div>
              <div>
                <h3>Orders</h3>
                <p>{statistic.orders}</p>
                <div className={`${classes.icon} ${classes.yellow}`}>
                  <p>
                    <i className="fa-solid fa-cart-shopping "></i>
                  </p>
                </div>
              </div>
              <div>
                <h3>Earnings</h3>
                <p>
                  <i className="fa-solid fa-dollar-sign"></i>
                  {statistic.earnings}
                </p>
                <div className={`${classes.icon} ${classes.green}`}>
                  <p>
                    <i className="fa-solid fa-dollar-sign"></i>
                  </p>
                </div>
              </div>
              <div>
                <h3>Balance</h3>
                <p>
                  <i className="fa-solid fa-dollar-sign"></i>
                  {statistic.balance}
                </p>
                <div className={`${classes.icon} ${classes.pink}`}>
                  <p>
                    <i className="fa-solid fa-receipt"></i>
                  </p>
                </div>
              </div>
            </div>
          )}
          {transactions && transactions.length > 0 ? (
            <div className={classes.transactions}>
              <h3>{dashboard ? "Latest Transactions" : "Transactions List"}</h3>
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <i className="fa-regular fa-square"></i>
                    </th>
                    <th scope="col">ID</th>
                    <th scope="col">User</th>
                    <th scope="col">Hotel</th>
                    <th scope="col">Room</th>
                    <th scope="col">Date</th>
                    <th scope="col">Price</th>
                    <th scope="col">Payment Method</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                {transactions.map((transaction) => {
                  return (
                    <tbody key={transaction._id}>
                      <tr>
                        <td>
                          <i
                            className={`fa-regular fa-square ${classes.icon}`}
                          ></i>
                        </td>
                        <td>{transaction._id}</td>
                        <td>{transaction.user.fullName}</td>
                        <td>{transaction.hotel.name}</td>
                        <td>{transaction.room.join(", ")}</td>
                        <td>
                          {`${new Date(
                            transaction.dateStart
                          ).toLocaleDateString("vi", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })} - ${new Date(
                            transaction.dateEnd
                          ).toLocaleDateString("vi", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}`}
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
                    </tbody>
                  );
                })}
                <tfoot>
                  <tr className={classes.space}></tr>
                </tfoot>
              </table>
              <div className={classes.bottom}>
                1- {transactions.length} of {transactions.length}{" "}
                <i className="fa-solid fa-chevron-left"></i>
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          ) : (
            <p>No transactions found!</p>
          )}
        </div>
      )}
    </React.Fragment>
  );
};

export default Transactions;
