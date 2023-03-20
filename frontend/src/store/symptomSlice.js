import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addSymptomEntry = createAsyncThunk(
  "post symptom entry",
  async (username, symptomEntry) => {
    try {
      const { data } = await axios.post(`http:localhost:5000/users/${username}/symptoms`, symptomEntry);
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
  }
})

export const selectSymptoms = (state) => {
  return state.symptoms
}

export default symptomSlice.reducer