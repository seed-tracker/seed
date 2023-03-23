import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllSymptoms = createAsyncThunk(
  "get/allSymptoms",
  async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/symptoms/");
      return data;
    } catch (err) {
      console.log(err);
    }
  }
)

export const addSymptomEntry = createAsyncThunk(
  "post symptom entry",
  async (symptomEntry) => {
    const token = window.localStorage.getItem('token');
    try {
      const { data } = await axios.post(`http://localhost:5000/user/symptoms/`, symptomEntry, {
        headers: {
          authorization: token,
        }
      });
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
    .addCase(fetchAllSymptoms.fulfilled, (state, action) => {
      return action.payload;
    })
  }
})

export const selectSymptoms = (state) => {
  return state.symptoms
}

export default symptomSlice.reducer