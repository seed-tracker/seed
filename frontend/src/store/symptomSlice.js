import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addSymptomEntry = createAsyncThunk(
  "symptom/add",
  async (symptomEntry) => {
    const token = window.localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `http://localhost:5000/user/symptoms/`,
        symptomEntry,
        {
          headers: {
            authorization: token,
          },
        }
      );
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
    });
  },
});

export const selectSymptoms = (state) => {
  return state.symptoms;
};

export default symptomSlice.reducer;
