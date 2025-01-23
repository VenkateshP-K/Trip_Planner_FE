import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import ReactPaginate from "react-paginate";
import tripServices from "../services/tripServices";

const Accommodation = ({ trip }) => {
  const tripId = trip?._id || "";
  const [suggestedAccommodations, setSuggestedAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [bookingStatus, setBookingStatus] = useState({});

  const accommodationsPerPage = 5;

  const paginatedAccommodations = suggestedAccommodations.slice(
    currentPage * accommodationsPerPage,
    (currentPage + 1) * accommodationsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  // Form validation schema
  const accommodationSearchValidationSchema = Yup.object({
    location: Yup.string().required("* Location is required"),
  });

  // Fetch accommodations
  const fetchAccommodations = async (location) => {
    setLoading(true);
    setError("");

    try {
      const response = await tripServices.suggestAccommodation();
      console.log("Response from suggestAccommodation:", response); // Log response to verify

      // If response data is an array of accommodations, continue; if it's an HTML page, handle the error
      if (Array.isArray(response.data)) {
        // Filter accommodations by location if the response contains the expected data
        const filteredAccommodations = response.data.filter((accommodation) =>
          accommodation.address.toLowerCase().includes(location.toLowerCase())
        );

        setSuggestedAccommodations(filteredAccommodations);
      } else {
        throw new Error("Unexpected response format: HTML page returned.");
      }
    } catch (err) {
      console.error("Error fetching accommodations:", err);
      setError(err.response?.data?.message || "Failed to fetch accommodations.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookAccommodation = async (accommodationId) => {
    try {
      console.log("Before booking status:", bookingStatus); // Debug: Check initial state

      // Set status to 'booking'
      setBookingStatus((prev) => ({
        ...prev,
        [accommodationId]: "booking",
      }));

      const selectedAccommodation = suggestedAccommodations.find(
        (acc) => acc._id === accommodationId
      );

      if (!selectedAccommodation) {
        console.error("Accommodation not found.");
        return;
      }

      const bookingDetails = {
        tripId: trip._id,
        userId: trip.userId,
        accommodationId: selectedAccommodation._id,
        address: selectedAccommodation.address,
        accommodationName: selectedAccommodation.name,
        name: trip.userName || "Guest",
      };

      const response = await tripServices.bookAccommodation(trip._id, bookingDetails);
      console.log("Booking Response:", response);

      // Set status to 'booked' on success
      setBookingStatus((prev) => ({
        ...prev,
        [accommodationId]: "booked",
      }));
    } catch (err) {
      console.error("Error booking accommodation:", err.response?.data || err.message);

      // Reset status to allow retries
      setBookingStatus((prev) => ({
        ...prev,
        [accommodationId]: "error",
      }));
    }
  };

  return (
    <div>
      <div className="border p-2 rounded">
        <Formik
          initialValues={{ location: "" }}
          validationSchema={accommodationSearchValidationSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            fetchAccommodations(values.location)
              .then(() => resetForm())
              .catch((err) => console.error(err))
              .finally(() => setSubmitting(false));
          }}
        >
          {(formik) => (
            <Form>
              <div className="d-flex gap-2">
                <Field
                  type="search"
                  name="location"
                  className={`form-control ${formik.touched.location && formik.errors.location
                    ? "is-invalid"
                    : formik.touched.location
                      ? "is-valid"
                      : ""
                    }`}
                  placeholder="Enter location"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || formik.isSubmitting}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
              <ErrorMessage
                name="location"
                component="div"
                className="text-danger mt-2"
              />
            </Form>
          )}
        </Formik>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center mt-3">
          <h6>Loading...</h6>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-center mt-3 text-danger">
          <h6>{error}</h6>
        </div>
      )}

      {/* Success state */}
      {suggestedAccommodations.length > 0 && (
        <div className="table-responsive mt-3">
          <table className="table table-striped table-hover align-middle">
            <caption className="caption-top">Available Accommodations</caption>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Location</th>
                <th>Amenities</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccommodations.map((accommodation, index) => (
                <tr key={accommodation._id}>
                  <td>
                    {currentPage * accommodationsPerPage + index + 1}
                  </td>
                  <td>{accommodation.name}</td>
                  <td>{accommodation.address}</td>
                  <td>{accommodation.amenities?.join(", ") || "N/A"}</td>
                  <td>{accommodation.rating || "N/A"}</td>
                  <td>
                    {bookingStatus[accommodation._id] === "booked" ? (
                      <>
                        <button className="btn btn-success" disabled>
                          Booked
                        </button>
                      </>
                    ) : (
                      <button
                        className={`btn ${bookingStatus[accommodation._id] === "booking"
                          ? "btn-warning"
                          : "btn-primary"
                          }`}
                        onClick={() => handleBookAccommodation(accommodation._id)}
                        disabled={bookingStatus[accommodation._id] === "booking"}
                      >
                        {bookingStatus[accommodation._id] === "booking" ? "Booking..." : "Book"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={Math.ceil(
              suggestedAccommodations.length / accommodationsPerPage
            )}
            onPageChange={handlePageClick}
            containerClassName="pagination justify-content-center mt-4"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            activeClassName="active"
          />
        </div>
      )}

      {/* No results */}
      {!loading && !error && suggestedAccommodations.length === 0 && (
        <div className="text-center mt-3">
          <h6>No accommodations found. Try a different location.</h6>
        </div>
      )}
    </div>
  );
};

export default Accommodation;