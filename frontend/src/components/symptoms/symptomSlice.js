import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addSymptomEntry = createAsyncThunk(
  "post symptom entry",
  async (symptomEntry, username) => {
    try {
      const { data } = await axios.post(`http://localhost:5000/user/${username}/symptoms`, symptomEntry);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
)

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