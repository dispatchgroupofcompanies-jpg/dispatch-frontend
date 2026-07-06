import API from "../api";
import type { ApiResponse, Invoice, Appointment } from "../../types/invoice";

export const getAdminDashboardStats = async (): Promise<
  ApiResponse<{
    stats: {
      totalInvoices: number;
      pendingInvoices: number;
      approvedInvoices: number;
      totalRevenue: number;
    };
    recentInvoices: Invoice[];
  }>
> => {
  const res = await API.get("/admin/dashboard/stats");
  return res.data as ApiResponse<{
    stats: {
      totalInvoices: number;
      pendingInvoices: number;
      approvedInvoices: number;
      totalRevenue: number;
    };
    recentInvoices: Invoice[];
  }>;
};

export const getAllInvoices = async (): Promise<ApiResponse<Invoice[]>> => {
  const res = await API.get("/admin/invoices");
  return res.data as ApiResponse<Invoice[]>;
};

export const getAllAppointments = async (): Promise<
  ApiResponse<Appointment[]>
> => {
  const res = await API.get("/admin/appointments");
  return res.data as ApiResponse<Appointment[]>;
};

export const updateInvoiceStatus = async (
  id: string,
  status: "approved" | "rejected",
): Promise<ApiResponse<Invoice>> => {
  const res = await API.patch(`/admin/invoices/${id}/status`, {
    status,
  });
  return res.data as ApiResponse<Invoice>;
};
