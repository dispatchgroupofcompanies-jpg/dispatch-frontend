import API from "../api";
import type { ApiResponse, Invoice } from "../../types/invoice";

export const createInvoice = (
  data: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> => {
  const res = API.post("/admin/invoices", data);
  return res.then((r) => r.data as ApiResponse<Invoice>);
};

export const getInvoices = (
  params: Record<string, any> = {},
): Promise<ApiResponse<Invoice[]>> => {
  const res = API.get("/admin/invoices", { params });
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

export const downloadPaidInvoicePDF = async (
  invoiceId: string,
): Promise<Blob> => {
  const res = await API.get(`/admin/invoices/${invoiceId}/download-paid`, {
    responseType: "blob",
  });
  return res.data as Blob;
};

export const updatePaymentStatus = async (
  invoiceId: string,
  status: "pending" | "paid",
  paymentProof?: File,
): Promise<ApiResponse<Invoice>> => {
  // 🔍 LOG 1: Inputs check karein
  console.log("🔍 [Frontend Service Input]:", {
    invoiceId,
    status,
    paymentProof,
  });

  const formData = new FormData();
  formData.append("status", status);

  if (paymentProof) {
    formData.append("paymentProof", paymentProof);
  }

  // 🔍 LOG 2: FormData content check karein (FormData ko direct console.log karne se khali dikhta hai, isliye entries loop lagayein)
  console.log("🔍 [FormData Entries]:");
  for (let [key, value] of formData.entries()) {
    console.log(` -> ${key}:`, value);
  }

  const res = await API.patch<ApiResponse<Invoice>>(
    `/admin/invoices/${invoiceId}/payment-status`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure boundary set ho
      },
    },
  );

  // 🔍 LOG 3: API Response check karein
  console.log("🔍 [API Response Data]:", res.data);

  return res.data;
};

export const checkVridExists = (
  vrid: string,
  excludeInvoiceId?: string,
): Promise<{ success: boolean; exists: boolean }> => {
  const res = API.get("/admin/invoices/check-vrid", {
    params: { vrid, ...(excludeInvoiceId ? { excludeInvoiceId } : {}) },
  });
  return res.then((r) => r.data as { success: boolean; exists: boolean });
};
