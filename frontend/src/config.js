import axios from "axios";

const token = window.localStorage.getItem("token");

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000,
  headers: {
    authorization: token,
  },
});

export default client;
