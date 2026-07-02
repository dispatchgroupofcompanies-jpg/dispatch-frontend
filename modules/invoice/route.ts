import axios from "axios";

const DEBUG = false; // 👈 turn true only when debugging

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// -------------------------
// REQUEST INTERCEPTOR (TOKEN)
// -------------------------
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (DEBUG) {
    console.log("🚀 Request:", config.method?.toUpperCase(), config.url);
    console.log("🔑 Token:", token);
  }

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// -------------------------
// RESPONSE INTERCEPTOR (DEBUG)
// -------------------------
API.interceptors.response.use(
  (response) => {
    if (DEBUG) {
      console.log("✅ Response:", response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    if (DEBUG) {
      console.log("❌ API Error:", error?.response?.data || error.message);
    }
    return Promise.reject(error);
  },
);

// -------------------------
// INVOICE APIs
// -------------------------

export const createInvoice = (data: Record<string, unknown>) => {
  return API.post("/invoices", data);
};

export const getInvoices = () => {
  return API.get("/invoices");
};

export const getInvoiceById = (invoiceId: string) => {
  return API.get(`/invoices/${invoiceId}`);
};

export const updateInvoice = (
  invoiceId: string,
  data: Record<string, unknown>,
) => {
  return API.put(`/invoices/${invoiceId}`, data);
};

export const deleteInvoice = (invoiceId: string) => {
  return API.delete(`/invoices/${invoiceId}`);
};
// Specific field status patch update function
export const updateInvoiceStatus = (invoiceId: string, status: string) => {
  return API.patch(`/invoices/${invoiceId}/status`, { invoiceStatus: status });
};
export const deleteInvoiceAPI = (invoiceId: string) => {
  return API.delete(`/invoices/${invoiceId}`);
};

// -------------------------
// DASHBOARD APIs
// -------------------------

export const getDashboardStats = () => {
  return API.get("/dashboard/stats");
};

export default API;
