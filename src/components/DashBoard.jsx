import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import tripServices from "../services/tripServices";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();

  const fetchTrips = async () => {
    setStatus("loading");
    try {
      const response = await tripServices.getAllTripsByUserId();
      setTrips(response.data);
      setStatus("succeeded");
    } catch (error) {
      console.error("Error fetching trips:", error);
      setStatus("failed");
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
        <div className="col">
          <Formik
            initialValues={{ search: "" }}
            validationSchema={Yup.object({
              search: Yup.string().required("Keywords required"),
            })}
            onSubmit={async (values, { resetForm }) => {
              try {
                const response = await tripServices.searchTrips(values.search);
                setTrips(response.data);
                resetForm();
              } catch (error) {
                console.error("Error searching trips:", error);
              }
            }}
          >
            {(formik) => (
              <Form className="d-flex gap-2" role="search">
                <div className="col">
                  <Field
                    type="search"
                    className={`form-control ${formik.touched.search
                        ? formik.errors.search
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                      }`}
                    name="search"
                    placeholder="Search Trips"
                  />
                </div>
                <button className="btn btn-success" type="submit">
                  Search
                </button>
              </Form>
            )}
          </Formik>
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