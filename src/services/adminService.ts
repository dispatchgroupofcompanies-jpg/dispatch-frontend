import API from "./api";
import type { ApiResponse, Appointment } from "../types/invoice";

export const getAllAppointments = async (): Promise<

  ApiResponse<Appointment[]>
> => {
  const res = await API.get("/admin/appointments");
  return res.data as ApiResponse<Appointment[]>;
};

export const downloadAppointmentPDF = async (
  appointmentId: string,
): Promise<Blob> => {
  const res = await API.get(`/admin/appointments/${appointmentId}/download`, {
    responseType: "blob",
  });
  return res.data;
};
