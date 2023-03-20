import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import symptomSlice from "./symptomSlice";

// import created slices

const store = configureStore({
  reducer: { auth: authSlice, symptoms: symptomSlice },
});

export default store;
