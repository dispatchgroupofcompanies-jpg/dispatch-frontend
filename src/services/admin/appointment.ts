import API from "../api";
import type { ApiResponse, Appointment } from "../../types/invoice";

export const createAppointment = (
  data: Partial<Appointment>,
): Promise<ApiResponse<Appointment>> => {
  const res = API.post("/admin/appointments", data);
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const getAppointments = (): Promise<ApiResponse<Appointment[]>> => {
  const res = API.get("/admin/appointments");
  return res.then((r) => r.data as ApiResponse<Appointment[]>);
};

export const getAppointmentById = (
  id: string,
): Promise<ApiResponse<Appointment>> => {
  const res = API.get(`/admin/appointments/${id}`);
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const updateAppointment = (
  id: string,
  data: Partial<Appointment>,
): Promise<ApiResponse<Appointment>> => {
  const res = API.put(`/admin/appointments/${id}`, data);
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const updateAppointmentStatus = (
  id: string,
  status: string,
): Promise<ApiResponse<Appointment>> => {
  const res = API.patch(`/admin/appointments/${id}/status`, { status });
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const deleteAppointment = (id: string): Promise<ApiResponse<void>> => {
  const res = API.delete(`/admin/appointments/${id}`);
  return res.then((r) => r.data as ApiResponse<void>);
};

export const downloadAppointmentPDF = (id: string): Promise<Blob> => {
  return API.get(`/admin/appointments/${id}/download`, {
    responseType: "blob",
  }).then((r) => r.data);
};
