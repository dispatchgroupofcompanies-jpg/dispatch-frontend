import API from "../api";
import type { ApiResponse, Invoice } from "../../types/invoice";

export const createInvoice = (
  data: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> => {
  const res = API.post("/user/invoices", data);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const getInvoices = (): Promise<ApiResponse<Invoice[]>> => {
  const res = API.get("/user/invoices");
  return res.then((r) => r.data as ApiResponse<Invoice[]>);
};

export const getInvoiceById = (
  invoiceId: string,
): Promise<ApiResponse<Invoice>> => {
  const res = API.get(`/user/invoices/${invoiceId}`);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const updateInvoice = (
  invoiceId: string,
  data: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> => {
  const res = API.put(`/user/invoices/${invoiceId}`, data);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const deleteInvoice = (
  invoiceId: string,
): Promise<ApiResponse<void>> => {
  const res = API.delete(`/user/invoices/${invoiceId}`);
  return res.then((r) => r.data as ApiResponse<void>);
};

export const updateInvoiceStatus = (
  invoiceId: string,
  status: string,
): Promise<ApiResponse<Invoice>> => {
  const res = API.patch(`/user/invoices/${invoiceId}/status`, {
    invoiceStatus: status,
  });
  return res.then((r) => r.data as ApiResponse<Invoice>);
};
