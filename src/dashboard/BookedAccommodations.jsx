import React, { useEffect, useState } from "react";
import tripServices from "../services/tripServices";

const BookedAccommodations = ({ tripId }) => {
  const [bookedAccommodations, setBookedAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelBtnLoading, setCancelBtnLoading] = useState({});
  const [editingDates, setEditingDates] = useState({}); // Define editingDates here

  // Fetch booked accommodations from the backend
  const fetchBookedAccommodations = async () => {
    if (!tripId) {
      setError("Trip ID is missing");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await tripServices.getAllBookedAccommodations(tripId); // Pass tripId here
      setBookedAccommodations(response.data);
    } catch (err) {
      setError(err.message || "Failed to fetch accommodations");
    } finally {
      setLoading(false);
    }
  };

  // Handle changes to the input fields for Check-In and Check-Out dates
  const handleDateChange = (accId, field, value) => {
    setEditingDates((prev) => ({
      ...prev,
      [accId]: {
        ...prev[accId],
        [field]: value,
      },
    }));
  };

  // Handle cancellation of accommodation booking
  const handleAccommodationBookingCancel = async (accommodation) => {
    const accommodationBookingId = accommodation._id;

    setCancelBtnLoading((prev) => ({
      ...prev,
      [accommodationBookingId]: true,
    }));

    try {
      await tripServices.deleteAccommodationById(accommodationBookingId);
      alert("Accommodation booking canceled");

      // After cancellation, refetch booked accommodations
      fetchBookedAccommodations();
    } catch (err) {
      alert(`Error canceling accommodation: ${err.message || err}`);
    } finally {
      setCancelBtnLoading((prev) => ({
        ...prev,
        [accommodationBookingId]: false,
      }));
    }
  };

  useEffect(() => {
    fetchBookedAccommodations();
  }, [tripId]);

  if (loading) {
    return (
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h6 className="mt-2">Loading...</h6>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <h6 className="mt-2 text-secondary">No Accommodation Booked</h6>
          </div>
        </div>
      </div>
    );
  }

  if (bookedAccommodations.length === 0) {
    return (
      <div className="container">
        <div className="row">
          <div className="col text-center">
            <i className="bi bi-building-x fs-3"></i>
            <h6>No Accommodation Booked</h6>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h6 className="text-start text-secondary">
            Accommodations Booked (*CheckIn&out can be done any time)
          </h6>

          <div
            className="table-responsive"
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
              scrollbarWidth: "none",
              outline: "none",
            }}
          >
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Location</th>
                  <th scope="col">Amenities</th>
                  <th scope="col">Check-In</th>
                  <th scope="col">Check-Out</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {bookedAccommodations?.map((accommodation, index) => {
                  const { _id, accommodationName, address, amenities, checkInDate, checkOutDate } = accommodation;
                  const dates = editingDates[_id] || {};

                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{accommodationName}</td>
                      <td>{address}</td>
                      <td>{amenities.join(", ")}</td>
                      <td>
                        {new Date(checkInDate).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td>
                        {" "}
                        {new Date(checkOutDate).toLocaleString(
                          "en-IN"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger rounded-pill"
                          disabled={cancelBtnLoading[_id]}
                          onClick={() => handleAccommodationBookingCancel(accommodation)}
                        >
                          {cancelBtnLoading[_id] ? <span role="status">Canceling...</span> : "Cancel"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
};

export default BookedAccommodations;