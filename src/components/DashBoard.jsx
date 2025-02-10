import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tripServices from "../services/tripServices";
import userServices from "../services/userServices";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const response = await tripServices.getAllTripsByUserId();
  
      if (response?.data && Array.isArray(response.data)) {
        setTrips(response.data);
        setStatus("succeeded");
      } else {
        setTrips([]); 
        setStatus("succeeded");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setTrips([]); 
        setStatus("succeeded");
      } else {
        setStatus("failed");
      }
    }
  };


  const handleTripDelete = async (tripId) => {
    try {
      await tripServices.deleteTrip(tripId);
      alert("Trip deleted successfully!");
      fetchTrips();
    } catch (error) {
      alert("Error deleting trip: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await userServices.Logout();
      alert("Logged out successfully");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      setError("Logout failed. Try again.");
    }
  };

  const calculateDaysRemaining = (startDate) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const tripStart = new Date(startDate).setHours(0, 0, 0, 0);
    return today < tripStart
      ? Math.floor((tripStart - today) / (24 * 60 * 60 * 1000))
      : 0;
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center mt-4 pb-4" style={{ borderBottom: "solid 2px", borderColor: "white" }}>
        <div className="col">
          <button className="btn btn-success" onClick={() => navigate("/dashboard/add-trip")}>
            Add Trip
          </button>
        </div>
        <div className="col text-end">
                <button className="btn btn-success" onClick={handleLogout}>
                  Logout
                </button>
        </div>
      </div>

      {status === "failed" && (
        <div className="text-center mt-5">
          <h5>No trips available</h5>
        </div>
      )}

      {status === "loading" && (
        <div className="text-center mt-5">
          <h6>Loading...</h6>
        </div>
      )}

      {status === "succeeded" && trips.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-3 g-4 mt-4">
          {trips.map((trip) => (
            <div className="col" key={trip._id}>
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title text-center">{trip.tripName}</h5>
                  <p className="card-text text-center">
                    {new Date(trip.startDate).toLocaleDateString()} -{" "}
                    {new Date(trip.endDate).toLocaleDateString()}
                  </p>
                  <p className="card-text text-end">
                    <strong>Destination:</strong> {trip.destination}
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => navigate(`/dashboard/trip/${trip._id}`)}
                    >
                      Details
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleTripDelete(trip._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="card-footer text-center">
                  <small>{calculateDaysRemaining(trip.startDate)} days to go</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : status === "succeeded" ? (
        <div className="text-center mt-5">
          <h5>No trips found</h5>
        </div>
      ) : null}
    </div>
  );
};

export default Dashboard;