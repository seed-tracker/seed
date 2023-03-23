import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const addSymptomEntry = createAsyncThunk(
  "symptom/add",
  async (symptomEntry) => {
    try {
      const { data } = await apiClient.post(`user/symptoms/`, symptomEntry);
      return data;
    } catch (err) {
      console.error(err);
    }
  }
);

export const symptomSlice = createSlice({
  name: "symptoms",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(addSymptomEntry.fulfilled, (state, action) => {
      state.push(action.payload);
    });
  },
});

export const selectSymptoms = (state) => {
  return state.symptoms;
};

export default symptomSlice.reducer;
