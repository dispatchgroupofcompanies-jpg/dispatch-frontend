import axios from "axios";

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Add auth token to requests
API.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Appointment {
  _id: string;
  tripNumber?: string;
  loadConfirmationNumber?: string;
  shipmentNumber?: string;
  carrierName?: string;
  carrierAddress?: string;
  carrierPhone?: string;
  carrierEmail?: string;
  equipmentType?: string;
  pickupDate?: string;
  pickupTimeStart?: string;
  pickupTimeEnd?: string;
  deliveryDate?: string;
  deliveryTime?: string;
  pickupNumber?: string;
  dropOffNumber?: string;
  commodityDescription?: string;
  weight?: number;
  shipperName?: string;
  shipperAddress?: string;
  shipperCity?: string;
  shipperProvince?: string;
  shipperPostalCode?: string;
  consigneeName?: string;
  consigneeAddress?: string;
  consigneeCity?: string;
  consigneeProvince?: string;
  consigneePostalCode?: string;
  chargeDescription?: string;
  rateAmount?: number;
  totalAmount?: number;
  currency?: string;
  signature?: string;
  signatureDate?: string;
  carrierProNumber?: string;
  driverCellNumber?: string;
  notesTerms?: string;
  companyId?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  province?: string;
  state?: string;
  postCode?: string;
  country?: string;
  nsc?: string;
  ifta?: string;
  gstHst?: string;
  qst?: string;
  eTransfer?: string;
  companyLogo?: string;
  appointmentDate?: string;
  appointmentTime?: string;
  serviceType?: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export interface Company {
  _id: string;
  companyName: string;
  carrierIdentifier: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  province: string;
  postCode: string;
  country: string;
  nsc: string;
  ifta: string;
  gstHst: string;
  qst: string;
  eTransfer: string;
  companyLogo?: string;
}

// Fetch all appointments
export const fetchAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await API.get("/user/appointments");
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Fetch single appointment by ID
export const fetchAppointmentById = async (
  id: string,
): Promise<Appointment> => {
  try {
    const res = await API.get(`/user/appointments/${id}`);
    return res.data?.data;
  } catch (error) {
    console.error("Error fetching appointment:", error);
    throw error;
  }
};

// Create new appointment
export const createAppointment = async (
  data: Partial<Appointment>,
): Promise<Appointment> => {
  try {
    const res = await API.post("/user/appointments", data);
    return res.data?.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

// Update appointment
export const updateAppointment = async (
  id: string,
  data: Partial<Appointment>,
): Promise<Appointment> => {
  try {
    const res = await API.put(`/user/appointments/${id}`, data);
    return res.data?.data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

// Delete appointment
export const deleteAppointment = async (id: string): Promise<void> => {
  try {
    await API.delete(`/user/appointments/${id}`);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};

// Cloudinary URL response type
export interface CloudinaryPDFResponse {
  data: {
    pdfUrl: string;
    filename: string;
  };
}

// Download appointment PDF - returns either Blob or JSON with Cloudinary URL
export const downloadAppointmentPDF = async (
  id: string,
): Promise<Blob | CloudinaryPDFResponse> => {
  try {
    const res = await API.get(`/user/appointments/${id}/download`, {
      responseType: "blob",
    });
    return res.data;
  } catch (error: any) {
    // If backend returns JSON with Cloudinary URL, return that instead
    if (error.response?.data?.pdfUrl) {
      return error.response.data;
    }
    console.error("Error downloading PDF:", error);
    throw error;
  }
};

// Fetch company profile
export const fetchCompanyProfile = async (): Promise<Company[]> => {
  try {
    const res = await API.get("/company/company-profile");
    if (res.data?.success && res.data?.data) {
      const profile = res.data.data;
      return profile && Object.keys(profile).length > 0 ? [profile] : [];
    }
    return [];
  } catch (error) {
    console.error("Error fetching company:", error);
    return [];
  }
};

// Update appointment status
export const updateAppointmentStatus = async (
  id: string,
  status: string,
): Promise<Appointment> => {
  try {
    const res = await API.patch(`/user/appointments/${id}/status`, { status });
    return res.data?.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};
