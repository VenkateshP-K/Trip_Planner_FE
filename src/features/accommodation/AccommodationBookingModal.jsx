import React, { useState } from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../users/usersSlice";
import {
  bookAccommodation,
  getAllBookedAccommodations,
  selectAccommodationBookingStatus,
} from "./accommodationSlice";

const AccommodationBookingModal = ({ accommodation, tripId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const accommodationBookingStatus = useSelector(
    selectAccommodationBookingStatus
  );

  const initialValues = {
    name: `${user.firstname} ${user.lastname}`,
    accommodationName: accommodation.name,
    location: accommodation.location,
    address: accommodation.address,
    amenities: accommodation.amenities,
    rating: accommodation.rating,
    checkInDate: "",
    checkOutDate: "",
  };

  const accommodationBookingValidationSchema = Yup.object({
    checkInDate: Yup.date().required("* Check-in date required"),
    checkOutDate: Yup.date().required("* Check-out date required"),
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div
            className="modal fade"
            id={`accommodationBookingModal-${accommodation._id}`}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id={`accommodationBookingModal-${accommodation._id}`}
                  >
                    Book Accommodation
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    disabled={isBooked}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* for loading */}
                  {isLoading && (
                    <div className="container">
                      <div className="row justify-content-center align-items-center mt-2">
                        <div className="col text-center">
                          <h6 className="mt-2">Loading...</h6>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* for successful booking */}
                  {isBooked && (
                    <div className="text-center">
                      <div className="text-primary">
                        <i class="bi bi-check-circle-fill fs-1"></i>
                        <h6>Success</h6>
                      </div>

                      <button
                        type="button"
                        className="btn btn-outline-danger rounded-pill"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          setIsBooked(false);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  )}
                  {!isLoading && !isBooked && (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={accommodationBookingValidationSchema}
                      onSubmit={(values, { resetForm, setSubmitting }) => {
                        const totalMilliSeconds =
                          new Date(values.checkOutDate).setHours(0, 0, 0, 0) -
                          new Date(values.checkInDate).setHours(0, 0, 0, 0);

                        const days = totalMilliSeconds / (24 * 60 * 60 * 1000);

                        setIsLoading(true);
                        dispatch(
                          bookAccommodation({
                            tripId,
                            accommodationData: values,
                          })
                        )
                          .unwrap()
                          .then(() => {
                            setIsBooked(true);
                            resetForm();
                            return dispatch(getAllBookedAccommodations(tripId));
                          })
                          .catch()
                          .finally(() => {
                            setIsLoading(false);
                            setSubmitting(false);
                          });
                      }}
                    >
                      {(formik) => (
                        <Form onSubmit={formik.handleSubmit}>
                          <div className="d-flex gap-2 justify-content-center">
                            <div>
                              <label htmlFor="checkInDate">Check-In Date</label>
                              <Field
                                type="date"
                                name="checkInDate"
                                className="form-control mt-2"
                              />
                              <ErrorMessage
                                name="checkInDate"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div>
                              <label htmlFor="checkOutDate">
                                Check-Out Date
                              </label>
                              <Field
                                type="date"
                                name="checkOutDate"
                                className="form-control mt-2"
                              />
                              <ErrorMessage
                                name="checkOutDate"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          <div className="modal-footer mt-4">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Submit
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccommodationBookingModal;