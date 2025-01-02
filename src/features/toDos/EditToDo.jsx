import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  editToDo,
  getToDoById,
  selectToDo,
  selectToDoEditStatus,
  resetToDoEdit,
  getAllToDos,
} from "./toDoSlice";
import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { selectTrip } from "../trips/tripSlice";

const EditToDo = ({ toDoId }) => {
  const toDo = useSelector(selectToDo);
  const editToDOStatus = useSelector(selectToDoEditStatus);
  const tripId = useSelector(selectTrip)._id;

  const dispatch = useDispatch();

  const initialValues = toDo;

  const toDoEditValidationSchema = Yup.object({
    toDoName: Yup.string().required("* ToDo name required"),
    toDoDescription: Yup.string().required("* ToDo description required"),
    toDoStatus: Yup.string()
      .oneOf(["pending", "in-progress", "completed"])
      .required("* ToDo status required"),
  });

  useEffect(() => {
    dispatch(getToDoById(toDoId)).catch((err) => alert(err));
  }, [dispatch]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div
            className="modal fade"
            id={`toDoEditModal-${toDoId}`}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id={`toDoEditModal-${toDoId}`}
                  >
                    Update ToDo
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  {editToDOStatus === "succeeded" ? (
                    <>
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
                            dispatch(getAllToDos(tripId));
                            console.log("clicked");

                            dispatch(resetToDoEdit());
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </>
                  ) : (
                    <Formik
                      initialValues={initialValues}
                      validationSchema={toDoEditValidationSchema}
                      onSubmit={(values, { setSubmitting, resetForm }) => {
                        dispatch(editToDo({ toDoId, toDo: values }))
                          .unwrap()
                          .then(() => {
                            resetForm();
                          })
                          .catch((err) => alert(JSON.stringify(err, null, 2)))
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
                                    type="text"
                                    name="toDoName"
                                    className={`form-control ${
                                      formik.touched.toDoName
                                        ? formik.errors.toDoName
                                          ? "is-invalid"
                                          : "is-valid"
                                        : ""
                                    }`}
                                    id="toDoName"
                                    placeholder="ToDo Name"
                                  />
                                  <label htmlFor="toDoName">ToDo Name</label>
                                  <ErrorMessage
                                    name="toDoName"
                                    className="text-danger"
                                    component="div"
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row">
                              <div className="col">
                                <div className="form-floating mb-3">
                                  <Field
                                    as="textarea"
                                    name="toDoDescription"
                                    className={`form-control ${
                                      formik.touched.toDoDescription
                                        ? formik.errors.toDoDescription
                                          ? "is-invalid"
                                          : "is-valid"
                                        : ""
                                    }`}
                                    id="toDoDescription"
                                    placeholder="Enter ToDo Description"
                                  />
                                  <label htmlFor="toDoDescription">
                                    ToDo Description
                                  </label>
                                  <ErrorMessage
                                    name="toDoDescription"
                                    className="text-danger"
                                    component="div"
                                  />
                                </div>
                              </div>
                            </div>

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
                                  <label htmlFor="toDoStatus">
                                    Status status
                                  </label>
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
                                  disabled={editToDOStatus === "loading"}
                                >
                                  {editToDOStatus === "loading" ? (
                                    <>
                                      {" "}
                                      <span
                                        className="spinner-border spinner-border-sm"
                                        area-hidden="true"
                                      ></span>{" "}
                                      <span role="status">Updating...</span>
                                    </>
                                  ) : (
                                    "Update ToDo"
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

export default EditToDo;