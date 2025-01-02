import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedInstance } from "../../../services/instance";

const initialState = {
  // accommodation search or suggestion
  accommodationSearch: null,
  accommodationSearchStatus: "idle",
  accommodationSearchError: null,

  // accommodation booking
  accommodationBookingStatus: "idle",
  accommodationBookingError: null,

  // booked accommodations
  bookedAccommodations: null,
  gettingAllBookedAccommodationsStatus: "idle",
  gettingAllBookedAccommodationsError: null,

  // delete booked accommodation
  accommodationDeleteStatus: "idle",
  accommodationDeleteError: null,
};

// search accommodation
export const searchAccommodation = createAsyncThunk(
  "accommodations/searchAccommodation",
  async (location, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(
        `/users/trips/accommodations/search?location=${location}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// book accommodation
export const bookAccommodation = createAsyncThunk(
  "accommodations/bookAccommodation",
  async ({ tripId, accommodationData }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.put(
        `/users/trips/accommodations/booking/${tripId}`,
        accommodationData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// get all booked accommodations
export const getAllBookedAccommodations = createAsyncThunk(
  "accommodations/getAllBookedAccommodations",
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(
        `/users/trips/accommodations/booked/${tripId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// delete accommodation by id
export const deleteBookedAccommodation = createAsyncThunk(
  "accommodations/deleteBookedAccommodation",
  async (accommodationId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.delete(
        `/users/accommodations/booking/${accommodationId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const accommodationSlice = createSlice({
  name: "accommodations",
  initialState,
  reducers: {
    resetAccommodationSearch(state) {
      state.accommodationSearchStatus = "idle";
      state.accommodationSearchError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchAccommodation.pending, (state) => {
        state.accommodationSearchStatus = "loading";
        state.accommodationSearchError = null;
      })
      .addCase(searchAccommodation.fulfilled, (state, action) => {
        state.accommodationSearchStatus = "succeeded";
        (state.accommodationSearchError = null),
          (state.accommodationSearch = action.payload);
      })
      .addCase(searchAccommodation.rejected, (state, action) => {
        state.accommodationSearchStatus = "failed";
        state.accommodationSearchError = action.payload;
      })
      .addCase(bookAccommodation.pending, (state) => {
        state.accommodationBookingStatus = "loading";
        state.accommodationBookingError = null;
      })
      .addCase(bookAccommodation.fulfilled, (state, action) => {
        state.accommodationBookingStatus = "succeeded";
        state.accommodationBookingError = null;
      })
      .addCase(bookAccommodation.rejected, (state, action) => {
        state.accommodationBookingStatus = "failed";
        state.accommodationBookingError = action.payload;
      })
      .addCase(getAllBookedAccommodations.pending, (state) => {
        state.gettingAllBookedAccommodationsStatus = "loading";
        state.gettingAllBookedAccommodationsError = null;
      })
      .addCase(getAllBookedAccommodations.fulfilled, (state, action) => {
        state.gettingAllBookedAccommodationsStatus = "succeeded";
        state.gettingAllBookedAccommodationsError = null;
        state.bookedAccommodations = action.payload;
      })
      .addCase(getAllBookedAccommodations.rejected, (state, action) => {
        state.gettingAllBookedAccommodationsStatus = "failed";
        state.gettingAllBookedAccommodationsError = action.payload;
      })
      .addCase(deleteBookedAccommodation.pending, (state) => {
        state.accommodationBookingStatus = "loading";
        state.accommodationBookingError = null;
      })
      .addCase(deleteBookedAccommodation.fulfilled, (state) => {
        state.accommodationBookingStatus = "succeeded";
        state.accommodationBookingError = null;
      })
      .addCase(deleteBookedAccommodation.rejected, (state, action) => {
        state.accommodationBookingStatus = "failed";
        state.accommodationBookingError = action.payload;
      });
  },
});

export default accommodationSlice.reducer;

// accommodations search selectors
export const selectAccommodationSearchStatus = (state) =>
  state.accommodations.accommodationSearchStatus;
export const selectAccommodationSearchError = (state) =>
  state.accommodations.accommodationSearchError;
export const selectAccommodationSearch = (state) =>
  state.accommodations.accommodationSearch;

// accommodation booking
export const selectAccommodationBookingStatus = (state) =>
  state.accommodations.accommodationBookingStatus;
export const selectAccommodationBookingError = (state) =>
  state.accommodations.selectAccommodationBookingError;

// getting all booked accommodations
export const selectAllBookedAccommodations = (state) =>
  state.accommodations.bookedAccommodations;
export const selectGettingAllBookedAccommodationsStatus = (state) =>
  state.accommodations.gettingAllBookedAccommodationsStatus;
export const selectGettingAllBookedAccommodationsError = (state) =>
  state.accommodations.gettingAllBookedAccommodationsError;

// delete booked accommodations
export const selectAccommodationDeleteStatus = (state) =>
  state.accommodations.accommodationBookingStatus;
export const selectAccommodationDeleteError = (state) =>
  state.accommodationDeleteError;
