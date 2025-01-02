import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedInstance } from "../../../services/instance";

const initialState = {
  trips: null,
  trip: null,
  status: "idle",
  error: null,

  // trip delete
  tripDeleteStatus: "idle",
  tripDeleteError: null,

  // trip update
  tripUpdateStatus: "idle",
  tripUpdateError: null,
};

// create trip
export const createTrip = createAsyncThunk(
  "trips/createTrip",
  async (tripData, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.post("/users/trips/addTrip", tripData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// get specific trip
export const getTripById = createAsyncThunk(
  "trips/getTripById",
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(`/users/trips/${tripId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// get all trips for the user
export const getAllTripsByUser = createAsyncThunk(
  "trips/getAllTripsByUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get("/users/allTrips");

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

// search trips for the user who created
export const searchTrips = createAsyncThunk(
  "trips/searchTrips",
  async (tripQuery, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(
        `/users/trips/search?trip=${tripQuery}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// delete Trip
export const deleteTripById = createAsyncThunk(
  "trips/deleteTripById",
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.delete(`/users/trips/${tripId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// update trip
export const updateTripById = createAsyncThunk(
  "trips/updateTripById",
  async ({ tripId, tripData }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.put(
        `/users/trips/edit/${tripId}`,
        tripData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const tripSlice = createSlice({
  name: "trips",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTrip.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trips = action.payload;
        state.error = null;
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllTripsByUser.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllTripsByUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trips = action.payload;
        state.error = null;
      })
      .addCase(getAllTripsByUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getTripById.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getTripById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.trip = action.payload;
        state.error = null;
      })
      .addCase(getTripById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteTripById.pending, (state) => {
        state.tripDeleteStatus = "loading";
      })
      .addCase(deleteTripById.fulfilled, (state) => {
        state.tripDeleteStatus = "succeeded";
        state.tripDeleteError = null;
      })
      .addCase(deleteTripById.rejected, (state, action) => {
        state.tripDeleteStatus = "failed";
        state.tripDeleteError = action.payload;
      })
      .addCase(updateTripById.pending, (state) => {
        state.tripUpdateStatus = "loading";
        state.tripUpdateError = null;
      })
      .addCase(updateTripById.fulfilled, (state) => {
        state.tripUpdateStatus = "succeeded";
        state.tripUpdateError = null;
      })
      .addCase(updateTripById.rejected, (state, action) => {
        state.tripUpdateStatus = "failed";
        state.tripUpdateError = action.payload;
      })
      .addCase(searchTrips.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchTrips.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
        state.trips = action.payload;
      })
      .addCase(searchTrips.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default tripSlice.reducer;

export const selectTripStatus = (state) => state.trips.status;
export const selectTrips = (state) => state.trips.trips;
export const selectTripError = (state) => state.trips.error;
export const selectTrip = (state) => state.trips.trip;

// trip delete selectors
export const selectTripDeleteStatus = (state) => state.trips.tripDeleteStatus;
export const selectrTripDeleteError = (state) => state.trips.tripDeleteError;

// trip update selectors
export const selectTripUpdateStatus = (state) => state.trips.tripUpdateStatus;
export const selectTripUpdateError = (state) => state.trips.tripUpdateError;