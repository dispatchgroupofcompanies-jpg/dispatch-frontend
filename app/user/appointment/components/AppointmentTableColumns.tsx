"use client";

import React from "react";
import {
  Button,
  Space,
  Tag,
  Popconfirm,
  Select,
  message,
  Spin,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  updateAppointmentStatus,
  type Appointment,
} from "../lib/appointmentApi";

interface AppointmentTableColumnsProps {
  onEdit: (record: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
  onViewDetails: (record: Appointment) => void;
  onViewInvoice: (record: Appointment) => void | Promise<void>;
}

const renderText = (text?: string | number) => text || "—";

export const createColumns = ({
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
  onViewInvoice,
}: AppointmentTableColumnsProps) => [
  {
    title: "Carrier Name",
    dataIndex: "carrierName",
    key: "carrierName",
    width: 150,
    render: (name: string) => (
      <strong
        style={{
          color: "#1e40af",
          fontSize: "13px",
          fontWeight: 600,
        }}
      >
        {renderText(name)}
      </strong>
    ),
    onHeaderCell: () => ({
      style: {
        background: "#1e3a8a",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 12px",
      },
    }),
  },
  {
    title: "Trip / Shipment",
    key: "tripShipment",
    width: 180,
    render: (_: unknown, record: Appointment) => (
      <div style={{ fontSize: "12px", lineHeight: "1.4" }}>
        <div style={{ color: "#1e293b", fontWeight: 500 }}>
          <span style={{ color: "#64748b" }}>T:</span>{" "}
          {renderText(record.tripNumber)}
        </div>
        <div style={{ color: "#1e293b", fontWeight: 500 }}>
          <span style={{ color: "#64748b" }}>L:</span>{" "}
          {renderText(record.loadConfirmationNumber)}
        </div>
      </div>
    ),
    onHeaderCell: () => ({
      style: {
        background: "#1e3a8a",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 12px",
      },
    }),
  },
  {
    title: "Timeline",
    key: "timelineDate",
    width: 140,
    render: (_: unknown, record: Appointment) => {
      const formatDate = (dateStr?: string) =>
        dateStr
          ? new Date(dateStr).toLocaleDateString("en-CA", {
              month: "short",
              day: "numeric",
            })
          : "—";

      return (
        <div
          style={{
            color: "#1e293b",
            fontSize: "12px",
            lineHeight: "1.5",
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{ color: "#059669", fontWeight: 700, fontSize: "12px" }}
            >
              ↑
            </span>
            <span>{formatDate(record.pickupDate)}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span
              style={{ color: "#dc2626", fontWeight: 700, fontSize: "12px" }}
            >
              ↓
            </span>
            <span>{formatDate(record.deliveryDate)}</span>
          </div>
        </div>
      );
    },
    onHeaderCell: () => ({
      style: {
        background: "#1e3a8a",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 12px",
      },
    }),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status: string, record: Appointment) => {
      const normalizedStatus = status?.toLowerCase() || "pending";
      const isConfirmed = normalizedStatus === "confirmed";
      const isUpdating = record.status === "confirming";

      return (
        <Select
          value={normalizedStatus}
          style={{ width: "100%" }}
          disabled={isConfirmed || isUpdating}
          onChange={async (value) => {
            if (value === "confirmed" && normalizedStatus === "pending") {
              try {
                message.loading({
                  content: "Confirming...",
                  key: "confirming",
                });
                await updateAppointmentStatus(record._id, value);
                message.success({
                  content: "Confirmed!",
                  key: "confirming",
                });
                onStatusChange();
              } catch (error) {
                console.error("Status sync failed:", error);
                message.error({
                  content: "Failed",
                  key: "confirming",
                });
              }
            } else {
              try {
                await updateAppointmentStatus(record._id, value);
                message.success(`Updated to ${value.toUpperCase()}`);
                onStatusChange();
              } catch (error) {
                console.error("Status sync failed:", error);
                message.error("Failed");
              }
            }
          }}
          options={[
            {
              value: "pending",
              label: isUpdating ? (
                <Spin size="small" style={{ color: "#f59e0b" }} />
              ) : (
                <Tag
                  color="warning"
                  style={{
                    margin: 0,
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "11px",
                  }}
                >
                  PENDING
                </Tag>
              ),
            },
            {
              value: "confirmed",
              label: (
                <Tag
                  color="processing"
                  style={{
                    margin: 0,
                    borderRadius: "4px",
                    fontWeight: 600,
                    fontSize: "11px",
                  }}
                >
                  CONFIRMED
                </Tag>
              ),
            },
          ]}
        />
      );
    },
    onHeaderCell: () => ({
      style: {
        background: "#1e3a8a",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 12px",
      },
    }),
  },
  {
    title: "Actions",
    key: "action",
    width: 140,
    align: "center" as const,
    render: (_: unknown, record: Appointment) => {
      const normalizedStatus = record.status?.toLowerCase() || "pending";
      const isConfirmed = normalizedStatus === "confirmed";

      return (
        <Space size={4}>
          <Tooltip title="View Invoice">
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => onViewInvoice(record)}
              style={{
                borderRadius: "4px",
                borderColor: "#10b981",
                color: "#10b981",
                padding: "4px 8px",
                height: "28px",
              }}
            />
          </Tooltip>

          <Tooltip title={isConfirmed ? "Cannot edit" : "Edit"}>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              disabled={isConfirmed}
              style={{
                background: isConfirmed ? undefined : "#2563eb",
                borderColor: isConfirmed ? undefined : "#2563eb",
                borderRadius: "4px",
                padding: "4px 8px",
                height: "28px",
              }}
            />
          </Tooltip>

          <Tooltip title={isConfirmed ? "Cannot delete" : "Delete"}>
            <Popconfirm
              title="Delete?"
              description="Delete this appointment?"
              onConfirm={() => onDelete(record._id)}
              okText="Yes"
              cancelText="No"
              disabled={isConfirmed}
              okButtonProps={{ danger: true, size: "small" }}
              cancelButtonProps={{ size: "small" }}
            >
              <Button
                danger
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                disabled={isConfirmed}
                style={{ borderRadius: "4px", padding: "4px" }}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      );
    },
    onHeaderCell: () => ({
      style: {
        background: "#1e3a8a",
        color: "#ffffff",
        fontWeight: 600,
        fontSize: "13px",
        padding: "8px 12px",
      },
    }),
  },
];
