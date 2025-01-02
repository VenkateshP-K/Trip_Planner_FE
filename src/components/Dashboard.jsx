import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import {
  deleteTripById,
  getAllTripsByUser,
  getTripById,
  searchTrips,
  selectTripError,
  selectTrips,
  selectTripStatus,
  selectTripUpdateStatus,
} from "../features/trips/tripSlice";
import { getAllToDos } from "../features/toDos/toDoSlice";
import { getFlightsSuggestions, getTrainsSuggestions } from "../features/transportation/transportationSlice";
import AddTrips from "../features/trips/AddTrips";
import EditTrip from "../features/trips/EditTrip";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const Dashboard = () => {
  const trips = useSelector(selectTrips);
  const status = useSelector(selectTripStatus);
  const tripUpdateStatus = useSelector(selectTripUpdateStatus);

  const dispatch = useDispatch();

  const navigate = useNavigate()

  const calculateDaysRemaining = (startDate) => {
    const todayInMillSec = new Date().setHours(0, 0, 0, 0);
    const startDateInMillSec = new Date(startDate).setHours(0, 0, 0, 0);

    if (todayInMillSec < startDateInMillSec) {
      const days =
        (startDateInMillSec - todayInMillSec) / (24 * 60 * 60 * 1000);
      return days;
    }
    return 0;
  }

  // handle trip delete

  const handleTripDelete = (tripId) => {
    dispatch(deleteTripById(tripId))
      .unwrap()
      .then(() => {
        alert("Trip deleted successfully!");
        dispatch(getAllTripsByUser());
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    dispatch(getAllTripsByUser());
  }, [dispatch]);

  return (
    <div className="container">
      <div
        className="row justify-content-center mt-4 pb-4 "
        style={{ borderBottom: "solid 2px", borderColor: "white" }}
      >
        <div className="col">
          <button
            className="btn btn-success"
            onClick={() => {
              navigate("/add-trip");
            }}
          >
            Add Trip
          </button>
        </div>
        <div className="col">
          <Formik
            initialValues={{ search: "" }}
            validationSchema={Yup.object({
              search: Yup.string().required("Key words required"),
            })}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              dispatch(searchTrips(values.search))
                .unwrap()
                .then(() => resetForm())
                .catch((err) => console.log(err))
                .finally(() => setSubmitting(false));
            }}
          >
            {(formik) => (
              <Form className="d-flex gap-2" role="search">
                <div className="col">
                  <Field
                    type="search"
                    className={`form-control ${
                      formik.touched.search
                        ? formik.errors.search
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    name="search"
                    placeholder="Search Trips"
                  />
                </div>

                <button class="btn btn-success" type="submit">
                  Search
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {status === "failed" && (
        <div className="container">
          <div
            className="row justify-content-center align-items-center text-center"
            style={{ height: "50vh" }}
          >
            <div className="col ">
              <i class="bi bi-rocket fs-1"></i>
              <h5>No trips</h5>
            </div>
          </div>
        </div>
      )}

      {status === "loading" && (
        <div className="container">
          <div
            className="row justify-content-center align-items-center"
            style={{ height: "50vh" }}
          >
            <div className="col text-center">
              <h6 className="mt-4">Loading...</h6>
            </div>
          </div>
        </div>
      )}

      {status === "succeeded" ? (
        <div class="row row-cols-1 row-cols-md-3 g-4 mt-4">
          {trips?.map((trip) => (
            <div class="col" key={trip._id}>
              <div class="card h-100">
                {/* <img src="..." class="card-img-top" alt="..." /> */}
                <div class="card-body">
                  <div className="d-flex justify-content-between">
                  </div>

                  <h5 class="card-title text-center">{trip.tripName}</h5>
                  <p class="card-text text-end">
                    <h6>- {trip.destination}</h6>
                  </p>
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

                  <p className="text-end mt-3">
                    <button
                      type="button"
                      class="btn btn-success btn-sm "
                      onClick={() => {
                        dispatch(getTripById(trip._id));
                        dispatch(getAllToDos(trip._id));

                        dispatch(
                          getFlightsSuggestions({
                            destination: trip.destination,
                          })
                        );
                        dispatch(
                          getTrainsSuggestions({
                            destination: trip.destination,
                          }) 
                        ).catch((err) => alert(err));

                        navigate(`/trip/${trip._id}`);
                      }}
                    >
                      Click More
                    </button>
                    <button type="button" class="btn btn-danger btn-sm ms-2" onClick={() => handleTripDelete(trip._id)}>Delete</button>
                  </p>
                </div>
                <div class="card-footer text-center">
                  <small class="text-body-secondary">
                    {calculateDaysRemaining(trip.startDate)} days to go
                  </small>
                </div>
              </div>

              <div
                class="modal fade"
                id={trip._id}
                data-bs-backdrop="static"
                data-bs-keyboard="false"
                tabindex="-1"
                aria-labelledby="staticBackdropLabel"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-scrollable">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id={trip._id}>
                        Edit Trip
                      </h1>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        disabled={tripUpdateStatus === "succeeded"}
                      ></button>
                    </div>
                    <div class="modal-body">
                      <EditTrip trip={trip} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Dashboard;