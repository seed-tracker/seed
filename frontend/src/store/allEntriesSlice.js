import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../client";

export const fetchAllMealEntries = createAsyncThunk(
  "user/fetchMeals",
  async (page, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`meals/user?page=${page}`);
      if (!data.meals || !data.meals.length)
        return rejectWithValue("No meals found");

      return data;
    } catch (err) {
      return rejectWithValue("An error occurred");
    }
  }
);

export const fetchAllSymptomEntries = createAsyncThunk(
  "user/fetchSymptoms",
  async (page, { rejectWithValue }) => {
    try {
      const { data } = await apiClient.get(`user/symptoms?page=${page}`);
      if (!data.symptoms || !data.symptoms.length)
        return rejectWithValue("No symptoms found");

      return data;
    } catch (err) {
      return rejectWithValue("An error occurred");
    }
  }
);

export const deleteSymptomEntry = createAsyncThunk(
  "user/deleteSymptom",
  async (symptomId) => {
    try {
      const token = window.localStorage.getItem("token");
      const { data } = await apiClient.delete(
        `user/symptoms/delete/${symptomId}`,
        {
          data: {
            authorization: token,
          },
        }
      );
      return data;
    } catch (err) {
      console.debug(err);
    }
  }
);

export const deleteMealEntry = createAsyncThunk(
  "user/deleteMeal",
  async (mealId) => {
    try {
      const token = window.localStorage.getItem("token");
      const { data } = await apiClient.delete(`meals/user/delete/${mealId}`, {
        data: {
          authorization: token,
        },
      });
      return data;
    } catch (err) {
      console.debug(err);
    }
  }
);

const allEntriesSlice = createSlice({
  name: "allEntries",
  initialState: {
    mealEntries: {
      mealCount: 0,
      meals: [],
    },
    symptomEntries: {
      symptomCount: 0,
      symptoms: [],
    },
    error: null,
  },
  reducers: {
    resetError(state, action) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllMealEntries.fulfilled, (state, action) => {
      state.mealEntries.mealCount = action.payload.count;
      state.mealEntries.meals = action.payload.meals;
    });
    builder.addCase(fetchAllSymptomEntries.fulfilled, (state, action) => {
      state.symptomEntries.symptomCount = action.payload.count;
      state.symptomEntries.symptoms = action.payload.symptoms;
    });
    builder.addCase(fetchAllSymptomEntries.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(fetchAllMealEntries.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

export const selectAllMeals = (state) => state.allEntries.mealEntries;
export const selectAllSymptoms = (state) => state.allEntries.symptomEntries;

export const { resetError } = allEntriesSlice.actions;

export default allEntriesSlice.reducer;
