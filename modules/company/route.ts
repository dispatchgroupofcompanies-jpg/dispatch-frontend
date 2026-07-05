import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getCompanyProfile = async () => {
  const response = await API.get(`/company/company-profile`);
  return response.data;
};

export const saveCompanyProfile = async (
  profileData: Record<string, unknown>,
) => {
  const response = await API.post(`/company/company-profile`, profileData);
  return response.data;
};

export const deleteCompanyProfile = async (id?: string) => {
  const url = id
    ? `/company/company-profile?id=${id}`
    : `/company/company-profile`;
  const response = await API.delete(url);
  return response.data;
};
