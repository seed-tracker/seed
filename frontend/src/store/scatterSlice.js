import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../client";

export const fetchScatterData = createAsyncThunk(
  "correlations/fetchScatterData",
  async (months) => {
    try {
      months = months || 12;
      const { error, data } = await apiClient.get(
        `stats/monthly?months=${months}`
      );

      if (error) throw new Error(error);

      return { data: data.data, maxMonths: data.max_months };
    } catch (err) {
      console.debug(err);
    }
  }
);

const scatterSlice = createSlice({
  name: "entry",
  initialState: {
    data: null,
    maxMonths: null,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchScatterData.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default scatterSlice.reducer;
