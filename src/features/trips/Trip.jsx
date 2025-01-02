import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTripById,
  selectTrip,
  selectTripError,
  selectTripStatus,
} from "./tripSlice";
import { useNavigate, useParams } from "react-router-dom";
import ToDoModal from "../toDos/ToDoModal";
import {
  deleteToDo,
  getAllToDos,
  getToDoById,
  resetAddToDoState,
  selectAllToDos,
  selectAllToDosStatus,
  selectToDoGetState,
} from "../toDos/toDoSlice";

import ToDoStatusUpdate from "../toDos/ToDoStatusUpdate";
import EditToDo from "../toDos/EditToDo";
import ToDoDescriptionModal from "../toDos/ToDoDescriptionModal";
import Transportation from "../transportation/Transportation";

import TravelBooking from "../transportation/TravelBooking";
import Accommodation from "../accommodation/Accommodation";
import BookedAccommodations from "../accommodation/BookedAccommodations";
import { selectAllBookedAccommodations } from "../accommodation/accommodationSlice";
import { selectAllTravelBooking } from "../transportation/transportationSlice";

const Trip = () => {
  const { tripId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector(selectTripStatus);
  const trip = useSelector(selectTrip);

  const error = useSelector(selectTripError);
  const allToDos = useSelector(selectAllToDos);

  const allToDoStatus = useSelector(selectAllToDosStatus);

  useEffect(() => {
    if (tripId) {
      dispatch(getTripById(tripId))
        .unwrap()
        .catch((err) => {
          if (error) {
            alert(error);
          } else alert(err || "Trip not found");
          navigate("/dashboard");
        });
    } else {
      navigate("/dashboard");
    }
  }, [dispatch, tripId, navigate]);

  useEffect(() => {
    dispatch(getAllToDos(tripId));
  }, [dispatch, tripId, navigate]);

  if (status === "loading") {
    return (
      <div className="container">
        <div
          className="row justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div className="col text-center">
            <h6 className="mt-4">Loading...</h6>
          </div>
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return <div>Error: {error || "Trip not found"}</div>;
  }

  if (status === "succeeded") {
    return (
      <div className="container">
        <div className="row bg-body-tertiary mt-4 p-2 rounded">
          <div className="col">
            <h4 className="text-center p-2">Trip Detail</h4>
          </div>
          <div className="col-auto p-2">
            <button
              data-bs-theme="dark"
              type="button"
              class="btn-close  fs-5"
              aria-label="Close"
              onClick={() => {
                navigate("/dashboard");
              }}
            ></button>
          </div>
        </div>
        <div className="row bg-body-tertiary mt-4 rounded p-4 text-center">
          {/* card for little dashboard */}
          <div class="col-md-6 col-sm-6 mb-3 mb-sm-0">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">{trip.tripName}</h5>
                <p class="card-text">{trip.destination}</p>
                <p className="card-text text-center">
                  {new Date(trip.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                  {`  --  `}
                  {new Date(trip.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {/* booked transportation and accommmodation */}
                <TravelBooking tripId={tripId} />
                <BookedAccommodations tripId={tripId} />
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">
                  <p></p>
                  'Traveling—it leaves you speechless, then turns you into a
                  storyteller.'
                  <p className="text-end">– Ibn Battuta</p>
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 mb-3 mb-sm-0">
            <div className="row mt-4">
              <div class="col-md-12 -sm-6 mb-3 mb-sm-0 h-100">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title text-center">ToDos</h5>
                    <div className="text-end">
                      {" "}
                      <i
                        type="button"
                        class=" bi bi-journal-plus fs-4"
                        data-bs-toggle="modal"
                        data-bs-target="#addToDoModal"
                        onClick={() => {
                          dispatch(resetAddToDoState());
                        }}
                      ></i>
                    </div>

                    {allToDoStatus === "loading" && (
                      <div className="container">
                        <div className="row justify-content-center align-items-center mt-2">
                          <div className="col text-center">
                            <h6 className="mt-2">Loading...</h6>
                          </div>
                        </div>
                      </div>
                    )}

                    {allToDoStatus === "succeeded" && (
                      <div class="table-responsive">
                        <table class="table">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">ToDo Name</th>
                              <th scope="col">Status</th>
                              <th scope="col">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {allToDos?.map((toDo, index) => (
                              <>
                                <tr key={toDo._id}>
                                  <th scope="row">{index + 1}</th>
                                  <td>
                                    <button
                                      type="button"
                                      class="btn btn-light"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#toDoDescriptionModal-${toDo._id}`}
                                    >
                                      {toDo.toDoName}
                                    </button>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-light"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#statusUpdateModal-${toDo._id}`}
                                    >{toDo.toDoStatus[0].toUpperCase() +
                                      toDo.toDoStatus.slice(1)}</button>
                                  </td>
                                  <td>
                                    <span>
                                      <i
                                        type="button"
                                        class="bi bi-pencil-square text-primary"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#toDoEditModal-${toDo._id}`}
                                        onClick={() => {
                                          dispatch(getToDoById(toDo._id))
                                            .unwrap()

                                            .catch((err) => alert(err));
                                        }}
                                      ></i>
                                    </span>
                                    <span>
                                      <button
                                        type="button"
                                        className="btn btn-light"
                                        onClick={() => {
                                          dispatch(deleteToDo(toDo._id))
                                            .unwrap()
                                            .then(() => {
                                              alert(
                                                "ToDo deleted successfully!"
                                              );
                                              return dispatch(
                                                getAllToDos(tripId)
                                              );
                                            })
                                            .catch((err) => alert(err));
                                        }}
                                      >Delete</button>
                                    </span>
                                  </td>

                                  <ToDoStatusUpdate
                                    toDoId={toDo._id.toString()}
                                    modalId={`statusUpdateModal-${toDo._id}`}
                                    initialState={toDo.toDoStatus}
                                  />
                                  <EditToDo toDoId={toDo._id} />
                                  <ToDoDescriptionModal toDoId={toDo._id} />
                                </tr>
                              </>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {allToDoStatus === "failed" && (
                      <div className=" text-center">
                        <i class="bi bi-journal-x fs-1"></i>
                        <p>No ToDos found!</p>
                        <button
                          className="btn btn-outline-primary mt-3"
                          data-bs-toggle="modal"
                          data-bs-target="#addToDoModal"
                        >
                          Add ToDo
                        </button>
                        <ToDoModal />
                      </div>
                    )}
                  </div>
                  <div class="card-footer">
                    <small class="text-body-secondary">
                      'Rename your “To-Do” list to your “Opportunities” list.
                      Each day is a treasure chest filled with limitless
                      opportunities; take joy in checking many off your list.'
                      <p className="text-end">- Steve Maraboli</p>
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row bg-body-tertiary mt-4 rounded p-4">
          <div class=" col  mb-3 mb-sm-0 h-100">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-center">Accommodation</h5>
                <Accommodation trip={trip} />
              </div>
            </div>
          </div>
        </div>

        <div className="row bg-body-tertiary mt-4 rounded p-4">
          <div class=" col  mb-3 mb-sm-0 h-100">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title text-center">Transportation</h5>
                <Transportation trip={trip} tripId={tripId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Trip;