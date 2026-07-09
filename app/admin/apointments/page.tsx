"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  Spin,
  Alert,
  Tag,
  Modal,
  message,
  Button,
  Space,
  Tooltip,
  Grid,
  Typography,
} from "antd";

const { Text } = Typography;
import type { Breakpoint } from "antd/es/_util/responsiveObserver";
import type { ColumnsType } from "antd/es/table";
import {
  TruckOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  FileTextOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import {
  getAllAppointments,
  getInvoiceById,
  downloadInvoice,
  downloadAppointmentPDF,
} from "../../../src/services/adminService";
import type { Appointment } from "../../../src/types/invoice";

type AppointmentRecord = Appointment;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FAEEDA", text: "#854F0B" },
  approved: { bg: "#EAF3DE", text: "#3B6D11" },
  rejected: { bg: "#FCEBEB", text: "#A32D2D" },
  completed: { bg: "#E6F1FB", text: "#185FA5" },
};

const StatusPill = ({ status }: { status: string }) => {
  const style = statusStyles[status] || { bg: "#F1EFE8", text: "#5F5E5A" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        textTransform: "capitalize",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
  isMobile,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  isMobile: boolean;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: isMobile ? "6px 0" : "8px 0",
    }}
  >
    <div
      style={{
        color: "#94a3b8",
        fontSize: isMobile ? 14 : 15,
        marginTop: 2,
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: isMobile ? 10 : 11,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          fontWeight: 600,
          marginBottom: 2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: isMobile ? 12 : 13,
          color: "#1e293b",
          fontWeight: 500,
          wordBreak: "break-word",
          lineHeight: 1.4,
        }}
      >
        {value || "-"}
      </div>
    </div>
  </div>
);

const SectionCard = ({
  title,
  icon,
  color,
  children,
  isMobile,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
  isMobile: boolean;
}) => (
  <div
    style={{
      background: "#fff",
      border: `1px solid ${color}20`,
      borderRadius: 16,
      padding: isMobile ? "14px 16px" : "18px 20px",
      flex: "1 1 260px",
      minWidth: 240,
      boxShadow: `0 2px 8px ${color}10`,
      transition: "all 0.3s ease",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 12,
        paddingBottom: 12,
        borderBottom: `1px solid ${color}15`,
      }}
    >
      <div
        style={{
          width: isMobile ? 32 : 36,
          height: isMobile ? 32 : 36,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: isMobile ? 16 : 18,
          flexShrink: 0,
          boxShadow: `0 2px 4px ${color}30`,
        }}
      >
        {icon}
      </div>
      <span
        style={{
          fontSize: isMobile ? 13 : 14,
          fontWeight: 700,
          color: "#1e293b",
          letterSpacing: "-0.2px",
        }}
      >
        {title}
      </span>
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {children}
    </div>
  </div>
);

