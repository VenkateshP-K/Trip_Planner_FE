import React, { useEffect } from "react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-body-tertiary text-center py-3 fixed-bottom">
      <div className="container">
        <p className="mb-0">
          &copy; {year} Travel-Planner-India. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
