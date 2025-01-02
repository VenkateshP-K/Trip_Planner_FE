import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { protectedInstance } from "../../../services/instance";

const initialState = {
  // filghts suggestions
  flightsSuggestionState: "idle",
  suggestedFlights: null,
  flightsSuggestionError: null,

  //

  // book flight
  flightBookingStatus: "idle",
  flightBookingError: null,
  flight: null,

  // book train
  trainBookingStatus: "idle",
  trainBookingError: null,
  train: null,

  //  train suggestions
  trainsSuggestionState: "idle",
  suggestedTrains: null,
  trainsSuggestionError: null,

  // get all travel bookings
  allTravelBookingStatus: "idle",
  allTravelBooking: null,
  allTravelBookingError: null,

  // delete travel booking
  travelBookingCancelStatus: "idle",
  travelBookingCancelError: null,
};

export const getFlightsSuggestions = createAsyncThunk(
  "transportations/getFlightsSuggestions",
  async ({ source, destination }, { rejectWithValue }) => {
    try {
      if (!source) {
        source = "_";
      }
      const response = await protectedInstance.get(
        `/users/trips/flights/search?source=${source}&destination=${destination}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getTrainsSuggestions = createAsyncThunk(
  "transportations/getTrainsSuggestions",
  async ({ source, destination }, { rejectWithValue }) => {
    try {
      if (!source) {
        source = "_";
      }
      const response = await protectedInstance.get(
        `/users/trips/trains/search?source=${source}&destination=${destination}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const bookFlight = createAsyncThunk(
  "transportation/bookFlight",
  async ({ tripId, flightBookingData }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.put(
        `/users/trips/travels/booking/${tripId}`,
        flightBookingData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// book train
export const bookTrain = createAsyncThunk(
  "transportations/bookTrain",
  async ({ tripId, trainBookingData }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.put(
        `/users/trips/travels/booking/${tripId}`,
        trainBookingData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getAllTravelBookings = createAsyncThunk(
  "transportations/getAllTravelBookings",
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(
        `/users/travels/booking/all/${tripId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const cancelTravelBooking = createAsyncThunk(
  "transportation/cancelTravelBooking",
  async (bookingId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.delete(
        `/users/travels/booking/${bookingId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const transportationSlice = createSlice({
  name: "transportations",
  initialState,
  reducers: {
    resetFlightBooking(state) {
      state.flightBookingStatus = "idle";
      state.flightBookingError = null;
    },
    resetGetAllTravelBookings(state) {
      state.allTravelBookingStatus = "idle";
      state.allTravelBookingError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFlightsSuggestions.pending, (state) => {
        state.flightsSuggestionState = "loading";
        state.flightsSuggestionError = null;
      })
      .addCase(getFlightsSuggestions.fulfilled, (state, action) => {
        state.flightsSuggestionState = "succeeded";
        state.flightsSuggestionError = null;
        state.suggestedFlights = action.payload;
      })
      .addCase(getFlightsSuggestions.rejected, (state, action) => {
        state.flightsSuggestionState = "failed";
        state.flightsSuggestionError = action.payload;
      })
      .addCase(bookFlight.pending, (state) => {
        state.flightBookingStatus = "loading";
        state.flightBookingError = null;
      })
      .addCase(bookFlight.fulfilled, (state, action) => {
        state.flightBookingStatus = "succeeded";
        state.flight = action.payload;
        state.flightBookingError = null;
      })
      .addCase(bookFlight.rejected, (state, action) => {
        state.flightBookingStatus = "failed";
        state.flightBookingError = action.payload;
      })
      .addCase(getAllTravelBookings.pending, (state) => {
        (state.allTravelBookingStatus = "loading"),
          (state.allTravelBookingError = null);
      })
      .addCase(getAllTravelBookings.fulfilled, (state, action) => {
        const result = action.payload;

        const flightsBooked = [];
        const trainsBooked = [];
        const carsBooked = [];

        if (result.length > 0) {
          result.forEach((booking) => {
            if (booking["travelType"] === "flight") {
              flightsBooked.push(booking);
            } else if (booking["travelType"] === "train") {
              trainsBooked.push(booking);
            } else if (booking["travelType"] === "car rental") {
              carsBooked.push(booking);
            }
          });
        }

        const bookings = { flightsBooked, trainsBooked, carsBooked };

        state.allTravelBooking = bookings;
        state.allTravelBookingError = null;
        state.allTravelBookingStatus = "succeeded";
      })
      .addCase(getAllTravelBookings.rejected, (state, action) => {
        state.allTravelBookingStatus = "failed";
        state.allTravelBookingError = action.payload;
      })
      .addCase(cancelTravelBooking.pending, (state) => {
        state.travelBookingCancelStatus = "loading";
        state.travelBookingCancelError = null;
      })
      .addCase(cancelTravelBooking.fulfilled, (state, action) => {
        state.travelBookingCancelStatus = "succeeded";
        state.travelBookingCancelError = null;
      })
      .addCase(cancelTravelBooking.rejected, (state, action) => {
        state.travelBookingCancelStatus = "failed";
        state.travelBookingCancelError = action.payload;
      })
      .addCase(getTrainsSuggestions.pending, (state) => {
        state.trainsSuggestionState = "loading";
        state.trainsSuggestionState = null;
      })
      .addCase(getTrainsSuggestions.fulfilled, (state, action) => {
        state.trainsSuggestionState = "succeeded";
        state.suggestedTrains = action.payload;
        state.trainsSuggestionError = null;
      })
      .addCase(getTrainsSuggestions.rejected, (state, action) => {
        state.trainsSuggestionState = "failed";
        state.trainsSuggestionError = action.payload;
      })
      .addCase(bookTrain.pending, (state) => {
        state.trainBookingStatus = "loading";
        state.trainBookingError = null;
      })
      .addCase(bookTrain.fulfilled, (state, action) => {
        state.trainBookingStatus = "succeeded";
        state.trainBookingError = null;
        state.train = action.payload;
      })
      .addCase(bookTrain.rejected, (state, action) => {
        state.trainBookingStatus = "failed";
        state.trainBookingError = action.payload;
      });
  },
});

export default transportationSlice.reducer;

export const { resetFlightBooking, resetGetAllTravelBookings } =
  transportationSlice.actions;

// flight suggestions selectors
export const selectFlightsSuggestionState = (state) =>
  state.transportations.flightsSuggestionState;
export const selectFlightsSuggestionError = (state) =>
  state.transportations.flightsSuggestionError;

// flights suggestions
export const selectSuggestedFlights = (state) =>
  state.transportations.suggestedFlights;

// flight booking
export const selectBookedFlight = (state) => state.transportations.flight;
export const selectFlightBookingStatus = (state) =>
  state.transportations.flightBookingStatus;
export const selectFlightBookingError = (state) =>
  state.transportations.flightBookingError;

// get all travel booking selectors
export const selectAllTravelBookingStatus = (state) =>
  state.transportations.allTravelBookingStatus;
export const selectAllTravelBookingError = (state) =>
  state.transportations.allTravelBookingError;
export const selectAllTravelBooking = (state) =>
  state.transportations.allTravelBooking;

// cancel travel booking
export const selectTravelBookingCancelStatus = (state) =>
  state.transportations.travelBookingCancelStatus;
export const selectTravelBookingCancelError = (state) =>
  state.transportations.travelBookingCancelError;

// get trains suggestions selectors
export const selectSuggestTrains = (state) =>
  state.transportations.suggestedTrains;
export const selectTrainsSuggestionState = (state) =>
  state.transportations.trainsSuggestionState;
export const selectTrainsSuggestionError = (state) =>
  state.transportations.trainsSuggestionError;

// train booking selectors
export const selectTrainBookingStatus = (state) =>
  state.transportations.trainBookingStatus;
export const selectTrainBookingError = (state) =>
  state.transportations.trainBookingError;
export const selectTrain = (state) => state.transportations.train;