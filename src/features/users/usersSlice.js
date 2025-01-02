import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { instance, protectedInstance } from "../../../services/instance";

const initialState = {
  // user
  user: null,

  // userId
  userId: null,

  // user register
  userRegisterStatus: "idle",
  userRegisterError: null,

  // test
  status: "idle",
  error: null,
  message: null,

  // user login status
  userLoginStatus: "idle",
  userLoginError: null,


  // user forgot password
  userPasswordResetStatus: "idle",
  userPasswordResetError: null,
};

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await instance.post("/users/register", userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message);
    }
  }
);

export const userLogin = createAsyncThunk(
  "users/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await instance.post("/users/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const getUser = createAsyncThunk(
  "users/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get("/users/me");
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error for getting user"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      await protectedInstance.get("users/logout");
      return "Logout successful";
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearMessage(state) {
      state.message = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, action) => {
        state.userRegisterStatus = "loading";
        state.userRegisterError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userRegisterStatus = "succeeded";
        state.userRegisterError = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.userRegisterStatus = "failed";
        state.userRegisterError = action.payload;
      })
      .addCase(userLogin.pending, (state, action) => {
        state.userLoginStatus = "loading";
        state.userLoginError = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        if (action.payload.userId) {
          state.userId = action.payload.userId;
        } else {
          state.userLoginStatus = "succeeded";
          state.user = action.payload;
          state.userLoginError = null;
        }
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.userLoginStatus = "failed";
        state.userLoginError = action.payload;
      })
      .addCase(getUser.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logoutUser.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = null;
        state.message = action.payload;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
  },
});

export default userSlice.reducer;
export const { clearMessage, resetPasswordSet } = userSlice.actions;

export const selectUserStatus = (state) => state.users.status;
export const selectUserError = (state) => state.users.error;
export const selectUser = (state) => state.users.user;
export const selectUserMessage = (state) => state.users.message;

// user register selector
export const selectUserRegisterStatus = (state) =>
  state.users.userRegisterStatus;
export const selectUserRegisterError = (state) => state.users.userRegisterError;

// user login selector
export const selectUserLoginStatus = (state) => state.users.userLoginStatus;
export const selectUserLoginError = (state) => state.users.userLoginError;

// user id
export const selectUserId = (state) => state.users.userId;