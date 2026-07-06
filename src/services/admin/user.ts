import API from "../api";
import type { ApiResponse } from "../../types/invoice";

export const createUser = (data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}): Promise<ApiResponse<any>> => {
  const res = API.post("/admin/users", data);
  return res.then((r) => r.data as ApiResponse<any>);
};

export const getUsers = (): Promise<ApiResponse<any[]>> => {
  const res = API.get("/admin/users");
  return res.then((r) => r.data as ApiResponse<any[]>);
};

export const updateUser = (
  userId: string,
  data: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  },
): Promise<ApiResponse<any>> => {
  const res = API.put(`/admin/users/${userId}`, data);
  return res.then((r) => r.data as ApiResponse<any>);
};

export const deleteUser = (userId: string): Promise<ApiResponse<void>> => {
  const res = API.delete(`/admin/users/${userId}`);
  return res.then((r) => r.data as ApiResponse<void>);
};
