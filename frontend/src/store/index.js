import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import entrySlice from "../components/entrySlice";

// import created slices

const store = configureStore({
  reducer: { auth: authSlice, entry: entrySlice}
});

export default store;
