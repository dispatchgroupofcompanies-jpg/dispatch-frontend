import API from "../api";
import type { ApiResponse } from "../../types/invoice";

interface UserDashboardStats {
  totalInvoices: number;
  pendingInvoices: number;
  approvedInvoices: number;
  totalRevenue: number;
}

export const getUserDashboardStats = async (): Promise<
  ApiResponse<UserDashboardStats>
> => {
  const res = await API.get("/user/dashboard/stats");
  return res.data as ApiResponse<UserDashboardStats>;
};
