import API from "../api";
import type { ApiResponse } from "../../types/invoice";

export const getAdminLoadboard = async (params: Record<string, any> = {}) => {
  const res = await API.get("/admin/loadboard", { params });
  return res.data as ApiResponse<any[]>;
};

export const updateAdminLoadboardStatus = async (
  recordId: string,
  statusUpdate: { invoiceStatus?: string; paymentStatus?: string }
) => {
  const res = await API.patch(`/admin/loadboard/${recordId}/status`, statusUpdate);
  return res.data as ApiResponse<any>;
};

export default { getAdminLoadboard, updateAdminLoadboardStatus };