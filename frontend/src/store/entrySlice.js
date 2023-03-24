import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../config";

export const addEntry = createAsyncThunk("user/addFood", async ({ entry }) => {
  try {
    const { data } = await apiClient.post("users/addMeal", entry);
    return data;
  } catch (err) {
    console.error(err);
  }
});

export const editProfile = createAsyncThunk(
  "user/editProfile",
  async ({ username, name, email, password }) => {
    try {
      const { data } = await apiClient.put("users/editProfile", {
        username,
        name,
        email,
        password,
      });
      return data;
    } catch (err) {
      console.error(err);
    }
  }
);

// Thunk to to foods route for autocomplete React component
export const autocompleteFood = createAsyncThunk("foods/autocomplete",
async (query) => {
  try{
    // console.log(query)
    const {data} = await apiClient.get(`foods/autocomplete?query=${query}`);
    return data;
  } catch (err) {
    console.error(err);
  }
});

const entrySlice = createSlice({
  name: "entry",
  initialState: {},
  extraReducers: (builder) => {
    builder.addCase(addEntry.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(editProfile.fulfilled, (state, action) => {
      return action.payload;
    });
    builder.addCase(autocompleteFood.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default entrySlice.reducer;

//do i need another slice here to store user state
