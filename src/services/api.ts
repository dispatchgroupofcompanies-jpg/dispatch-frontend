import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
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
