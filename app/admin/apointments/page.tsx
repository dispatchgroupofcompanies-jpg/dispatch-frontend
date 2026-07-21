"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Spin,
  Alert,
  Modal,
  message,
  Button,
  Space,
  Typography,
  Card,
  Skeleton,
  Grid,
} from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { Breakpoint } from "antd/es/_util/responsiveObserver";
import {
  getAllAppointments,
  getInvoiceById,
  downloadInvoice,
  downloadAppointmentPDF,
} from "../../../src/services/adminService";
import type { Appointment } from "./types";
import { createColumns } from "./components/AppointmentTableColumns";
import AppointmentExpandedRow from "./components/AppointmentExpandedRow";

const { Text } = Typography;

type AppointmentRecord = Appointment;

export default function AppointmentRecords() {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentRecord | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpand = (recordId: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(recordId)) {
        newSet.delete(recordId);
      } else {
        newSet.add(recordId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllAppointments();
        if (isMounted) {
          setAppointments(response.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch appointments.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Total loads",
      value: appointments.length,
      color: "#eff6ff",
      accent: "#2563eb",
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
      color: "#fff7ed",
      accent: "#d97706",
    },
    {
      label: "Total value",
      value: `$${appointments.reduce((s, a) => s + (a.totalAmount || 0), 0).toLocaleString()}`,
      color: "#f0fdf4",
      accent: "#16a34a",
    },
  ];

  const handleViewInvoice = useCallback(
    async (record: AppointmentRecord) => {
      try {
        message.loading({
          content: "Loading invoice preview...",
          key: "invoice-loading",
        });

        const blob = await downloadAppointmentPDF(record._id);
        const url = window.URL.createObjectURL(blob);
        setInvoiceUrl(url);
        setInvoiceModalOpen(true);
        setSelectedAppointment(record);

        message.destroy("invoice-loading");
      } catch (err) {
        console.error(err);
        message.destroy("invoice-loading");
        message.error("Failed to load invoice");
      }
    },
    [downloadAppointmentPDF],
  );

  const handleDownloadPDF = useCallback(
    async (id: string) => {
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
    },
    [downloadAppointmentPDF],
  );

  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  const containerPadding = isMobile ? "12px" : isTablet ? "16px" : "24px";
  const headerPadding = isMobile ? "20px 16px" : "24px 20px";
  const cardPadding = isMobile ? "12px 14px" : "16px 18px";

  const columns = createColumns({
    onEdit: () => {},
    onDelete: () => {},
    onStatusChange: () => {},
    onViewDetails: () => {},
    onViewInvoice: handleViewInvoice,
    isMobile,
    expandedRows,
    onToggleRowExpand: toggleRowExpand,
  });

  const expandedRowRender = (record: AppointmentRecord) => (
    <AppointmentExpandedRow record={record} isMobile={isMobile} />
  );

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: containerPadding,
        minHeight: "calc(100vh - 80px)",
        background: "#f8fafc",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
          padding: headerPadding,
          marginBottom: isMobile ? 16 : 24,
          borderRadius: isMobile ? 12 : 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
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
            Appointment records
          </h2>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: isMobile ? 12 : 14,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            All booked trips and shipments
          </p>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile
            ? "1fr"
            : isTablet
              ? "repeat(auto-fit, minmax(200px, 1fr))"
              : "repeat(3, 1fr)",
          gap: isMobile ? 10 : 12,
          marginBottom: isMobile ? 16 : 20,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.color,
              borderRadius: 12,
              padding: cardPadding,
              border: `1px solid ${s.accent}15`,
            }}
          >
            <div
              style={{
                fontSize: isMobile ? 10 : 11,
                color: s.accent,
                fontWeight: 600,
                marginBottom: isMobile ? 4 : 6,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: isMobile ? 18 : 20,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          style={{ marginBottom: isMobile ? 12 : 16, borderRadius: 12 }}
        />
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: isMobile ? 10 : 12,
          border: "1px solid #eef0f3",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          padding: isMobile ? "8px" : "16px",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: isMobile ? 30 : 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey={(record) => record._id}
            pagination={{
              pageSize: isMobile ? 5 : 10,
              size: "small",
              showSizeChanger: !isMobile,
              showTotal: (total) =>
                isMobile ? `${total} items` : `Total ${total} items`,
            }}
            size={isMobile ? "middle" : "small"}
            expandable={{
              expandedRowRender,
              expandedRowKeys: Array.from(expandedRows),
              onExpandedRowsChange: (keys) => {
                setExpandedRows(new Set(keys as string[]));
              },
              rowExpandable: () => true,
            }}
            scroll={isMobile ? { x: "max-content" } : { x: undefined }}
            style={{
              fontSize: isMobile ? 12 : 13,
            }}
          />
        )}
      </div>

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
    </div>
  );
}
