import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  selectTripUpdateError,
  selectTripUpdateStatus,
  updateTripById,
  getAllTripsByUser,
} from "./tripSlice";
import { useNavigate } from "react-router-dom";
import { currencyOptions } from "./currency";

const EditTrip = ({ trip }) => {
  const tripUpdateStatus = useSelector(selectTripUpdateStatus);
  const tripUpdateError = useSelector(selectTripUpdateError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    tripName: trip.tripName,
    destination: trip.destination,
    startDate: new Date(trip.startDate).toISOString().split("T")[0],
    endDate: new Date(trip.endDate).toISOString().split("T")[0]
  };

  const tripValidationSchema = Yup.object({
    tripName: Yup.string().required("* Trip name required"),
    destination: Yup.string().required("* Trip destination required"),
    startDate: Yup.date().required("* Trip starting date required"),
    endDate: Yup.date().required("* Trip end date required")
  });

  return (
    <>
      {tripUpdateError === "failed" && (
        <div className="container">
          <div className="row">
            <div className="col text-center">
              <i className="bi bi-exclamation-octagon-fill fs-2"></i>
              <p>Error updating trip</p>
            </div>
          </div>
        </div>
      )}
      {tripUpdateStatus === "succeeded" && (
        <div className="text-center">
          <div className="text-primary">
            <i className="bi bi-check-circle-fill fs-1"></i>
            <h6>Success</h6>
          </div>
          <button
            type="button"
            className="btn btn-outline-danger rounded-pill"
            data-bs-dismiss="modal"
            onClick={() => {
              dispatch(getAllTripsByUser());
            }}
          >
            Close
          </button>
        </div>
      )}
      {tripUpdateStatus === "idle" && (
        <Formik
          initialValues={initialValues}
          validationSchema={tripValidationSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            dispatch(updateTripById({ tripId: trip._id, tripData: values }))
              .unwrap()
              .then(() => {
                resetForm();
                // alert("Trip updated successfully!");
              })
              .catch((err) => {
                console.log(err);
                alert(err);
              })
              .finally(() => setSubmitting(false));
          }}
        >
          {(formik) => (
            <Form
              onSubmit={formik.handleSubmit}
              className="rounded mt-3 p-4 bg-body-tertiary"
            >
              <h3 className="text-center pb-3">Trip</h3>

              <div className="row">
                <h6>Trip info</h6>
                <div className="col">
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      name="tripName"
                      className={`form-control ${
                        formik.touched.tripName
                          ? formik.errors.tripName
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      id="tripName"
                      placeholder=""
                    />
                    <label htmlFor="tripName">Trip Name</label>
                    <ErrorMessage
                      name="tripName"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      name="destination"
                      className={`form-control ${
                        formik.touched.destination
                          ? formik.errors.destination
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      id="destination"
                      placeholder=""
                    />
                    <label htmlFor="destination">Destination</label>
                    <ErrorMessage
                      name="destination"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <h6>Trip dates</h6>
                <div className="col">
                  <div className="form-floating mb-3 ">
                    <Field
                      type="date"
                      name="startDate"
                      className={`form-control ${
                        formik.touched.startDate
                          ? formik.errors.startDate
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      id="startDate"
                      placeholder=""
                    />
                    <label htmlFor="startDate">Start Date</label>
                    <ErrorMessage
                      name="startDate"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="form-floating mb-3">
                    <Field
                      type="date"
                      name="endDate"
                      className={`form-control ${
                        formik.touched.endDate
                          ? formik.errors.endDate
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      id="endDate"
                      placeholder=""
                    />
                    <label htmlFor="endDate">End Date</label>
                    <ErrorMessage
                      name="endDate"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary rounded-pill w-100"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Updating..." : "Update"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}{" "}
    </>
  );
};

export default EditTrip;