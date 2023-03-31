import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../client";

export const fetchAllFoodGroups = createAsyncThunk(
  "foodGroups/fetch",
  async () => {
    try {
      const { data } = await apiClient.get("groups/");
      return data;
    } catch (err) {
      console.debug(err);
    }
  }
);

export const foodGroupsSlice = createSlice({
  name: "foodGroups",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFoodGroups.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(fetchAllFoodGroups.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

export const selectFoodGroups = (state) => {
  return state.foodGroups;
};

export default foodGroupsSlice.reducer;
