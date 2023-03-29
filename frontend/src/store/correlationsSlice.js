import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const fetchUserCorrelations = createAsyncThunk(
  "get user's correlations",
  async (_, { rejectWithValue }) => {
    try {
      const { data, status } = await apiClient.get("users/correlations/");

      console.log(status);

      if (!data.length) return rejectWithValue("No data found");

      return data;
    } catch (err) {
      console.log(err);
      if (err.status === 204) {
        return rejectWithValue("Not enough data");
      }
      return rejectWithValue("There was an issue getting your data");
    }
  }
);

export const correlationsSlice = createSlice({
  name: "correlations",
  initialState: {
    data: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCorrelations.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(fetchUserCorrelations.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const selectUserCorrelations = (state) => state.correlations.data;

export default correlationsSlice.reducer;
