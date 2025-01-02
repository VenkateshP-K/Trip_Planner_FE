import * as Yup from "yup";

const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;

export const userRegistrationValidationSchema = Yup.object({
  firstname: Yup.string()
    .min(3, "* First name must be at least 3 characters.")
    .max(12, "* First name should not exceed 12 characters.")
    .required("* First name should not be empty."),
  lastname: Yup.string()
    .min(1, "* Last name should be at least 1 character.")
    .max(15, "* Last name should not exceed 15 characters.")
    .required("* Last name should not be empty."),
  email: Yup.string()
    .email("* Invalid email address.")
    .required("* Email address should not be empty."),
  phone: Yup.string()
    .required("* Phone number is required")
    .matches(phoneRegex, "* Phone number is not valid"),

  password: Yup.string()
    .required("* Password is required")
    .min(8, "Password must be at least mix of 8 characters long.")
    .matches(/[0-9]/, "Password requires a number.")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires a uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),

  confirmPassword: Yup.string()
    .required("** Confirm password is required")
    .oneOf(
      [Yup.ref("password"), null],
      "* The passwords do not match. Please try again"
    ),
});

export default userRegistrationValidationSchema;