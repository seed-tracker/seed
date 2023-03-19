import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

// import created slices

const store = configureStore({
  reducer: { auth: authSlice },
});

export default store;
