import React from "react";
import classes from "./InfoBoard.module.css";
//Hotel services
import { deleteHotelById } from "../services/hotel/hotelServices";

//react redux hooks
import { useSelector } from "react-redux";

// react router dom
import { useSearchParams, Link } from "react-router-dom";

const Hotels = ({ hotels, isLoading, setHotels }) => {
  const [, setLocation] = useSearchParams({ find: "hotels" });

  //get token from state
  const { token } = useSelector((state) => state.auth);

  const handleDeleteHotel = async (hotelId, token) => {
    if (window.confirm("Are you sure youn want to delete this hotel?")) {
      //Call func fetch delete request
      const data = await deleteHotelById(hotelId, token);
      if (data && !data.delete) {
        //inform to user

        alert(data.message);
        return;
      }
      if (data && data.delete) {
        //inform to user
        alert(data.message);
        //updated state when deleting
        setHotels((prevHotels) => {
          return [
            ...prevHotels.filter((hotel) => {
              return hotel._id.toString() !== hotelId;
            }),
          ];
        });
        return;
      }
    }
  };
  return (
    <div>
      {isLoading ? (
        <p>Loading progress .........</p>
      ) : (
        <React.Fragment>
          {hotels && hotels.length > 0 ? (
            <div className={classes.hotel}>
              <div className={classes["add-hotel"]}>
                <h3>Hotels List</h3>
                <button
                  onClick={() => {
                    //location new-hotel
                    setLocation({ find: "new-hotel" });
                  }}
                >
                  Add New
                </button>
              </div>
              <table>
                <thead>
                  <tr>
                    <th scope="col">
                      <i className="fa-regular fa-square"></i>
                    </th>
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Title</th>
                    <th scope="col">City</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                {hotels.map((hotel) => {
                  return (
                    <tbody key={hotel._id}>
                      <tr>
                        <td>
                          <i
                            className={`fa-regular fa-square ${classes.icon}`}
                          ></i>
                        </td>
                        <td>{hotel._id}</td>
                        <td>{hotel.name}</td>
                        <td>{hotel.type}</td>
                        <td>{hotel.title}</td>

                        <td>{hotel.city}</td>
                        <td>
                          <div className={classes.action}>
                            <button
                              onClick={() =>
                                handleDeleteHotel(hotel._id, token)
                              }
                            >
                              Delete
                            </button>
                            <Link
                              className={classes.edit}
                              to={`hotels/${hotel._id}`}
                            >
                              Edit
                            </Link>
                          </div>
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
                1- {hotels.length} of {hotels.length}{" "}
                <i className="fa-solid fa-chevron-left"></i>
                <i className="fa-solid fa-chevron-right"></i>
              </div>
            </div>
          ) : (
            <p>No hotels found!</p>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default Hotels;
