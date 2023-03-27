import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "./authSlice";
import symptomSlice from "./symptomSlice";
import entrySlice from "./entrySlice";
import allEntriesSlice from "./allEntriesSlice";
import correlationsSlice from "./correlationsSlice";
import statsSlice from "./statsSlice"

// import created slices

const store = configureStore({
  reducer: {
    auth: authSlice,
    entry: entrySlice,
    symptoms: symptomSlice,
    correlations: correlationsSlice,
    allEntries: allEntriesSlice,
    stats: statsSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;
export * from "./authSlice";
