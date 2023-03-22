import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchUserCorrelations = createAsyncThunk("get user's correlations", async (username) => {
  try {
    const {data} = await axios.get(`http://localhost:5000/${username}/correlations`)
    return data
  } catch(err) {
    console.log(err);
  }
})