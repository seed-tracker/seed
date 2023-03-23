import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const fetchAllMealEntries = createAsyncThunk(
  "user/fetchMeals",
  async (page) => {
    try {
      const { data } = await apiClient.get(`meals/user?page=${page}`);
      return data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const fetchAllSymptomEntries = createAsyncThunk(
  "user/fetchSymptoms",
  async (page) => {
    try {
      const { data } = await apiClient.get(`user/symptoms?page=${page}`);
      return data;
    } catch (err) {
      console.error(err);
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
      console.error(err);
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
      console.error(err);
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
  },
});

export const selectAllMeals = (state) => state.allEntries.mealEntries;
export const selectAllSymptoms = (state) => state.allEntries.symptomEntries;

export default allEntriesSlice.reducer;
