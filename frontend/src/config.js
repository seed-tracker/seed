import axios from "axios";

const token = window.localStorage.getItem("token");

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    authorization: token,
  },
});

export default apiClient;
