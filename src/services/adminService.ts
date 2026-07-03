import API from "./api";
import type { Invoice, ApiResponse } from "../types/invoice";

export const getInvoices = async (): Promise<ApiResponse<Invoice[]>> => {
  const res = await API.get("/admin/invoices");
  return res.data as ApiResponse<Invoice[]>;
};

export const updateInvoiceStatus = async (
  id: string,
  newStatus: "approved" | "rejected",
): Promise<ApiResponse<any>> => {
  const res = await API.patch(`/admin/${newStatus}/${id}/status`);
  return res.data as ApiResponse<any>;
};
