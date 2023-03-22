import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserCorrelations = createAsyncThunk("get user's correlations", async (username) => {
  try {
    const {data} = await axios.get(`http://localhost:5000/${username}/correlations`)
    return data
  } catch(err) {
    console.log(err);
  }
})

export const correlationsSlice = createSlice({
  name: "correlations",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCorrelations.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchUserCorrelations.rejected, (state, action) => {
        state.error = action.error;
      })
  }
})

export const selectUserCorrelations = (state) => state.correlations

export default correlationsSlice.reducer