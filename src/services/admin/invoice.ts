import API from "../api";
import type { ApiResponse, Invoice } from "../../types/invoice";

export const createInvoice = (
  data: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> => {
  const res = API.post("/admin/invoices", data);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const getInvoices = (): Promise<ApiResponse<Invoice[]>> => {
  const res = API.get("/admin/invoices");
  return res.then((r) => r.data as ApiResponse<Invoice[]>);
};

export const getInvoiceById = (
  invoiceId: string,
): Promise<ApiResponse<Invoice>> => {
  const res = API.get(`/admin/invoices/${invoiceId}`);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const updateInvoice = (
  invoiceId: string,
  data: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> => {
  const res = API.put(`/admin/invoices/${invoiceId}`, data);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const deleteInvoice = (
  invoiceId: string,
): Promise<ApiResponse<void>> => {
  const res = API.delete(`/admin/invoices/${invoiceId}`);
  return res.then((r) => r.data as ApiResponse<void>);
};

export const updateInvoiceStatus = (
  invoiceId: string,
  status: string,
): Promise<ApiResponse<Invoice>> => {
  const res = API.patch(`/admin/invoices/${invoiceId}/status`, {
    status: status,
  });
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const downloadInvoicePDF = async (invoiceId: string): Promise<Blob> => {
  const res = await API.get(`/admin/invoices/${invoiceId}/download`, {
    responseType: "blob",
  });
  return res.data as Blob;
};
