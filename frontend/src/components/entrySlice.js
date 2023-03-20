import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addEntry = createAsyncThunk("user/addFood", async (username, entry) => {
  try {
      const { data } = await axios.post(`http://localhost:5000/${username}`, entry)
      return data;
  } catch (err) {
    console.error(err);
  }
});

export const editProfile = createAsyncThunk("user/editProfile", async (username) => {
  try {
      const { data } = await axios.post(`http://localhost:5000/${username}`)
      return data;
  } catch (err) {
    console.error(err);
  }
});

const entrySlice = createSlice({
  name: 'entry',
  initialState: {},
  extraReducers: (builder) =>{
    builder.addCase(addEntry.fulfilled, (state,action)=>{
      return action.payload
    })
    builder.addCase(editProfile.fulfilled, (state,action) => {
      return action.payload
    })
}
})

export default entrySlice.reducer