const AppointmentRecords = () => {
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

  const columns: ColumnsType<AppointmentRecord> = [
    {
      title: "Trip / shipment",
      key: "trip",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 8 : 10,
          }}
        >
          <div
            style={{
              width: isMobile ? 30 : 34,
              height: isMobile ? 30 : 34,
              borderRadius: 8,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              flexShrink: 0,
            }}
          >
            <TruckOutlined style={{ fontSize: isMobile ? 12 : 14 }} />
          </div>
          <div>
            <div
              style={{
                fontWeight: 600,
                fontSize: isMobile ? 12 : 13,
                color: "#0f172a",
              }}
            >
              Trip {record.tripNumber}
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: isMobile ? 11 : 12,
              }}
            >
              Load {record.loadConfirmationNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Carrier",
      dataIndex: "carrierName",
      key: "carrierName",
      responsive: ["md"],
      render: (val: string) => (
        <span
          style={{
            fontSize: isMobile ? 12 : 13,
            color: "#334155",
          }}
        >
          {val}
        </span>
      ),
    },
    {
      title: "Timeline",
      key: "timeline",
      responsive: ["sm"],
      render: (_, record) => (
        <div
          style={{
            fontSize: isMobile ? 11 : 12,
            color: "#334155",
          }}
        >
          <div>
            <span style={{ color: "#94a3b8" }}>↑</span>{" "}
            {formatDate(record.pickupDate)}
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>↓</span>{" "}
            {formatDate(record.deliveryDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Created By",
      key: "createdByUser",
      width: isMobile ? 150 : 200,
      responsive: ["md"],
      render: (_, record) => {
        const user = record.createdByUser;
        if (!user) {
          return <Text type="secondary">N/A</Text>;
        }
        return (
          <div>
            <Text
              style={{
                fontWeight: 500,
                color: "#334155",
                fontSize: isMobile ? 12 : 13,
                display: "block",
              }}
            >
              {user.name}
            </Text>
            <Text
              type="secondary"
              style={{
                fontSize: isMobile ? 10 : 11,
                display: "block",
              }}
            >
              {user.email}
            </Text>
          </div>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <StatusPill status={status} />,
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 120 : 150,
      align: "center" as const,
      render: (_: unknown, record: AppointmentRecord) => (
        <Space size={isMobile ? "small" : "middle"}>
          <Tooltip
            title={
              expandedRows.has(record._id) ? "Hide Details" : "View Details"
            }
            placement="top"
          >
            <Button
              type="default"
              size={isMobile ? "small" : "middle"}
              icon={
                expandedRows.has(record._id) ? <EyeOutlined /> : <EyeOutlined />
              }
              onClick={() => toggleRowExpand(record._id)}
              style={{
                borderRadius: "6px",
                borderColor: expandedRows.has(record._id)
                  ? "#ef4444"
                  : "#2563eb",
                color: expandedRows.has(record._id) ? "#ef4444" : "#2563eb",
                height: isMobile ? "26px" : "28px",
                padding: isMobile ? "0 6px" : "0 8px",
                background: expandedRows.has(record._id)
                  ? "#fef2f2"
                  : "#eff6ff",
              }}
            >
              {expandedRows.has(record._id) ? "Hide" : "Details"}
            </Button>
          </Tooltip>
          <Tooltip title="View Invoice" placement="top">
            <Button
              type="default"
              size={isMobile ? "small" : "middle"}
              icon={<FileTextOutlined />}
              onClick={() => handleViewInvoice(record)}
              style={{
                borderRadius: "6px",
                borderColor: "#10b981",
                color: "#10b981",
                height: isMobile ? "26px" : "28px",
                padding: isMobile ? "0 6px" : "0 8px",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const expandedRowRender = (record: AppointmentRecord) => (
    <div
      style={{
        padding: isMobile ? "12px" : "16px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        marginTop: "8px",
      }}
    >
      {/* Carrier Section */}
      <div style={{ marginBottom: isMobile ? 16 : 20 }}>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #2563eb",
          }}
        >
          🚛 Carrier Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Equipment / Pro #
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.equipmentType} · {record.carrierProNumber}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Phone
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.carrierPhone}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Email
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.carrierEmail}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Address
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.carrierAddress}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Driver Cell
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.driverCellNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Shipper Section */}
      <div style={{ marginBottom: isMobile ? 16 : 20 }}>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#16a34a",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #16a34a",
          }}
        >
          📦 Shipper Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Name
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.shipperName}
            </div>
          </div>
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Address
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.shipperAddress}, {record.shipperCity},{" "}
              {record.shipperProvince} {record.shipperPostalCode}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Pickup # / Window
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.pickupNumber} · {record.pickupTimeStart}-
              {record.pickupTimeEnd}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Commodity
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.commodityDescription}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Weight
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.weight?.toLocaleString()} lbs
            </div>
          </div>
        </div>
      </div>

      {/* Consignee Section */}
      <div style={{ marginBottom: isMobile ? 16 : 20 }}>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#d97706",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #d97706",
          }}
        >
          📍 Consignee Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Name
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.consigneeName}
            </div>
          </div>
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Address
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.consigneeAddress}, {record.consigneeCity},{" "}
              {record.consigneeProvince} {record.consigneePostalCode}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Drop-off # / Time
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.dropOffNumber} · {record.deliveryTime}
            </div>
          </div>
        </div>
      </div>

      {/* Charges Section */}
      <div>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#7c3aed",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #7c3aed",
          }}
        >
          💰 Charges & Payment
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Description
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.chargeDescription}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Rate
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.currency} {record.rateAmount?.toLocaleString()}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: 16,
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              {record.currency} {record.totalAmount?.toLocaleString()}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Signature
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.signature} · {formatDate(record.signatureDate)}
            </div>
          </div>
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Notes
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.notesTerms}
            </div>
          </div>
        </div>
      </div>
    </div>
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
              size="large"
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
                size="large"
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
        width={900}
        centered
        style={{ maxWidth: "95vw" }}
      >
        <div
          style={{
            height: "70vh",
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
};

export default AppointmentRecords;
