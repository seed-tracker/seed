import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authSlice from "./authSlice";
import symptomSlice from "./symptomSlice";

// import created slices

const store = configureStore({
<<<<<<< HEAD
  reducer: { auth: authSlice, symptoms: symptomSlice },
=======
  reducer: { auth: authSlice },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
>>>>>>> 2b54fdc675909e2716b675a052a689dd3c77cf0b
});

export default store;
export * from "./authSlice";
