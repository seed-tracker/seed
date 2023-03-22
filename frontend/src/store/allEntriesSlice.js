import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllMealEntries = createAsyncThunk(
  "user/fetchMeals",
  async (page) => {
    const token = window.localStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `http://localhost:5000/meals/user?page=${page}`,
        {
          headers: {
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

export const fetchAllSymptomEntries = createAsyncThunk(
  "user/fetchSymptoms",
  async (page) => {
    const token = window.localStorage.getItem("token");
    try {
      const { data } = await axios.get(
        `http://localhost:5000/symptoms/user?page=${page}`,
        {
          headers: {
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

const allEntriesSlice = createSlice({
  name: "entry",
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

export default allEntriesSlice.reducer;
