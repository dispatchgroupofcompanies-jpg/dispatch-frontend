import API from "./api";
import type { Invoice, ApiResponse, Appointment } from "../types/invoice";

export const getInvoices = async (): Promise<ApiResponse<Invoice[]>> => {
  const res = await API.get("/admin/invoices");
  return res.data as ApiResponse<Invoice[]>;
};

export const updateInvoiceStatus = async (
  id: string,
  newStatus: "approved" | "rejected",
): Promise<ApiResponse<Invoice>> => {
  console.log("🔄 FRONTEND - Calling updateInvoiceStatus:", { id, newStatus });
  const res = await API.patch(`/admin/invoices/${id}/status`, {
    status: newStatus,
  });
  console.log("✅ FRONTEND - updateInvoiceStatus response:", res.data);
  return res.data as ApiResponse<Invoice>;
};

export const updatePaymentStatus = async (
  id: string,
  status: "pending" | "paid",
  proofFile?: File,
): Promise<ApiResponse<Invoice>> => {
  const formData = new FormData();
  formData.append("status", status);
  if (proofFile) {
    formData.append("paymentProof", proofFile);
  }
  const res = await API.patch(`/admin/invoices/${id}/payment-status`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data as ApiResponse<Invoice>;
};

export const getAllAppointments = async (): Promise<

  ApiResponse<Appointment[]>
> => {
  const res = await API.get("/admin/appointments");
  return res.data as ApiResponse<Appointment[]>;
};

export const getInvoiceById = async (
  invoiceId: string,
): Promise<ApiResponse<Invoice>> => {
  const res = await API.get(`/admin/invoices/${invoiceId}`);
  return res.data as ApiResponse<Invoice>;
};

export const downloadInvoice = async (invoiceId: string): Promise<Blob> => {
  const res = await API.get(`/admin/invoices/${invoiceId}/download`, {
    responseType: "blob",
  });
  return res.data;
};

export const downloadAppointmentPDF = async (
  appointmentId: string,
): Promise<Blob> => {
  const res = await API.get(`/admin/appointments/${appointmentId}/download`, {
    responseType: "blob",
  });
  return res.data;
};
