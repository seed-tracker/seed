import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const getUserStats = createAsyncThunk("get user's history", async(days)=>{
  try{
    const {data} = await apiClient.get(`/stats?days=${days}`)
    return data
  } catch(err){
    console.log(err)
  }
})

export const statsSlice = createSlice({
  name: "stats",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserStats.fulfilled, (state,action) => {
        return action.payload;
      })
      .addCase(getUserStats.rejected, (state,action) =>{
        state.error = action.error;
      })
  }
});

export const selectUserStats = (state) => state.stats;

export default statsSlice.reducer;
