"use client";

import { Button, Tooltip, Space } from "antd";
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
import type { ColumnsType } from "antd/es/table";
import type { Appointment } from "../types";

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

interface CreateColumnsProps {
  onEdit: (record: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
  onViewDetails: (record: Appointment) => void;
  onViewInvoice: (record: Appointment) => void;
  isMobile: boolean;
  expandedRows: Set<string>;
  onToggleRowExpand: (recordId: string) => void;
}

export function createColumns({
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
  onViewInvoice,
  isMobile,
  expandedRows,
  onToggleRowExpand,
}: CreateColumnsProps): ColumnsType<Appointment> {
  const columns: ColumnsType<Appointment> = [
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
          return <span style={{ color: "#94a3b8" }}>N/A</span>;
        }
        return (
          <div>
            <div
              style={{
                fontWeight: 500,
                color: "#334155",
                fontSize: isMobile ? 12 : 13,
              }}
            >
              {user.name}
            </div>
            <div
              style={{
                color: "#94a3b8",
                fontSize: isMobile ? 10 : 11,
              }}
            >
              {user.email}
            </div>
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
      render: (_: unknown, record: Appointment) => (
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
              icon={<EyeOutlined />}
              onClick={() => onToggleRowExpand(record._id)}
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
              onClick={() => onViewInvoice(record)}
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

  return columns;
}
