import React from "react";
import classes from "./InfoBoard.module.css";
//Room services
import { deleteRoomById } from "../services/room/roomServices";

//react redux hooks
import { useSelector } from "react-redux";

// react router dom
import { useSearchParams, Link } from "react-router-dom";

const Rooms = ({ rooms, isLoading, setRooms }) => {
  const [, setLocation] = useSearchParams({ find: "rooms" });

  //get token from state
  const { token } = useSelector((state) => state.auth);

  //handle delete room
  const handleDeleteRoom = async (roomId, token) => {
    if (window.confirm("Are you sure youn want to delete this room?")) {
      //Call func fetch delete request
      const data = await deleteRoomById(roomId, token);
      if (data && !data.delete) {
        //inform to user

        alert(data.message);
        return;
      }
      if (data && data.delete) {
        //inform to user
        alert(data.message);
        //updated state when deleting
        setRooms((prevRooms) => {
          return [
            ...prevRooms.filter((room) => {
              return room._id.toString() !== roomId;
            }),
          ];
        });
        return;
      }
    }
  };

  //handle edit room
  const handleEditRoom = async (roomId, token) => {};
  return (
    <div>
      {isLoading ? (
        <p>Loading progress .........</p>
      ) : (
        <React.Fragment>
          {rooms && rooms.length > 0 ? (
            <div className={classes.room}>
              <div className={classes["add-room"]}>
                <h3>Rooms List</h3>
                <button
                  onClick={() => {
                    //location new-room
                    setLocation({ find: "new-room" });
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
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Price</th>
                    <th scope="col">Max People</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                {rooms.map((room) => {
                  return (
                    <tbody key={room._id}>
                      <tr>
                        <td>
                          <i
                            className={`fa-regular fa-square ${classes.icon}`}
                          ></i>
                        </td>
                        <td>{room._id}</td>
                        <td>{room.title}</td>
                        <td>{room.desc}</td>
                        <td>{room.price}</td>

                        <td>{room.maxPeople}</td>
                        <td>
                          <div className={classes.action}>
                            <button
                              onClick={() => handleDeleteRoom(room._id, token)}
                            >
                              Delete
                            </button>
                            <Link
                              to={`/rooms/${room._id}`}
                              className={classes.edit}
                              onClick={() => handleEditRoom(room, token)}
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
                1- {rooms.length} of {rooms.length}
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

export default Rooms;
