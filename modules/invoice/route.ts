import axios from "axios";

const DEBUG = false;

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
  return API.post("/user/invoices", data);
};

export const getInvoices = () => {
  return API.get("/admin/invoices");
};

export const getInvoiceById = (invoiceId: string) => {
  return API.get(`/admin/invoices/${invoiceId}`);
};

export const getInvoicePdfLink = (invoiceId: string) => {
  return API.get(`/user/invoices/${invoiceId}/pdf-link`);
};

export const updateInvoice = (
  invoiceId: string,
  data: Record<string, unknown>,
) => {
  return API.put(`/user/invoices/${invoiceId}`, data);
};

export const deleteInvoice = (invoiceId: string) => {
  return API.delete(`/user/invoices/${invoiceId}`);
};
// Specific field status patch update function
export const updateInvoiceStatus = (invoiceId: string, status: string) => {
  return API.patch(`/admin/invoices/${invoiceId}/status`, {
    invoiceStatus: status,
  });
};

export const downloadInvoicePDF = (
  invoiceId: string,
  isAdmin: boolean = false,
) => {
  const endpoint = isAdmin
    ? `/admin/invoices/${invoiceId}/download`
    : `/user/invoices/${invoiceId}/download`;

  return API.get(endpoint, {
    responseType: "blob",
  }).catch((error) => {
    // If blob download fails, try to get JSON with URL
    if (error.response?.data?.pdfUrl) {
      return API.get(endpoint);
    }
    throw error;
  });
};

export const downloadPaidInvoicePDF = (
  invoiceId: string,
  isAdmin: boolean = false,
) => {
  const endpoint = isAdmin
    ? `/admin/invoices/${invoiceId}/download-paid`
    : `/user/invoices/${invoiceId}/download-paid`;

  return API.get(endpoint, {
    responseType: "blob",
  }).catch((error) => {
    if (error.response?.data?.message) {
      return Promise.reject(error);
    }
    throw error;
  });
};

// -------------------------
// DASHBOARD APIs
// -------------------------

export const getDashboardStats = () => {
  return API.get("/admin/dashboard/stats");
};

export default API;
