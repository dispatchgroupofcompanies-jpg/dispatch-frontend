import API from "./api";
import type { ApiResponse } from "../types/invoice";

export const getUserProfile = async (): Promise<ApiResponse<any>> => {
  const res = await API.get("/user/profile");
  return res.data as ApiResponse<any>;
};
