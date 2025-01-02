import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  bookFlight,
  bookTrain,
  getAllTravelBookings,
  getFlightsSuggestions,
  getTrainsSuggestions,
  resetFlightBooking,
  selectFlightBookingError,
  selectFlightBookingStatus,
  selectFlightsSuggestionError,
  selectFlightsSuggestionState,
  selectSuggestedFlights,
  selectSuggestTrains,
  selectTrainBookingStatus,
  selectTrainsSuggestionError,
  selectTrainsSuggestionState,
} from "./transportationSlice";
import ReactPaginate from "react-paginate";
import { selectUser } from "../users/usersSlice";
import { v4 as uuidv4 } from "uuid";

const Transportation = ({ trip }) => {
  const tripId = trip._id;

  // for trains
  const trainsSuggestionsState = useSelector(selectTrainsSuggestionState);
  const trainsSuggestionsError = useSelector(selectTrainsSuggestionError);
  const suggestedTrains = useSelector(selectSuggestTrains);

  const trainBookingStatus = useSelector(selectTrainBookingStatus);

  // for flights
  const flightsSuggestionsState = useSelector(selectFlightsSuggestionState);
  const flightsSuggestionsError = useSelector(selectFlightsSuggestionError);
  const user = useSelector(selectUser);

  const suggestedFlights = useSelector(selectSuggestedFlights);

  // flight booking
  const flightBookingStatus = useSelector(selectFlightBookingStatus);
  const flightBookingError = useSelector(selectFlightBookingError);

  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageTains, setCurrentPageTrains] = useState(0);
  const [loadingButtons, setLoadingButtons] = useState({});

  const dispatch = useDispatch();

  const itemsPerPage = 5;
  const paginatedFlights = suggestedFlights?.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const trainsPerPage = 5;
  const paginatedTrains = suggestedTrains?.slice(
    currentPageTains * trainsPerPage,
    (currentPageTains + 1) * trainsPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  const handlePageClickForTain = (data) => {
    setCurrentPageTrains(data.selected);
  };

  const handleFlightBooking = (flight) => {
    const flightId = flight._id;
    setLoadingButtons((pre) => ({ ...pre, [flightId]: true }));

    const flightBookingData = {
      name: `${user.firstname} ${user.lastname}`,
      travelType: "flight",
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      source: flight.source,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime
    };

    dispatch(bookFlight({ tripId, flightBookingData }))
      .unwrap()
      .then(() => alert("Flight booked successfully!"))
      .catch((err) => alert(JSON.stringify(err, null, 2)))
      .finally(() => {
        setLoadingButtons((prev) => {
          return { ...prev, [flightId]: false };
        });
      });
  };

  const handleTrainBooking = (train) => {
    const trainId = train._id;
    setLoadingButtons((prev) => ({ ...prev, [trainId]: true }));

    const trainBookingData = {
      name: `${user.firstname} ${user.lastname}`,
      travelType: "train",
      trainNumber: train.trainNumber,
      trainName: train.trainName,
      source: train.source,
      destination: train.destination,
      departureTime: train.departureTime,
      arrivalTime: train.arrivalTime,
    };

    dispatch(bookTrain({ tripId, trainBookingData }))
      .unwrap()
      .then(() => alert("Train booked successfully!"))
      .catch((err) => alert(err))
      .finally(() =>
        setLoadingButtons((prev) => ({ ...prev, [trainId]: false }))
      );
  };

  const initialValues = {
    from: "",
    to: "",
    travelType: "",
  };

  const transportSearchValidationSchema = Yup.object({
    from: Yup.string().required("* Source required"),
    to: Yup.string().required("* Destination required"),
    travelType: Yup.string()
      .oneOf(
        ["flight", "train", "bus", "car rental", "other"],
        "* Invalid selection"
      )
      .required("* Travel type required"),
  });

  useEffect(() => {
    dispatch(
      getFlightsSuggestions({
        source: trip.source,
        destination: trip.destination,
      })
    );
    dispatch(
      getTrainsSuggestions({
        source: trip.source,
        destination: trip.destination,
      })
    );

    dispatch(getAllTravelBookings(tripId));
  }, [dispatch, tripId, trip.source, trip.destination]);

  return (
    <>
      <div className="border p-2 rounded">
        <Formik
          initialValues={initialValues}
          validationSchema={transportSearchValidationSchema}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            if (values.travelType === "flight") {
              dispatch(
                getFlightsSuggestions({
                  source: values.from,
                  destination: values.to,
                })
              )
                .unwrap()
                .then(() => resetForm())
                .catch((err) => alert(JSON.stringify(err, null, 2)))
                .finally(() => setSubmitting(false));
            } else if (values.travelType === "train") {
              dispatch(
                getTrainsSuggestions({
                  source: values.from,
                  destination: values.to,
                })
              )
                .unwrap()
                .then(() => resetForm())
                .catch((err) => alert(JSON.stringify(err, null, 2)))
                .finally(() => setSubmitting(false));
            }
          }}
        >
          {(formik) => (
            <Form className="d-flex gap-2  ">
              <div className="col">
                <Field
                  type="search"
                  name="from"
                  className={`form-control ${
                    formik.touched.from
                      ? formik.errors.from
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  placeholder="From"
                />
                <ErrorMessage
                  className="text-danger"
                  name="from"
                  component={"div"}
                />
              </div>

              <div className="col">
                <Field
                  type="search"
                  name="to"
                  className={`form-control ${
                    formik.touched.to
                      ? formik.errors.to
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                  placeholder="To"
                />
                <ErrorMessage
                  className="text-danger"
                  name="to"
                  component={"div"}
                />
              </div>

              <div>
                <Field
                  as="select"
                  name="travelType"
                  className={`form-select ${
                    formik.touched.travelType
                      ? formik.errors.travelType
                        ? "is-invalid"
                        : "is-valid"
                      : ""
                  }`}
                >
                  <option value={""} disabled>
                    Select Travel Type
                  </option>
                  <option value={"flight"}>Flight</option>
                  <option value={"train"}>Train</option>
                  {/* <option value={"bus"} disabled>
                    Bus
                  </option>
                  <option value={"car rental"} disabled>
                    Car Rental
                  </option>
                  <option value={"other"} disabled>
                    Other
                  </option> */}
                </Field>
                <ErrorMessage
                  className="text-danger"
                  name="travelType"
                  component={"div"}
                />
              </div>
              <div>
                <button type="submit" className="btn btn-primary">
                  Search
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* transportation searches or suggestion */}

      {flightsSuggestionsState === "failed" && (
        <div className="text-center mt-2">
          <h5>Flights</h5>
          <i class="bi bi-airplane fs-3"></i>
          <h6>No Flights Available</h6>
        </div>
      )}

      {/* search loading */}
      {flightsSuggestionsState === "loading" && (
        <div className="container">
          <div className="row justify-content-center align-items-center mt-2">
            <div className="col text-center">
              <h6 className="mt-2">Loading...</h6>
            </div>
          </div>
        </div>
      )}

      {flightsSuggestionsState === "succeeded" && (
        <div className="table-responsive">
          <table class="table table-striped table-hover align-middle ">
            <caption className="caption-top">Available Flights</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">F.No.</th>
                <th scope="col">Airline</th>
                <th scope="col">Source</th>
                <th scope="col">Destination</th>
                <th scope="col">Dep.Time</th>
                <th scope="col">Arr.Time</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFlights?.map((flight, index) => (
                <tr key={flight._id}>
                  <td>{currentPage * itemsPerPage + index + 1}</td>
                  <td>{flight.flightNumber}</td>
                  <td>{flight.airline}</td>
                  <td>{flight.source}</td>
                  <td>{flight.destination}</td>
                  <td>
                    {new Date(flight.departureTime).toLocaleString("en-IN", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>
                    {" "}
                    {new Date(flight.arrivalTime).toLocaleString("en-IN", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>
                    <button
                      type="submit"
                      className="btn btn-outline-primary  rounded-pill"
                      disabled={flightBookingStatus === "loading"}
                      onClick={() => {
                        handleFlightBooking(flight);
                        dispatch(getAllTravelBookings(tripId));
                      }}
                    >
                      {loadingButtons[flight._id] === true ? (
                        <>
                          <span role="status">Booking...</span>
                        </>
                      ) : (
                        "Book"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <ReactPaginate
            previousLabel="previous"
            nextLabel="next"
            breakLabel="..."
            pageCount={Math.ceil(suggestedFlights.length / itemsPerPage)}
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
            onPageChange={handlePageClick}
          />
        </div>
      )}

      {trainsSuggestionsState === "failed" && (
        <div className="text-center mt-2">
          <h5>Trains</h5>
          <i class="bi bi-train-front fs-3"></i>
          <h6>No Trains Avialable</h6>
        </div>
      )}

      {trainsSuggestionsState === "loading" && (
        <div className="container">
          <div className="row justify-content-center align-items-center mt-2">
            <div className="col text-center">
              <h6 className="mt-2">Loading...</h6>
            </div>
          </div>
        </div>
      )}

      {trainsSuggestionsState === "succeeded" && (
        <div className="table-responsive">
          <table class="table table-striped">
            <caption className="caption-top">Available Trains</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">From</th>
                <th scope="col">To</th>
                <th scope="col">Dep.Time</th>
                <th scope="col">Arr.Time</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTrains?.map((train, index) => (
                <tr key={train._id}>
                  <td>{currentPageTains * trainsPerPage + index + 1}</td>
                  <td>{train.trainNumber}</td>
                  <td>{train.trainName}</td>
                  <td>{train.source}</td>
                  <td>{train.destination}</td>
                  <td>
                    {new Date(train.departureTime).toLocaleString("en-IN", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>
                    {new Date(train.arrivalTime).toLocaleString("en-IN", {
                      timeZone: "UTC",
                    })}
                  </td>
                  <td>
                    <button
                      type="submit"
                      className="btn btn-outline-primary  rounded-pill"
                      disabled={trainBookingStatus === "loading"}
                      onClick={() => {
                        handleTrainBooking(train);
                        dispatch(getAllTravelBookings(tripId)).unwrap();
                      }}
                    >
                      {loadingButtons[train._id] === true ? (
                        <>
                          <span role="status">Booking...</span>
                        </>
                      ) : (
                        "Book"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel="previous"
            nextLabel="next"
            breakLabel="..."
            pageCount={Math.ceil(suggestedTrains.length / trainsPerPage)}
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
            onPageChange={handlePageClickForTain}
          />
        </div>
      )}
    </>
  );
};

export default Transportation;