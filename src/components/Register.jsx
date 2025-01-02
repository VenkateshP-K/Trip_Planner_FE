import React, { useRef } from "react";

import { Link, useNavigate } from "react-router-dom";
import userRegistrationValidationSchema from '../validationSchema/userRegistrationValidationSchema'
import "../styles/Register.css";
import { Formik, Field, Form, ErrorMessage } from "formik";

import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  selectUserRegisterStatus,
} from "../features/users/usersSlice";

const intialValues = {
  firstname: "",
  lastname: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // user register state
  const userRegisterStatus = useSelector(selectUserRegisterStatus);

  return (
    <div className="container">
      <div className="row justify-content-center ">
        <div className="col-md-6">
          <Formik
            initialValues={intialValues}
            validationSchema={userRegistrationValidationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              dispatch(registerUser(values))
                .unwrap()
                .then((res) => {
                  alert(res.message);
                  resetForm();
                  navigate("/login");
                })
                .catch((err) => {
                  alert(err);
                })
                .finally(() => setSubmitting(false));
            }}
          >
            {(formik) => (
              <Form
                onSubmit={formik.handleSubmit}
                className="border rounded m-4 p-4 bg-body-tertiary shadow "
              >
                <div className="text-center" style={{ fontSize: "60px" }}>
                  <i class="bi bi-person-add"></i>
                </div>
                <h3 className="text-center">Register</h3>

                <div className="mb-3">
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      name="firstname"
                      className={`form-control ${
                        formik.touched.firstname
                          ? formik.errors.firstname
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      id="firstname"
                      placeholder=""
                    />

                    <label htmlFor="floatingInput">Firstname</label>

                    <ErrorMessage
                      name="firstname"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      className={`form-control ${
                        formik.touched.lastname
                          ? formik.errors.lastname
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      name="lastname"
                      id="lastname"
                      placeholder=""
                    />
                    <label htmlFor="lastname">Lastname</label>

                    <ErrorMessage
                      name="lastname"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating mb-3">
                    <Field
                      type="email"
                      className={`form-control ${
                        formik.touched.email
                          ? formik.errors.email
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      name="email"
                      id="email"
                      placeholder=""
                    />
                    <label htmlFor="email">Email address</label>
                    <ErrorMessage
                      name="email"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <div className="form-floating mb-3">
                    <Field
                      type="text"
                      className={`form-control ${
                        formik.touched.phone
                          ? formik.errors.phone
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      name="phone"
                      id="phone"
                      placeholder=""
                    />
                    <label htmlFor="phone">Phone No</label>
                    <ErrorMessage
                      name="phone"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>


                <div className="mb-3">
                  <div className="form-floating mb-3">
                    <Field
                      type="password"
                      className={`form-control ${
                        formik.touched.password
                          ? formik.errors.password
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                      }`}
                      id="password"
                      name="password"
                      placeholder=""
                    />
                    <label htmlFor="password">Password</label>
                    <ErrorMessage
                      name="password"
                      className="text-danger"
                      component="div"
                    />
                  </div>
                </div>

                <div className="form-floating">
                  <Field
                    type="password"
                    className={`form-control ${
                      formik.touched.confirmPassword
                        ? formik.errors.confirmPassword
                          ? "is-invalid"
                          : "is-valid"
                        : ""
                    }`}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder=""
                  />
                  <label htmlFor="confirmPassword">Confirm password</label>
                  <ErrorMessage
                    name="confirmPassword"
                    className="text-danger"
                    component="div"
                  />
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    className="btn btn-outline-primary rounded-pill mt-3"
                    disabled={userRegisterStatus === "loading"}
                  >
                    {userRegisterStatus === "loading" ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          area-hidden="true"
                        ></span>{" "}
                        <span role="status">registering...</span>
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className="row justify-content-center text-cente">
        <div className="col-md-6">
          <div className="border rounded p-4 m-4 mt-2 bg-body-tertiary shadow">
            <div>
              Already have an account?{" "}
              <Link to={"/login"} className="link-primary">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;