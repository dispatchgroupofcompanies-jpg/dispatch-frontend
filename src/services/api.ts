import axios from "axios";
import { API_BASE_URL } from "../config/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.error("🔴 Auth Error:", error.response.status, error.response.data?.message);
    }
    return Promise.reject(error);
  }
);

export default API;
