import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = window.localStorage.getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
