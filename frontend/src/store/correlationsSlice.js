import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";


export const fetchUserCorrelations = createAsyncThunk("get user's correlations", async () => {
  try {
    const {data} = await apiClient.get("users/correlations/")
    return data
  } catch(err) {
    console.log(err);
  }
});

export const getUserStats = createAsyncThunk("get user's history", async(days)=>{
  try{
    const {data} = await apiClient.get(`/stats?days=${days}`)
    return data
  } catch(err){
    console.log(err)
  }
})



export const correlationsSlice = createSlice({
  name: "correlations",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserCorrelations.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchUserCorrelations.rejected, (state, action) => {
        state.error = action.error;
      })
      .addCase(getUserStats.fulfilled, (state,action) => {
        return action.payload;
      })
      .addCase(getUserStats.rejected, (state,action) =>{
        state.error = action.error;
      })
  }
});

export const selectUserCorrelations = (state) => state.correlations;

export default correlationsSlice.reducer;
