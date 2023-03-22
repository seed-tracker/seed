import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const TOKEN = "token";
/**
 * async thunk that authorizes a user through an AJAX request
 * receives the token from local storage when user is logged in
 * @returns authentication confirmation
 * @catches error if database request goes wrong
 */
export const me = createAsyncThunk("auth/me", async (thunkAPI) => {
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
    if (err.response.data) {
      return thunkAPI.rejectWithValue(err.response.data);
    } else {
      return "There was an issue with your request.";
    }
  }
});

/**
 * async thunk that authenticates a user through an AJAX request
 * @param {object} userInfo to send to the database to send username and password to the database
 * creates a token in localstorage and receives user info on the frontend
 * @catches error if database request goes wrong
 */
export const login = createAsyncThunk(
  "auth/login",
  async (userInfo, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/login",
        userInfo
      );
      console.log(data)
      window.localStorage.setItem(TOKEN, data.token);
      thunkAPI.dispatch(me());

    } catch (err) {
      if (err.response.data) {
        return thunkAPI.rejectWithValue(err.response.data);
      } else {
        return "There was an issue with your request.";
      }
    }
  }
);

/**
 * async thunk that registers a user through an AJAX request
 * @param {object} userInfo to send to the database to register a new user
 * creates a token in localstorage and receives user info on the frontend
 * @catches error if database request goes wrong
 */
export const signup = createAsyncThunk(
  "auth/signup",
  async (userInfo, thunkAPI) => {
    try {
      const { data } = await axios.post(
        "http://localhost:5000/auth/register",
        userInfo
      );
      window.localStorage.setItem(TOKEN, data.token);
      thunkAPI.dispatch(me());
    } catch (err) {
      if (err.response.data) {
        return thunkAPI.rejectWithValue(err.response.data);
      } else {
        return "There was an issue with your request.";
      }
    }
  }
);

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
      state.me = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(me.fulfilled, (state, action) => {
      state.me = action.payload;
    });
    builder.addCase(me.rejected, (state, action) => {
      state.error = action.error;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.error = action.payload;
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.error = action.payload;
    });
  },
});

/*
 * logout reducer is exported to be useable on the frontend
 */
export const { logout } = authSlice.actions;

/**
 * selector function that allows us to access state by dispatching an action to the store
 * @param {object} state object
 * @returns the user object and error stored in state
 */
export const selectAuthUser = (state) => state.auth.me;
export const selectError = (state) => state.auth.error;

/*
exporting the authSlice
*/
export default authSlice.reducer;
