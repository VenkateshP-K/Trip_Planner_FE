import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  searchAccommodation,
  selectAccommodationSearch,
  selectAccommodationSearchError,
  selectAccommodationSearchStatus,
} from "./accommodationSlice";
import ReactPaginate from "react-paginate";
import { selectUser } from "../users/usersSlice";
import AccommodationBookingModal from "./AccommodationBookingModal";

const Accommodation = ({ trip }) => {
  const tripId = trip._id;
  const suggestedAccommodations = useSelector(selectAccommodationSearch);
  const accommodationSearchStatus = useSelector(
    selectAccommodationSearchStatus
  );
  const user = useSelector(selectUser);
  const accommodationSearchError = useSelector(selectAccommodationSearchError);

  const dispatch = useDispatch();

  // loading accommodation btns
  const [accommodationLoadingBtn, setAccommodationLoadingBtn] = useState({});

  // pagination
  const [accommodationCurrentPage, setAccommodationCurrentPage] = useState(0);
  const accommodationsPerPage = 5;

  const paginatedAccommodations = suggestedAccommodations?.slice(
    accommodationCurrentPage * accommodationsPerPage,
    (accommodationCurrentPage + 1) * accommodationsPerPage
  );

  const handleAccommodationPageClick = (data) => {
    setAccommodationCurrentPage(data.selected);
  };

  // formik related
  const initialValues = {
    location: "",
  };

  const accommodationSearchValidationSchema = Yup.object({
    location: Yup.string().required("* Location required"),
  });

  // useEffect
  useEffect(() => {
    dispatch(searchAccommodation(trip.destination));
  }, [dispatch, tripId]);

  return (
    <>
      <div className="border p-2 rounded">
        <Formik
          initialValues={initialValues}
          validationSchema={accommodationSearchValidationSchema}
          onSubmit={(values, { resetForm, setSubmiting }) => {
            dispatch(searchAccommodation(values.location))
              .unwrap()
              .then(() => resetForm())
              .catch((err) => alert(err))
              .finally(() => setSubmiting(false));
          }}
        >
          {(formik) => (
            <Form className="">
              <div className="d-flex gap-2">
                <Field
                  type="search"
                  className={`form-control ${
                    formik.touched.location
                      ? formik.errors.location
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  placeHolder="Search Location"
                  name="location"
                />

                <button className="btn btn-primary">Search</button>
              </div>

              <ErrorMessage
                className="text-danger mt-2"
                name="location"
                component={"div"}
              />
            </Form>
          )}
        </Formik>
      </div>

      {/* accommodation search loading */}

      {accommodationSearchStatus === "loading" && (
        <div className="container">
          <div className="row justify-content-center align-items-center mt-2">
            <div className="col text-center">
              <h6 className="mt-2">Loading...</h6>
            </div>
          </div>
        </div>
      )}

      {/* accommodation seach fail */}
      {accommodationSearchStatus === "failed" && (
        <div className="text-center mt-2">
          <i class="bi bi-building-x fs-3"></i>
          <h6>No Accommodation Available</h6>
        </div>
      )}

      {/* accommodation search succeed */}
      {accommodationSearchStatus === "succeeded" && (
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <caption className="caption-top">Available Accommodation</caption>

            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Location</th>
                <th scope="col">Amenities</th>
                <th scope="col">Rating</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAccommodations?.map((accommodation, index) => (
                <tr key={accommodation._id}>
                  <td scope="row">
                    {accommodationCurrentPage * accommodationsPerPage +
                      index +
                      1}
                  </td>
                  <td>{accommodation.name}</td>
                  <td>{`${accommodation.address}`}</td>
                  <td>{accommodation.amenities.join(", ")}</td>
                  <td>{accommodation.rating}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      data-bs-toggle="modal"
                      data-bs-target={`#accommodationBookingModal-${accommodation._id}`}
                    >
                      Book
                    </button>
                  </td>

                  <AccommodationBookingModal
                    accommodation={accommodation}
                    tripId={tripId}
                  />
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel="previous"
            nextLabel="next"
            breakLabel="..."
            pageCount={Math.ceil(
              suggestedAccommodations.length / accommodationsPerPage
            )}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            className="pagination justify-content-center mt-4"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            onPageChange={handleAccommodationPageClick}
          />
        </div>
      )}
    </>
  );
};

export default Accommodation;