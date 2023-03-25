import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const fetchAllSymptoms = createAsyncThunk(
  "get/allSymptoms",
  async () => {
    try {
      const { data } = await apiClient.get("symptoms/");
      return data;
    } catch (err) {
      console.log(err);
    }
  }
)

export const addSymptomEntry = createAsyncThunk(
  "symptom/add",
  async (symptomEntry) => {
    try {
      const { data } = await apiClient.post(`user/symptoms/`, symptomEntry);
      return data;
    } catch (err) {
      console.log(err);
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
    })
    .addCase(fetchAllSymptoms.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export const selectSymptoms = (state) => {
  return state.symptoms;
};

export default symptomSlice.reducer;
