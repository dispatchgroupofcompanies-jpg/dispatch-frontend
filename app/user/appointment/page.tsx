"use client";

import { useEffect, useState, useCallback } from "react";

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

import { Button, Table, Card, Modal, Form, message, Tag, Skeleton } from "antd";
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
  const [editOpen, setEditOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await fetchCompanyProfile();
      setCompanies(data);
    } catch (err) {
      console.error("Error fetching companies:", err);
    }
  };

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiFetchAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchAppointments();
      await fetchCompanies();
    };
    loadData();
  }, [fetchAppointments]);

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
      const response = await downloadAppointmentPDF(id);

      // Check if response is JSON with Cloudinary URL
      if (
        typeof response === "object" &&
        response !== null &&
        "data" in response &&
        (response as any).data &&
        typeof (response as any).data === "object" &&
        (response as any).data.pdfUrl
      ) {
        // Open Cloudinary URL directly in new tab
        window.open((response as any).data.pdfUrl, "_blank");
        message.success("PDF opened in new tab!");
      } else if (response instanceof Blob) {
        // Download blob
        const url = window.URL.createObjectURL(response);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `appointment-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        message.success("PDF downloaded successfully!");
      } else {
        throw new Error("Invalid response format");
      }
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

  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);

  const handleViewInvoice = useCallback(
    async (record: Appointment) => {
      try {
        // Show loading message
        message.loading({
          content: "Loading invoice preview...",
          key: "invoice-loading",
        });

        const response = await downloadAppointmentPDF(record._id);

        // Check if response is JSON with Cloudinary URL
        if (
          typeof response === "object" &&
          response !== null &&
          "data" in response &&
          (response as any).data &&
          typeof (response as any).data === "object" &&
          (response as any).data.pdfUrl
        ) {
          // Use Cloudinary URL directly
          console.log(
            "📥 Using Cloudinary URL:",
            (response as any).data.pdfUrl,
          );
          setInvoiceUrl((response as any).data.pdfUrl);
          setSelectedAppointment(record);
          setInvoiceModalOpen(true);
        } else if (response instanceof Blob) {
          // Use blob URL
          const url = window.URL.createObjectURL(response);
          setInvoiceUrl(url);
          setSelectedAppointment(record);
          setInvoiceModalOpen(true);
        } else {
          throw new Error("Invalid response format");
        }

        // Hide loading message
        message.destroy("invoice-loading");
      } catch (err) {
        console.error(err);
        message.destroy("invoice-loading");
        message.error("Failed to load invoice");
      }
    },
    [downloadAppointmentPDF],
  );

  const handleViewDetails = useCallback((record: Appointment) => {
    // This callback is required by the table columns interface
    // Currently not implemented - can be used to show appointment details
    console.log("View details for appointment:", record._id);
  }, []);

  // mountedRef is only accessed inside callbacks, not during render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const columns = createColumns({
    onEdit: openEdit,
    onDelete: handleDelete,
    onStatusChange: fetchAppointments,
    onViewDetails: handleViewDetails,
    onViewInvoice: handleViewInvoice,
  });

  const expandedRowRender = (record: Appointment) => {
    const isExpanded = expandedRowKeys.includes(record._id);
    return (
      <ExpandedRowContent
        record={record}
        isExpanded={isExpanded}
        onToggle={() => {
          setExpandedRowKeys(
            isExpanded
              ? expandedRowKeys.filter((key) => key !== record._id)
              : [...expandedRowKeys, record._id],
          );
        }}
      />
    );
  };

  const headerPadding = isMobile ? "20px 16px" : "24px 20px";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: isMobile ? "12px" : "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          padding: headerPadding,
          marginBottom: isMobile ? 16 : 24,
          borderRadius: isMobile ? 12 : 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "16px" : "0",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 20 : 24,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Appointment Management
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: isMobile ? 12 : 14,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Book and manage customer appointments
            </p>
          </div>
          <Button
            type="primary"
            size={isMobile ? "middle" : "large"}
            icon={<PlusOutlined />}
            onClick={() => setOpen(true)}
            style={{
              background: "#ffffff",
              color: "#2563eb",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Book Appointment
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div
        style={{
          background: "#fff",
          borderRadius: isMobile ? 12 : 16,
          padding: isMobile ? "12px" : "20px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          border: "1px solid #e2e8f0",
        }}
      >
        {loading ? (
          <div style={{ padding: "40px 0" }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : appointments.length === 0 ? (
          <div
            style={{
              padding: "80px 24px",
              textAlign: "center",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              border: "2px dashed #cbd5e1",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📋</div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 8px 0",
              }}
            >
              No Appointments Yet
            </h3>
            <p
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: "0 auto 24px",
                maxWidth: "480px",
                lineHeight: "1.6",
              }}
            >
              Start managing your dispatch operations by creating your first
              appointment. Book loads, track shipments, and generate invoices.
            </p>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setOpen(true)}
              size="large"
              style={{
                height: 44,
                padding: "0 28px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 8,
                backgroundColor: "#2563eb",
                borderColor: "#2563eb",
              }}
            >
              Create Your First Appointment
            </Button>
          </div>
        ) : (
          <Table
            dataSource={appointments}
            columns={columns}
            rowKey={(record) => record._id}
            loading={loading}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              size: "small",
              showSizeChanger: !isMobile,
              showTotal: (total) =>
                isMobile ? `${total} items` : `Total ${total} items`,
            }}
            size={isMobile ? "middle" : "small"}
            tableLayout="fixed"
            bordered={false}
            expandable={{
              expandedRowRender,
              onExpandedRowsChange: (expandedRows) => {
                setExpandedRowKeys(expandedRows as string[]);
              },
              expandedRowKeys,
            }}
            className="appointment-table"
            scroll={isMobile ? { x: "max-content" } : { x: undefined }}
            style={{
              fontSize: isMobile ? 12 : 13,
            }}
          />
        )}
      </div>

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
        width={isMobile ? "95vw" : 1100}
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

      {/* Invoice Viewer Modal */}
      <Modal
        title={
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
            📄 Invoice Preview
          </div>
        }
        open={invoiceModalOpen}
        onCancel={() => {
          setInvoiceModalOpen(false);
          if (invoiceUrl) {
            URL.revokeObjectURL(invoiceUrl);
            setInvoiceUrl(null);
          }
        }}
        footer={
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "flex-end",
            }}
          >
            <Button
              size={isMobile ? "middle" : "large"}
              onClick={() => {
                setInvoiceModalOpen(false);
                if (invoiceUrl) {
                  URL.revokeObjectURL(invoiceUrl);
                  setInvoiceUrl(null);
                }
              }}
              style={{ borderRadius: "6px" }}
            >
              Close
            </Button>
            {selectedAppointment && (
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size={isMobile ? "middle" : "large"}
                onClick={() => handleDownloadPDF(selectedAppointment._id)}
                style={{
                  background: "#2563eb",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                Download PDF
              </Button>
            )}
          </div>
        }
        width={isMobile ? "100%" : 900}
        centered
        style={{
          maxWidth: "95vw",
          top: isMobile ? 0 : 20,
          padding: isMobile ? "8px" : "16px",
        }}
        styles={{
          body: {
            padding: isMobile ? "8px" : "16px",
          },
        }}
      >
        <div
          style={{
            height: isMobile ? "calc(100vh - 140px)" : "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
          }}
        >
          {invoiceUrl ? (
            <iframe
              src={invoiceUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "8px",
              }}
              title="Invoice PDF"
            />
          ) : (
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <p>Loading invoice...</p>
            </div>
          )}
        </div>
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
        width={isMobile ? "95vw" : 1100}
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
