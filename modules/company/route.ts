import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export const getCompanyProfile = async () => {
    const response = await API.get(`/company/company-profile`);
  return response.data;
};

export const saveCompanyProfile = async (profileData: Record<string, unknown>) => {
  const response = await API.post(`/company/company-profile`, profileData);
  return response.data;
};

export const deleteCompanyProfile = async () => {
  const response = await API.delete(`/company/company-profile`);
  return response.data;
};