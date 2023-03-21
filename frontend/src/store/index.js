import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "./authSlice";
import symptomSlice from "../components/symptoms/symptomSlice";

// import created slices

const store = configureStore({
  reducer: { auth: authSlice, symptoms: symptomSlice },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export * from "./authSlice";
