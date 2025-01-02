import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal } from "bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectUserError,
  selectUserId,
  selectUserLoginError,
  selectUserLoginStatus,
  selectUserStatus,
  userLogin,
} from "../features/users/usersSlice";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  email: "",
  password: "",
};

const userLoginValidationSchema = Yup.object({
  email: Yup.string()
    .required("* Email required")
    .email(" Invalid email address"),

  password: Yup.string().required("* Password required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const modalRef = useRef(null);

  const status = useSelector(selectUserStatus);
  const error = useSelector(selectUserError);
  const user = useSelector(selectUser);

  // user login state
  const userLoginStatus = useSelector(selectUserLoginStatus);
  const userLoginError = useSelector(selectUserLoginError);
  const userId = useSelector(selectUserId);

  const openModal = () => {
    const modalElement = modalRef.current;
    const modal = new Modal(modalElement);
    modal.show();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-12">
          <Formik
            initialValues={initialValues}
            validationSchema={userLoginValidationSchema}
            onSubmit={(values, { resetForm, setSubmitting }) => {
              dispatch(userLogin(values))
                .unwrap()
                .then((res) => {
                  resetForm();
                  if (res?.userId) {
                    openModal();
                  } else if (res.token) {
                    navigate("/dashboard");
                  } else navigate("/login");
                })
                .catch((err) => {
                  alert(JSON.stringify(err, null, 2));
                })

                .finally(() => {
                  setSubmitting(false);
                });
            }}
          >
            {(formik) => (
              <Form
                onSubmit={formik.handleSubmit}
                className="border rounded m-4 p-4 bg-body-tertiary shadow"
              >
                <div className="text-center">
                  <i
                    class="bi bi-person-circle text"
                    style={{ fontSize: "50px" }}
                  ></i>
                </div>

                <h3 className="text-center p-2">Login</h3>

                <div className="row ">
                  <div className="col">
                    <div class="mb-3">
                      <div class="form-floating mb-3 ">
                        <Field
                          type="email"
                          class={`form-control ${formik.touched.email
                              ? formik.errors.email
                                ? "is-invalid"
                                : "is-valid"
                              : ""
                            }`}
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                        />
                        <label for="email">Email address</label>
                        <ErrorMessage
                          name="email"
                          className="text-danger"
                          component="div"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-3">
                  <div class="form-floating mb-3">
                    <Field
                      type="password"
                      class={`form-control ${formik.touched.password
                          ? formik.errors.password
                            ? "is-invalid"
                            : "is-valid"
                          : ""
                        }`}
                      id="password"
                      name="password"
                      placeholder=""
                    />
                    <label for="password">Password</label>
                    <ErrorMessage
                      className="text-danger"
                      name="password"
                      component="div"
                    />
                  </div>
                </div>

                <div className="text-end">
                  <button
                    type="submit"
                    class="btn btn-outline-primary mt-3 rounded-pill"
                    disabled={userLoginStatus === "loading"}
                  >
                    {userLoginStatus === "loading" ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                        ></span>{" "}
                        <span role="status">Loging...</span>
                      </>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <div className="row justify-content-center text-center">
        <div className="col-md-6">
          <div className="border rounded p-4 m-4 bg-body-tertiary shadow">
            <div>
              For creating an account?{" "}
              <Link to={"/register"} className="link-primary">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
