import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "./authSlice";
import entrySlice from "../components/entrySlice";

// import created slices

const store = configureStore({
  reducer: { auth: authSlice, entry: entrySlice},
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
export * from "./authSlice";
