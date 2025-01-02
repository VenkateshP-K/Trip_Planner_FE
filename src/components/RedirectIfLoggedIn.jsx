import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser,
  selectUser,
  selectUserStatus,
} from "../features/users/usersSlice";

const RedirectIfLoggedIn = ({ redirectPath = "/dashboard" }) => {
  const user = useSelector(selectUser);

  if (user) {
    return <Navigate to={redirectPath} replace />;
  }

  return null;
};

export default RedirectIfLoggedIn;