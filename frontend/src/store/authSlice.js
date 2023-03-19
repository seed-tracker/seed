import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = "token";
/**
 * async thunk that authorizes a user through an AJAX request
 * receives the token from local storage when user is logged in
 * @returns authentication confirmation
 * @catches error if database request goes wrong
 */
export const me = createAsyncThunk("auth/me", async () => {
  const token = window.localStorage.getItem(TOKEN);
  try {
    if (token) {
      const { data } = await axios.get("http://localhost:5000/auth/me", {
        headers: {
          authorization: token,
        },
      });
      return data;
    } else {
      return {};
    }
  } catch (err) {
    console.error(err);
  }
});

/**
 * async thunk that authenticates a user through an AJAX request
 * @param {object} userInfo to send to the database to send username and password to the database
 * creates a token in localstorage and receives user info on the frontend
 * @catches error if database request goes wrong
 */
export const login = createAsyncThunk("auth/login", async (userInfo) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/auth/login",
      userInfo
    );
    window.localStorage.setItem(TOKEN, data.token);
    me();
    return data;
  } catch (err) {
    console.error(err);
  }
});

/**
 * async thunk that registers a user through an AJAX request
 * @param {object} userInfo to send to the database to register a new user
 * creates a token in localstorage and receives user info on the frontend
 * @catches error if database request goes wrong
 */
export const signup = createAsyncThunk("auth/signup", async (userInfo) => {
  try {
    const { data } = await axios.post(
      "http://localhost:5000/auth/register",
      userInfo
    );
    window.localStorage.setItem(TOKEN, data.token);
    me();
    return data;
  } catch (err) {
    console.error(err);
  }
});

/**
 * authentication slice
 * initialState is set as an empty object
 * a regular reducer is used whenever a user logs out
 * all extra reducers are setting AJAX responses as state
 */
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    me: {},
    error: null,
  },
  reducers: {
    logout(state, action) {
      window.localStorage.removeItem(TOKEN);
      state = {
        me: {},
        error: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, { payload }) => {
      state.me = payload;
    });
    builder.addCase(login.rejected, (state, { payload }) => {
      state.error = payload;
    });
    builder.addCase(signup.rejected, (state, { payload }) => {
      state.error = payload;
    });
  },
});

/*
 * logout reducer is exported to be useable on the frontend
 */
export const { logout } = authSlice.actions;

/*
exporting the authSlice
*/
export default authSlice.reducer;