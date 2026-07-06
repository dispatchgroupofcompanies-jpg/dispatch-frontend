import API from "../api";
import type { ApiResponse, Appointment } from "../../types/invoice";

export const createAppointment = (
  data: Partial<Appointment>,
): Promise<ApiResponse<Appointment>> => {
  const res = API.post("/user/appointments", data);
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const getAppointments = (): Promise<ApiResponse<Appointment[]>> => {
  const res = API.get("/user/appointments");
  return res.then((r) => r.data as ApiResponse<Appointment[]>);
};

export const getAppointmentById = (
  id: string,
): Promise<ApiResponse<Appointment>> => {
  const res = API.get(`/user/appointments/${id}`);
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const updateAppointment = (
  id: string,
  data: Partial<Appointment>,
): Promise<ApiResponse<Appointment>> => {
  const res = API.put(`/user/appointments/${id}`, data);
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const updateAppointmentStatus = (
  id: string,
  status: string,
): Promise<ApiResponse<Appointment>> => {
  const res = API.patch(`/user/appointments/${id}/status`, { status });
  return res.then((r) => r.data as ApiResponse<Appointment>);
};

export const deleteAppointment = (id: string): Promise<ApiResponse<void>> => {
  const res = API.delete(`/user/appointments/${id}`);
  return res.then((r) => r.data as ApiResponse<void>);
};

export const downloadAppointmentPDF = (id: string): Promise<Blob> => {
  return API.get(`/user/appointments/${id}/download`, {
    responseType: "blob",
  }).then((r) => r.data);
};
