import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  bookFlight,
  cancelTravelBooking,
  getAllTravelBookings,
  resetGetAllTravelBookings,
  selectAllTravelBooking,
  selectAllTravelBookingError,
  selectAllTravelBookingStatus,
  selectFlightBookingStatus,
  selectTrainBookingStatus,
} from "./transportationSlice";
import { selectAllToDosStatus } from "../toDos/toDoSlice";
import { bookAccommodation } from "../accommodation/accommodationSlice";

const TravelBooking = ({ tripId }) => {
  const allTravelBookingStatus = useSelector(selectAllTravelBookingStatus);
  const allTravelBookingError = useSelector(selectAllTravelBookingError);

  const allTravelBooking = useSelector(selectAllTravelBooking);

  const flightsBooked = allTravelBooking?.flightsBooked;
  const trainsBooked = allTravelBooking?.trainsBooked;
  const carsBooked = allTravelBooking?.carsBooked;

  // flight booking status
  const flightBookingStatus = useSelector(selectFlightBookingStatus);
  // train booking status
  const trainBookingStatus = useSelector(selectTrainBookingStatus);

  // booking cancel
  const [cancelingBtn, setCancelingBtn] = useState({});

  const dispatch = useDispatch();

  const isPastDepartureTime = (departureTime) => {
    return Date.now() > new Date(departureTime).getTime(0);
  };

  // handling booking cancel

  const handleTravelBookingCancel = (bookedTravelData) => {
    const travelBookingId = bookedTravelData._id;

    // Set the cancelingBtn state to true for the current booking
    setCancelingBtn((prev) => ({ ...prev, [travelBookingId]: true }));

    // Dispatch the cancelTravelBooking action
    dispatch(cancelTravelBooking(travelBookingId))
      .unwrap()
      .then(() => {
        alert("Travel booking canceled");

        // Fetch updated travel bookings after cancellation
        return dispatch(getAllTravelBookings(tripId));
      })
      .catch((err) => {
        alert(`Error canceling travel booking: ${err.message || err}`);
      })
      .finally(() => {
        // Reset the cancelingBtn state for the current booking
        setCancelingBtn((prev) => ({ ...prev, [travelBookingId]: false }));
      });
  };

  useEffect(() => {
    dispatch(getAllTravelBookings(tripId))
      .unwrap()
      .catch((err) => alert(err));
    // dispatch(resetGetAllTravelBookings());
  }, [dispatch, tripId, flightBookingStatus, trainBookingStatus]);

  if (!allTravelBooking) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <i class="bi bi-ticket-detailed-fill fs-1"> </i>
            <p>No Travel Tickets Booked</p>
          </div>
        </div>
      </div>
    );
  }

  if (allTravelBookingStatus === "loading") {
    return (
      <div className="container">
        <div className="row ">
          <div className="col text-center">
            <h6 className="mt-2">Loading...</h6>
          </div>
        </div>
      </div>
    );
  }

  if (allTravelBookingStatus === "failed") {
    return (
      <div className="container">
        <div className="row ">
          <div className="col text-center">
            <h6 className="mt-2">Loading...</h6>
          </div>
        </div>
      </div>
    );
  }

  if (
    flightsBooked?.length === 0 &&
    trainsBooked?.length === 0 &&
    carsBooked?.length === 0
  ) {
    return (
      <div className="container">
        <div className="row">
          <div className="col">
            <i className="bi bi-ticket-detailed-fill fs-1"></i>
            <p>No Travel Tickets Booked</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {flightsBooked?.length > 0 && (
        <div className="row">
          <div className="col">
            <h6 className="text-start text-secondary">Flights Booked</h6>

            <div
              className="table-responsive"
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
                scrollbarWidth: "none",
                outline: "none",
              }}
            >
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">F.No.</th>
                    <th scope="col">Airline</th>
                    <th scope="col">Source</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Dep.Time</th>
                    <th scope="col">Arr.Time</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {flightsBooked?.map((travelBooking, index) => (
                    <tr>
                      <td scope="row">{index + 1}</td>
                      <td>
                        {travelBooking.flightNumber ||
                          travelBooking.trainNumber}
                      </td>
                      <td>
                        {travelBooking.airline || travelBooking.trainName}
                      </td>
                      <td>{travelBooking.source}</td>
                      <td>{travelBooking.destination}</td>
                      <td>
                        {new Date(travelBooking.departureTime).toLocaleString(
                          "en-IN",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td>
                        {new Date(travelBooking.arrivalTime).toLocaleString(
                          "en-IN",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger rounded-pill"
                          disabled={
                            isPastDepartureTime(travelBooking.departureTime) ||
                            cancelingBtn[travelBooking._id]
                          }
                          onClick={() => {
                            handleTravelBookingCancel(travelBooking);
                          }}
                        >
                          {cancelingBtn[travelBooking._id] === true ? (
                            <span role="status">Canceling...</span>
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* booked trains */}
      {trainsBooked?.length > 0 && (
        <div className="row">
          <div className="col">
            <h6 className="text-start text-secondary">Trains Booked</h6>
            <div
              className="table-responsive"
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
                scrollbarWidth: "none",
                outline: "none",
              }}
            >
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Train.No.</th>
                    <th scope="col">Tr.Name</th>
                    <th scope="col">Source</th>
                    <th scope="col">Destination</th>
                    <th scope="col">Dep.Time</th>
                    <th scope="col">Arr.Time</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {trainsBooked?.map((travelBooking, index) => (
                    <tr>
                      <td scope="row">{index + 1}</td>
                      <td>{travelBooking.trainNumber}</td>
                      <td>{travelBooking.trainName}</td>
                      <td>{travelBooking.source}</td>
                      <td>{travelBooking.destination}</td>
                      <td>
                        {new Date(travelBooking.departureTime).toLocaleString(
                          "en-IN",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td>
                        {new Date(travelBooking.arrivalTime).toLocaleString(
                          "en-IN",
                          {
                            timeZone: "UTC",
                          }
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger rounded-pill"
                          disabled={
                            isPastDepartureTime(travelBooking.departureTime) ||
                            cancelingBtn[travelBooking._id]
                          }
                          onClick={() => {
                            handleTravelBookingCancel(travelBooking);
                          }}
                        >
                          {cancelingBtn[travelBooking._id] === true ? (
                            <span role="status">Canceling...</span>
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelBooking;