import React, { useEffect, useState } from "react";
import axios from "axios";
import tripServices from "../services/tripServices";

const TravelBooking = ({ tripId }) => {
  const [travelBookings, setTravelBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelingBtn, setCancelingBtn] = useState({});

  const isPastDepartureTime = (departureTime) => {
    return Date.now() > new Date(departureTime).getTime();
  };

  useEffect(() => {
  const fetchTravelBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await tripServices.getAllTravelBooking(tripId);
      setTravelBookings(response.data);
    } catch (err) {
      console.error("Error fetching travel bookings:", err);
      setError(err.response?.data?.message || err.message || "Error fetching travel bookings");
    } finally {
      setLoading(false);
    }
  };

  fetchTravelBookings();
  }, [tripId]);

  const handleTravelBookingCancel = async (travelBookingId) => {
    setCancelingBtn((prev) => ({ ...prev, [travelBookingId]: true }));

    try {
      await tripServices.deleteTravelBookingById(travelBookingId);

      // Create a new array reference (React re-renders on new state)
      setTravelBookings((prevBookings) => {
        const updatedBookings = prevBookings.filter((booking) => booking._id !== travelBookingId);
        return [...updatedBookings]; // Ensure a new reference
      });

      alert("Travel booking canceled.");
    } catch (err) {
      alert("Failed to cancel the travel booking.");
    } finally {
      setCancelingBtn((prev) => ({ ...prev, [travelBookingId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <h6>Loading...</h6>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  if (!travelBookings.length) {
    return (
      <div className="text-center">
        <i className="bi bi-ticket-detailed-fill fs-1"></i>
        <p>No Travel Tickets Booked</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h5 className="text-start text-primary mb-3">Travels Booked</h5>
      <div
        className="table-responsive"
        style={{
          maxHeight: "300px",
          overflowY: "scroll",
          scrollbarWidth: "thin",
          outline: "none",
        }}
      >
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>No.</th>
              <th>Name</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Dep. Time</th>
              <th>Arr. Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {travelBookings.map((travelBooking, index) => (
              <tr key={travelBooking._id}>
                <td>{index + 1}</td>
                <td>{travelBooking.trainNumber || travelBooking.flightNumber} </td>
                <td>{travelBooking.trainName || travelBooking.airline}</td>
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
                    onClick={() => handleTravelBookingCancel(travelBooking._id)}
                  >
                    {cancelingBtn[travelBooking._id] ? "Canceling..." : "Cancel"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TravelBooking;