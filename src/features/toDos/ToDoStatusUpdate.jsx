import React from "react";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllToDos,
  resetToDoStatusUpdate,
  selectToDoUpdateError,
  selectToDoUpdateStatus,
  updateToDoStatus,
} from "./toDoSlice";
import { selectTrip } from "../trips/tripSlice";
import { useNavigate } from "react-router-dom";

const ToDoStatusUpdate = ({ toDoId, modalId, initialState }) => {
  const updateStatus = useSelector(selectToDoUpdateStatus);
  const updateError = useSelector(selectToDoUpdateError);
  const tripId = useSelector(selectTrip)._id;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    toDoStatus: initialState,
  };

  const toDoStatusValidationSchema = Yup.object({
    toDoStatus: Yup.string()
      .oneOf(["pending", "in-progress", "completed"])
      .required("* ToDo status required"),
  });

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div
            className="modal fade"
            id={modalId}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id={modalId}>
                    Update ToDo Status
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    disabled={updateStatus === "succeeded"}
                  ></button>
                </div>
                <div className="modal-body">
                  {updateStatus === "succeeded" ? (
                    <>
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
                            dispatch(resetToDoStatusUpdate());
                            dispatch(getAllToDos(tripId));
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  ) : (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={toDoStatusValidationSchema}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        dispatch(
                          updateToDoStatus({ toDoId, toDoStatus: values })
                        )
                          .unwrap()
                          .then(() => {
                            resetForm();
                          })
                          .catch((err) => alert(err))
                          .finally(() => setSubmitting(false));
                      }}
                    >
                      {(formik) => (
                        <Form
                          onSubmit={formik.handleSubmit}
                          className="border rounded m-4 p-4 bg-body-tertiary"
                        >
                          <div className="container">
                            <h3 className="text-center mb-4">ToDo</h3>

                            <div className="row">
                              <div className="col">
                                <div className="form-floating mb-3">
                                  <Field
                                    as="select"
                                    name="toDoStatus"
                                    className={`form-select ${
                                      formik.touched.toDoStatus
                                        ? formik.errors.toDoStatus
                                          ? "is-invalid"
                                          : "is-valid"
                                        : ""
                                    }`}
                                    id="toDoStatus"
                                    placeholder="Select status"
                                  >
                                    {[
                                      "pending",
                                      "in-progress",
                                      "completed",
                                    ].map((status, index) => (
                                      <option key={index} value={status}>
                                        {status[0].toUpperCase() +
                                          status.slice(1)}
                                      </option>
                                    ))}
                                  </Field>
                                  <label htmlFor="toDoStatus">Status</label>
                                  <ErrorMessage
                                    name="toDoStatus"
                                    className="text-danger"
                                    component="div"
                                  />
                                </div>
                              </div>
                            </div>
                            <div className="modal-footer justify-content-center">
                              <div>
                                <button
                                  type="submit"
                                  className="btn btn-outline-success rounded-pill"
                                  disabled={updateStatus === "loading"}
                                >
                                  {updateStatus === "loading" ? (
                                    <>
                                      {" "}
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        area-hidden="true"
                                      ></span>{" "}
                                      <span role="status">Updating...</span>
                                    </>
                                  ) : (
                                    "Update Status"
                                  )}
                                </button>
                              </div>
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-outline-danger rounded-pill"
                                  data-bs-dismiss="modal"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoStatusUpdate;