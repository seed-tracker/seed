import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const fetchAllFoodGroups = createAsyncThunk(
  "get/allFoodGroups",
  async () => {
    try {
      const { data } = await apiClient.get("groups/");
      return data;
    } catch (err) {
      console.log(err);
    }
  }
)

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
    })
  },
});

export const selectFoodGroups = (state) => {
  return state.foodGroups;
};

export default foodGroupsSlice.reducer;