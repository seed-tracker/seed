import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "./authSlice";
import symptomSlice from "./symptomSlice";
import entrySlice from "./entrySlice";
import correlationsSlice from "./correlationsSlice";

// import created slices

const store = configureStore({
  reducer: { auth: authSlice, entry: entrySlice, symptoms: symptomSlice, correlations: correlationsSlice },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export * from "./authSlice";
