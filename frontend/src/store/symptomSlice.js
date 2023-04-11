import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../client";

export const fetchAllSymptoms = createAsyncThunk(
  "get/allSymptoms",
  async () => {
    try {
      const { data } = await apiClient.get("symptoms/");
      return data;
    } catch (err) {
      console.debug(err);
    }
  }
);

export const symptomSlice = createSlice({
  name: "symptoms",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllSymptoms.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSymptoms = (state) => {
  return state.symptoms;
};

export default symptomSlice.reducer;
