import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ReactPaginate from "react-paginate";
import axios from "axios";
import tripServices from "../services/tripServices";
import userServices from "../services/userServices";

const Transportation = ({ trip, setTrip }) => {
  const tripId = trip._id;
  const itemsPerPage = 5;

  const [flights, setFlights] = useState([]);
  const [trains, setTrains] = useState([]);
  const [flightsState, setFlightsState] = useState("idle"); // "idle" | "loading" | "succeeded" | "failed"
  const [trainsState, setTrainsState] = useState("idle");
  const [flightBookingState, setFlightBookingState] = useState({});
  const [trainBookingState, setTrainBookingState] = useState({});
  const [currentPageFlights, setCurrentPageFlights] = useState(0);
  const [currentPageTrains, setCurrentPageTrains] = useState(0);


  const paginatedFlights = (flights || []).slice(
    currentPageFlights * itemsPerPage,
    (currentPageFlights + 1) * itemsPerPage
  );

  const paginatedTrains = (trains || []).slice(
    currentPageTrains * itemsPerPage,
    (currentPageTrains + 1) * itemsPerPage
  );

  const handlePageClickFlights = (data) => {
    setCurrentPageFlights(data.selected);
  };

  const handlePageClickTrains = (data) => {
    setCurrentPageTrains(data.selected);
  };

  const fetchFlights = async (source, destination) => {
    try {
      setFlightsState("loading");
      console.log("Calling API with source:", source, "destination:", destination);
      const data = await tripServices.getFlightBtnStations(source.toLowerCase(), destination.toLowerCase());
      console.log("API Response Data:", data);
      setFlights(data || []);
      setFlightsState("succeeded");
    } catch (error) {
      console.error("Error fetching flights:", error.response?.data || error.message);
      setFlightsState("failed");
    }
  };

  const fetchTrains = async (source, destination) => {
    try {
      setTrainsState("loading");
      console.log("Calling API with source:", source, "destination:", destination);
      const data = await tripServices.getTrainBtnStations(source.toLowerCase(), destination.toLowerCase());
      console.log("API Response Data:", data);
      setTrains(data || []);
      setTrainsState("succeeded");
    } catch (error) {
      console.error("Error fetching trains:", error.response?.data || error.message);
      setTrainsState("failed");
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await userServices.me
      return response.data; // Return user data
    } catch (error) {
      console.error("Error fetching user details:", error.response?.data || error.message);
      return null; // Handle missing user gracefully
    }
  };

  const handleFlightBooking = async (flight) => {
    try {
      if (!trip.user) {
        throw new Error("User information is missing in the trip object.");
      }

      setFlightBookingState((prev) => ({ ...prev, [flight._id]: "loading" }));
      const bookingData = {
        name: `${trip.tripName}`,
        travelType: "flight",
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        source: flight.source,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
      };

      await tripServices.bookTravel(tripId, bookingData);
      alert("Flight booked successfully!");
      setFlightBookingState((prev) => ({ ...prev, [flight._id]: "succeeded" }));
    } catch (error) {
      console.error("Error booking flight:", error.message);
      alert("Error booking flight");
      setFlightBookingState((prev) => ({ ...prev, [flight._id]: "failed" }));
    }
  };

  const handleTrainBooking = async (train) => {
    try {
      setTrainBookingState((prev) => ({ ...prev, [train._id]: "loading" }));
      const bookingData = {
        name: `${trip.tripName}`,
        travelType: "train",
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        source: train.source,
        destination: train.destination,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
      };

      await tripServices.bookTravel(tripId, bookingData);
      alert("Train booked successfully!");
      setTrainBookingState((prev) => ({ ...prev, [train._id]: "succeeded" }));
    } catch (error) {
      console.error("Error booking train:", error.response?.data || error.message);
      alert("Error booking train");
      setTrainBookingState((prev) => ({ ...prev, [train._id]: "failed" }));
    }
  };

  const initialValues = {
    from: trip.source || " ",
    to: trip.destination || " ",
    travelType: "",
  };

  const transportSearchValidationSchema = Yup.object({
    from: Yup.string().required("* Source required"),
    to: Yup.string().required("* Destination required"),
    travelType: Yup.string()
      .oneOf(["flight", "train"], "* Invalid selection")
      .required("* Travel type required"),
  });

  const handleSearch = (values) => {
    if (!values.from || !values.to) {
      alert("Please enter valid source and destination!");
      return;
    }

    if (values.travelType === "flight") {
      fetchFlights(values.from, values.to);
    } else if (values.travelType === "train") {
      fetchTrains(values.from, values.to);
    }
  };

  // Fetch initial suggestions for flights and trains
  useEffect(() => {
    const fetchTransportationData = async () => {
      try {
        if (trip?.source && trip?.destination) {
          const flightData = await fetchFlights(trip.source, trip.destination);
          const trainData = await fetchTrains(trip.source, trip.destination);

          setFlights(flightData || []);
          setTrains(trainData || []);
        }
      } catch (error) {
        console.error("Error fetching transportation data:", error);
      }
    };

    fetchTransportationData();
  }, [trip]);

  useEffect(() => {
    const initializeTripUser = async () => {
      if (trip.userId) {
        const user = await fetchUserDetails(trip.userId);
        setTrip((prevTrip) => ({ ...prevTrip, user }));
      }
    };

    initializeTripUser();
  }, [trip.userId]);

  return (
    <div><div className="border p-2 rounded">
    <Formik
      initialValues={initialValues}
      validationSchema={transportSearchValidationSchema}
      onSubmit={handleSearch}
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


      {/* Flights Section */}
      {flightsState === "loading" && <p>Loading flights...</p>}
      {flightsState === "failed" && <p>No Flights found for this trip</p>}
      {flightsState === "succeeded" && (
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
              {flights?.map((flight, index) => (
                <tr key={flight._id}>
                  <th scope="row">{index + 1}</th>
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
                      onClick={() => {
                        handleFlightBooking(flight);
                      }}
                    >
                      {
                        "Book"
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Trains Section */}
      {trainsState === "loading" && <p>Loading trains...</p>}
      {trainsState === "failed" && <p>No Trains Found For This trip</p>}
      {trainsState === "succeeded" && (
        <div className="table-responsive">
          <table class="table table-striped">
            <caption className="caption-top">Available Trains</caption>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">T.No.</th>
                <th scope="col">Name</th>
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
                  <th scope="row">{index + 1}</th>
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
                      onClick={() => {
                        handleTrainBooking(train);
                      }}
                    >
                      {
                        "Book"
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
    </div>
      )}
    </div>
  );
};

export default Transportation;