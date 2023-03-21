import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addEntry = createAsyncThunk("user/addFood", async ({ username, entry }) => {
  try {
    const { data } = await axios.post(`http://localhost:5000/user/${username}/addFood`, entry);
    return data;
  } catch (err) {
    console.error(err);
  }
});

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async ({ username, name, email, password }) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/${username}/editProfile`,
        { username, name, email, password }
      );
      return data;
    } catch (err) {
      console.error(err);
    }
  }
);

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

//do i need another slice here to store user state