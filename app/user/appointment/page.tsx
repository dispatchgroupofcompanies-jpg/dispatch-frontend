"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";

// Helper function to safely format dates
const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  try {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return "-";
  }
};

import { Button, Table, Card, Modal, Form, message, Tag } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import TripInfoSection from "./components/TripInfoSection";
import CarrierInfoSection from "./components/CarrierInfoSection";
import ShipmentScheduleSection from "./components/ShipmentScheduleSection";
import ShipperSection from "./components/ShipperSection";
import ConsigneeSection from "./components/ConsigneeSection";
import ChargesSection from "./components/ChargesSection";
import ConfirmationSection from "./components/ConfirmationSection";
import NotesSection from "./components/NotesSection";
import { createColumns } from "./components/AppointmentTableColumns";
import ExpandedRowContent from "./components/ExpandedRowContent";
import {
  fetchAppointments as apiFetchAppointments,
  fetchCompanyProfile,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  downloadAppointmentPDF,
} from "./lib/appointmentApi";
import type { Appointment, Company } from "./lib/appointmentApi";

function AppointmentPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const mountedRef = useRef(true);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await fetchCompanyProfile();
      if (mountedRef.current) setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiFetchAppointments();
      if (mountedRef.current) setAppointments(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    const loadData = async () => {
      await fetchAppointments();
      await fetchCompanies();
    };
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);

      // Format date fields for backend
      const formattedValues = { ...values };

      // Convert pickupDate if present
      if (
        formattedValues.pickupDate &&
        dayjs.isDayjs(formattedValues.pickupDate)
      ) {
        formattedValues.pickupDate =
          formattedValues.pickupDate.format("YYYY-MM-DD");
      }

      // Convert deliveryDate if present
      if (
        formattedValues.deliveryDate &&
        dayjs.isDayjs(formattedValues.deliveryDate)
      ) {
        formattedValues.deliveryDate =
          formattedValues.deliveryDate.format("YYYY-MM-DD");
      }

      // Convert signatureDate if present
      if (
        formattedValues.signatureDate &&
        dayjs.isDayjs(formattedValues.signatureDate)
      ) {
        formattedValues.signatureDate =
          formattedValues.signatureDate.format("YYYY-MM-DD");
      }

      // Convert time fields if present
      if (
        formattedValues.pickupTimeStart &&
        dayjs.isDayjs(formattedValues.pickupTimeStart)
      ) {
        formattedValues.pickupTimeStart =
          formattedValues.pickupTimeStart.format("HH:mm");
      }
      if (
        formattedValues.pickupTimeEnd &&
        dayjs.isDayjs(formattedValues.pickupTimeEnd)
      ) {
        formattedValues.pickupTimeEnd =
          formattedValues.pickupTimeEnd.format("HH:mm");
      }
      if (
        formattedValues.deliveryTime &&
        dayjs.isDayjs(formattedValues.deliveryTime)
      ) {
        formattedValues.deliveryTime =
          formattedValues.deliveryTime.format("HH:mm");
      }

      await createAppointment(formattedValues);
      message.success("Appointment booked successfully!");
      form.resetFields();
      setOpen(false);
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  console.log("🚀 Appointments Data:", appointments);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteAppointment(id);
      message.success("Appointment deleted successfully");
      fetchAppointments();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete appointment");
    }
  }, []);

  const handleDownloadPDF = useCallback(async (id: string) => {
    try {
      const blob = await downloadAppointmentPDF(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `appointment-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      message.error("Failed to download PDF");
    }
  }, []);

  const openEdit = useCallback(
    (record: Appointment) => {
      setEditingId(record._id);

      // Format dates and times for the form
      const formData: Record<string, unknown> = { ...record };
      try {
        // Format date fields
        if (
          record.appointmentDate &&
          typeof record.appointmentDate === "string"
        ) {
          const d = dayjs(record.appointmentDate);
          if (d.isValid()) formData.appointmentDate = d;
        }
        if (record.pickupDate && typeof record.pickupDate === "string") {
          const d = dayjs(record.pickupDate);
          if (d.isValid()) formData.pickupDate = d;
        }
        if (record.deliveryDate && typeof record.deliveryDate === "string") {
          const d = dayjs(record.deliveryDate);
          if (d.isValid()) formData.deliveryDate = d;
        }
        if (record.signatureDate && typeof record.signatureDate === "string") {
          const d = dayjs(record.signatureDate);
          if (d.isValid()) formData.signatureDate = d;
        }

        // Format time fields safely for TimePicker
        if (
          record.pickupTimeStart &&
          typeof record.pickupTimeStart === "string"
        ) {
          const t = dayjs(record.pickupTimeStart, "HH:mm");
          if (t.isValid()) formData.pickupTimeStart = t;
        }
        if (record.pickupTimeEnd && typeof record.pickupTimeEnd === "string") {
          const t = dayjs(record.pickupTimeEnd, "HH:mm");
          if (t.isValid()) formData.pickupTimeEnd = t;
        }
        if (record.deliveryTime && typeof record.deliveryTime === "string") {
          const t = dayjs(record.deliveryTime, "HH:mm");
          if (t.isValid()) formData.deliveryTime = t;
        }
      } catch (e) {
        console.error("Error formatting dates/times:", e);
      }

      editForm.setFieldsValue(formData);
      setEditOpen(true);
    },
    [editForm],
  );

  const handleEditSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      try {
        // Format date fields for backend
        const formattedValues = { ...values };

        if (
          formattedValues.appointmentDate &&
          dayjs.isDayjs(formattedValues.appointmentDate)
        ) {
          formattedValues.appointmentDate =
            formattedValues.appointmentDate.format("YYYY-MM-DD");
        }

        await updateAppointment(editingId!, formattedValues);
        message.success("Appointment updated successfully!");
        setEditOpen(false);
        setEditingId(null);
        editForm.resetFields();
        fetchAppointments();
      } catch (err) {
        console.error(err);
        message.error("Failed to update appointment");
      }
    },
    [editingId, editForm],
  );

  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = useMemo(
    () =>
      createColumns({
        onEdit: openEdit,
        onDelete: handleDelete,
      }),
    [openEdit, handleDelete],
  );

  const expandedRowRender = (record: Appointment) => {
    const isExpanded = expandedRow === record._id;
    return (
      <ExpandedRowContent
        record={record}
        isExpanded={isExpanded}
        onToggle={() => setExpandedRow(isExpanded ? null : record._id)}
      />
    );
  };

  return (
    <div
      style={{
        padding: isMobile ? "12px" : "24px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <Card
        styles={{
          header: {
            padding: isMobile ? "16px" : "16px 24px",
            borderBottom: "1px solid #f1f5f9",
          },
          body: { padding: isMobile ? "12px" : "24px" },
        }}
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
          background: "#ffffff",
          overflow: "hidden",
        }}
        title={
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between",
              alignItems: isMobile ? "flex-start" : "center",
              width: "100%",
              gap: isMobile ? "16px" : "0",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? "20px" : "24px",
                  fontWeight: 700,
                  color: "#0f172a",
                  letterSpacing: "-0.02em",
                }}
              >
                Appointment Management
              </h2>
              <p
                style={{
                  margin: "4px 0 0 0",
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                Book and manage customer appointments
              </p>
            </div>
            <Button
              type="primary"
              size={isMobile ? "middle" : "large"}
              icon={<PlusOutlined />}
              style={{
                borderRadius: "8px",
                fontWeight: 600,
                width: isMobile ? "100%" : "auto",
              }}
              onClick={() => setOpen(true)}
            >
              Book Appointment
            </Button>
          </div>
        }
      >
        <div style={{ width: "100%", overflowX: "auto" }}>
          <Table
            dataSource={appointments}
            columns={columns}
            rowKey={(record) => record._id}
            loading={loading}
            pagination={{
              pageSize: 10,
              placement: ["bottomCenter"],
              size: isMobile ? "small" : "middle",
            }}
            size={isMobile ? "small" : "middle"}
            scroll={{ x: isMobile ? 1000 : "100%" }}
            tableLayout="fixed"
            bordered={false}
            expandable={{
              expandedRowRender,
              onExpandedRowsChange: (expandedRows) => {
                if (expandedRows.length > 0) {
                  setExpandedRow(expandedRows[0] as string);
                } else {
                  setExpandedRow(null);
                }
              },
              expandedRowKeys: expandedRow ? [expandedRow] : [],
            }}
          />
        </div>
      </Card>

      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            📋 Load Confirmation Form
          </div>
        }
        open={open}
        onCancel={() => {
          form.resetFields();
          setOpen(false);
        }}
        footer={null}
        width={1100}
        centered
        style={{ maxWidth: "100%", padding: isMobile ? "8px" : "24px" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          style={{ marginTop: "20px" }}
        >
          <TripInfoSection />
          <CarrierInfoSection />
          <ShipmentScheduleSection />
          <ShipperSection />
          <ConsigneeSection />
          <ChargesSection />
          <ConfirmationSection />
          <NotesSection />

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column-reverse" : "row",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <Button
              size="large"
              style={{ width: isMobile ? "100%" : "auto" }}
              onClick={() => {
                form.resetFields();
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={submitting}
              style={{
                background: "#2563eb",
                borderRadius: "6px",
                fontWeight: 600,
                width: isMobile ? "100%" : "auto",
              }}
            >
              Submit Load Confirmation
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            Appointment Details
          </div>
        }
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        footer={
          <Button
            size="large"
            onClick={() => setViewOpen(false)}
            style={{ borderRadius: "6px", width: isMobile ? "100%" : "auto" }}
          >
            Close
          </Button>
        }
        width={600}
        centered
      >
        {selectedAppointment && (
          <div style={{ padding: "20px 0" }}>
            {selectedAppointment.companyLogo && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "3px solid #1e3a8a",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#f8fafc",
                  }}
                >
                  <img
                    src={selectedAppointment.companyLogo}
                    alt="Company Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            )}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="large"
                onClick={() => handleDownloadPDF(selectedAppointment._id)}
                style={{
                  background: "#2563eb",
                  borderRadius: "6px",
                  fontWeight: 600,
                  width: isMobile ? "100%" : "auto",
                }}
              >
                Download Appointment PDF
              </Button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
                gap: "16px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Company Name
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#1e3a8a",
                  }}
                >
                  {selectedAppointment.companyName}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Email
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#334155",
                    wordBreak: "break-word",
                  }}
                >
                  {selectedAppointment.email}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Phone
                </div>
                <div style={{ fontSize: "14px", color: "#334155" }}>
                  {selectedAppointment.phone}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Service Type
                </div>
                <Tag color="blue">{selectedAppointment.serviceType}</Tag>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Appointment Date
                </div>
                <div style={{ fontSize: "14px", color: "#334155" }}>
                  {formatDate(selectedAppointment.appointmentDate)}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Time
                </div>
                <div style={{ fontSize: "14px", color: "#334155" }}>
                  {selectedAppointment.appointmentTime}
                </div>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Status
                </div>
                <Tag
                  color={
                    selectedAppointment.status === "confirmed"
                      ? "success"
                      : selectedAppointment.status === "cancelled"
                        ? "error"
                        : selectedAppointment.status === "completed"
                          ? "success"
                          : "warning"
                  }
                >
                  {selectedAppointment.status.toUpperCase()}
                </Tag>
              </div>
              {selectedAppointment.notes && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Notes
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#334155",
                      padding: "8px",
                      backgroundColor: "#f8fafc",
                      borderRadius: "4px",
                      wordBreak: "break-word",
                    }}
                  >
                    {selectedAppointment.notes}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            ✏️ Edit Load Confirmation
          </div>
        }
        open={editOpen}
        onCancel={() => {
          setEditOpen(false);
          setEditingId(null);
          editForm.resetFields();
        }}
        footer={null}
        width={1100}
        centered
        style={{ maxWidth: "100%", padding: isMobile ? "8px" : "24px" }}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
          requiredMark={false}
          style={{ marginTop: "20px" }}
        >
          <TripInfoSection />
          <CarrierInfoSection />
          <ShipmentScheduleSection />
          <ShipperSection />
          <ConsigneeSection />
          <ChargesSection />
          <ConfirmationSection />
          <NotesSection />

          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column-reverse" : "row",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "20px",
            }}
          >
            <Button
              size="large"
              style={{ width: isMobile ? "100%" : "auto" }}
              onClick={() => {
                setEditOpen(false);
                setEditingId(null);
                editForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                background: "#2563eb",
                borderRadius: "6px",
                fontWeight: 600,
                width: isMobile ? "100%" : "auto",
              }}
            >
              Update Load Confirmation
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

import dynamic from "next/dynamic";

const AppointmentPageDynamic = dynamic(() => Promise.resolve(AppointmentPage), {
  ssr: false,
});

export default AppointmentPageDynamic;
