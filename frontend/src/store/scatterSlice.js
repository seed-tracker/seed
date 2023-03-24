import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const fetchScatterData = createAsyncThunk(
  "correlations/fetchScatterData",
  async (months) => {
    try {
      months = months || 12;
      const { error, data } = await apiClient.get(
        `stats/monthly?months=${months}`
      );

      if (error) throw new Error(error);

      return data;
    } catch (err) {
      console.error(err);
    }
  }
);

const scatterSlice = createSlice({
  name: "entry",
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(fetchScatterData.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default scatterSlice.reducer;
