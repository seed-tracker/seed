import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "./authSlice";
import symptomSlice from "./symptomSlice";
import entrySlice from "./entrySlice";
import allEntriesSlice from "./allEntriesSlice";
import correlationsSlice from "./correlationsSlice";
import statsSlice from "./statsSlice"
import scatterSlice from "./scatterSlice";
import foodGroupsSlice from "./foodGroupsSlice";

// import created slices

const store = configureStore({
  reducer: {
    auth: authSlice,
    entry: entrySlice,
    symptoms: symptomSlice,
    correlations: correlationsSlice,
    scatter: scatterSlice,
    allEntries: allEntriesSlice,
    stats: statsSlice,
    foodGroups: foodGroupsSlice
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: true,
});

export default store;
export * from "./authSlice";
