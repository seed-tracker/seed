import axios from "axios";

const token = window.localStorage.getItem("token");

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 1000,
  headers: {
    authorization: token,
  },
});
console.log(process.env.REACT_APP_API_URL)
export default apiClient;
