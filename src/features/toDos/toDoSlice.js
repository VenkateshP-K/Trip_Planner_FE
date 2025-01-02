import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { protectedInstance } from "../../../services/instance";

const initialState = {
  toDoStatus: "idle",
  allToDos: [],
  toDo: null,
  toDoError: null,
  allToDosStatus: "idle",
  allToDosError: null,
  toDoUpdateStatus: "idle",
  toDoUpdateError: null,

  // delete toDo
  toDoDeleteStatus: "idle",
  toDoDeleteError: null,

  // get toDo
  toDoGetStatus: "idle",
  toDoGetError: null,

  // edit toDo
  toDoEditStatus: "idle",
  toDoEditError: null,
};

// add toDo
export const addToDo = createAsyncThunk(
  "toDos/addToDo",
  async ({ tripId, toDo }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.post(
        `/users/trips/toDos/${tripId}`,
        toDo
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// get toDo

export const getToDoById = createAsyncThunk(
  "toDos/getToDoById",
  async (toDoId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(
        `/users/trips/toDos/${toDoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// get all toDos
export const getAllToDos = createAsyncThunk(
  "toDos/getAllToDos",
  async (tripId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.get(
        `/users/trips/toDos/all/${tripId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// update toDo status
export const updateToDoStatus = createAsyncThunk(
  "toDos/updateToDoStatus",
  async ({ toDoId, toDoStatus }, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.put(
        `/users/trips/toDos/update/status/${toDoId}`,
        toDoStatus
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// delete toDo
export const deleteToDo = createAsyncThunk(
  "toDos/deleteToDo",
  async (toDoId, { rejectWithValue }) => {
    try {
      const response = await protectedInstance.delete(
        `/users/trips/toDos/${toDoId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// edit toDo
export const editToDo = createAsyncThunk(
  "toDos/editToDo",
  async ( {toDoId, toDo} , {rejectWithValue}) => {
    try {
      const response = await protectedInstance.put(
        `/users/trips/toDos/edit/${toDoId}`,
        toDo
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const toDoSlice = createSlice({
  name: "toDos",
  initialState,
  reducers: {
    resetAddToDoState(state) {
      state.toDoStatus = "idle";
    },

    resetAllToDosStatus(state) {
      state.allToDosStatus = "idle";
    },

    resetToDoStatusUpdate(state) {
      state.toDoUpdateStatus = "idle";
      state.toDoUpdateError = null;
    },

    resetToDoDelete(state) {
      state.toDoDeleteStatus = "idle";
      state.toDoDeleteError = null;
    },
    resetToDoEdit(state){
      state.toDoEditStatus = "idle"
      state.toDoEditError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToDo.pending, (state, action) => {
        state.toDoStatus = "loading";
        state.toDoError = null;
      })
      .addCase(addToDo.fulfilled, (state, action) => {
        state.toDoStatus = "succeeded";
        state.toDo = action.payload;
        state.toDoError = null;
      })
      .addCase(addToDo.rejected, (state, action) => {
        state.toDoStatus = "failed";
        state.toDoError = action.payload;
      })
      .addCase(getAllToDos.pending, (state) => {
        state.allToDosStatus = "loading";
        state.allToDosError = null;
      })
      .addCase(getAllToDos.fulfilled, (state, action) => {
        state.allToDosStatus = "succeeded";
        state.allToDos = action.payload;
        state.allToDosError = null;
      })
      .addCase(getAllToDos.rejected, (state, action) => {
        state.allToDosStatus = "failed";
        state.allToDosError = action.payload;
      })
      .addCase(updateToDoStatus.pending, (state) => {
        state.toDoUpdateStatus = "loading";
        state.toDoUpdateError = null;
      })
      .addCase(updateToDoStatus.fulfilled, (state, action) => {
        (state.toDoUpdateStatus = "succeeded"), (state.toDoUpdateError = null);
      })
      .addCase(updateToDoStatus.rejected, (state, action) => {
        state.toDoUpdateStatus = "failed";
        state.toDoUpdateError = action.payload;
      })
      .addCase(deleteToDo.pending, (state) => {
        state.toDoDeleteStatus = "loading";
        state.toDoDeleteError = null;
      })
      .addCase(deleteToDo.fulfilled, (state) => {
        state.toDoDeleteStatus = "succeeded";
        state.toDoDeleteError = null;
        state.toDo = null;
      })
      .addCase(deleteToDo.rejected, (state, action) => {
        state.toDoDeleteStatus = "failed";
        state.toDoDeleteError = action.payload;
      })
      .addCase(getToDoById.pending, (state) => {
        state.toDoGetStatus = "loading";
        state.toDoGetError = null;
      })
      .addCase(getToDoById.fulfilled, (state, action) => {
        state.toDoGetStatus = "succeeded";
        state.toDo = action.payload;
      })
      .addCase(getToDoById.rejected, (state, action) => {
        state.toDoGetStatus = "failed";
        state.toDoGetError = action.payload;
      })
      .addCase(editToDo.pending, (state) => {
        state.toDoEditStatus = "loading";
        state.toDoEditError = null;
      })
      .addCase(editToDo.fulfilled, (state, action) => {
        state.toDoEditStatus = "succeeded";
        state.toDo = action.payload;
        state.toDoEditError = null;
      })
      .addCase(editToDo.rejected, (state, action) => {
        state.toDoEditStatus = "failed";
        state.toDoEditError = action.payload;
      });
  },
});

export default toDoSlice.reducer;

// export actions

export const {
  resetAddToDoState,
  resetAllToDosStatus,
  resetToDoStatusUpdate,
  resetToDoDelete,
  resetToDoEdit
} = toDoSlice.actions;

// selectors for add toDo

export const selectToDoStatus = (state) => state.toDos.toDoStatus;
export const selectToDoError = (state) => state.toDos.toDoError;
export const selectToDo = (state) => state.toDos.toDo;

// update toDo status
export const selectToDoUpdateStatus = (state) => state.toDos.toDoUpdateStatus;
export const selectToDoUpdateError = (state) => state.toDos.toDoUpdateError;

// for all todos
export const selectAllToDosStatus = (state) => state.toDos.allToDosStatus;
export const selectAllToDos = (state) => state.toDos.allToDos;
export const selectAllToDosError = (state) => state.toDos.allToDosError;

export const selectToDoDeleteStatus = (state) => state.toDos.toDoDeleteStatus;
export const selectToDoDeleteError = (state) => state.toDos.toDoDeleteError;

// for get toDo
export const selectToDoGetState = (state) => state.toDos.toDoGetStatus;
export const selectToDoGetError = (state) => state.toDos.toDoGetError;

// edit toDo
export const selectToDoEditStatus = (state) => state.toDos.toDoEditStatus;
export const selectToDOEditError = (state) => state.toDos.toDoEditError;
