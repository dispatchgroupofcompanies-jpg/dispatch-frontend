import axios from "axios";
import { API_BASE_URL } from "../../src/config/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
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
