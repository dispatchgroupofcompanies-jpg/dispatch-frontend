import axios from "axios";
import Api from "./api";

const api = axios.create({
  baseURL: `${Api.defaults.baseURL}/admin/users`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const createUserApi = async (userData: {
  name: string;
  email: string;
  password: string;
  address: string;
}) => {
  const response = await api.post("/", userData);
  return response.data;
};

export const getAllUsersApi = async () => {
  const response = await api.get("/");
  return response.data;
};

export const updateUserApi = async (
  userId: string,
  userData: {
    name?: string;
    email?: string;
    password?: string;
    address?: string;
  },
) => {
  const response = await api.put(`/${userId}`, userData);
  return response.data;
};

export const deleteUserApi = async (userId: string) => {
  const response = await api.delete(`/${userId}`);
  return response.data;
};
