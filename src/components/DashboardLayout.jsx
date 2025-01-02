import React from "react";
import { Outlet } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";

const DashboardLayout = () => {
  return (
    <div>
      <DashboardNavbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;