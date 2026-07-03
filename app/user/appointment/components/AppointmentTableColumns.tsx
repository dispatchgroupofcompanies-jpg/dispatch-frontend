"use client";

import React from "react";
import { Button, Space, Tag, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { Appointment } from "../lib/appointmentApi";

interface AppointmentTableColumnsProps {
  onEdit: (record: Appointment) => void;
  onDelete: (id: string) => void;
}

// Safely handles displaying text or providing a clean placeholder dash
const renderText = (text?: string | number) => text || "—";

export const createColumns = ({
  onEdit,
  onDelete,
}: AppointmentTableColumnsProps) => [
  {
    title: "Carrier Name",
    dataIndex: "carrierName", // Updated to match your flat backend object schema
    key: "carrierName",
    render: (name: string) => (
      <strong style={{ color: "#1e293b" }}>{renderText(name)}</strong>
    ),
  },
  {
    title: "Trip / Shipment",
    key: "tripShipment",
    render: (_: unknown, record: Appointment) => (
      <div style={{ fontSize: "13px" }}>
        <div>
          <span style={{ color: "#64748b" }}>Trip:</span>{" "}
          {renderText(record.tripNumber)}
        </div>
        <div>
          <span style={{ color: "#64748b" }}>Load:</span>{" "}
          {renderText(record.loadConfirmationNumber)}
        </div>
      </div>
    ),
  },
  {
    title: "Timeline (Pickup / Delivery)",
    key: "timelineDate",
    width: 260,
    render: (_: unknown, record: Appointment) => {
      const formatDate = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toLocaleDateString() : "—";

      return (
        <div style={{ color: "#334155", fontSize: "13px", lineHeight: "1.5" }}>
          <div>
            <strong>Pick:</strong> {formatDate(record.pickupDate)}
          </div>
          <div>
            <strong>Del:</strong> {formatDate(record.deliveryDate)}
          </div>
        </div>
      );
    },
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 140,
    render: (status: string) => {
      const normalizedStatus = status?.toLowerCase() || "pending";
      const colorMap: Record<string, string> = {
        draft: "default",
        pending: "warning",
        confirmed: "processing",
        completed: "success",
        cancelled: "error",
      };

      return (
        <Tag
          color={colorMap[normalizedStatus]}
          style={{
            borderRadius: "4px",
            fontWeight: 600,
            padding: "2px 8px",
          }}
        >
          {normalizedStatus.toUpperCase()}
        </Tag>
      );
    },
  },
  {
    title: "Actions",
    key: "action",
    width: 130,
    align: "center" as const,
    render: (_: unknown, record: Appointment) => (
      <Space size="middle">
        <Button
          type="primary"
          size="middle"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
          style={{
            background: "#2563eb",
            borderColor: "#2563eb",
            borderRadius: "6px",
          }}
        />
        <Popconfirm
          title="Delete Appointment"
          description="Are you sure you want to delete this appointment?"
          onConfirm={() => onDelete(record._id)}
          okText="Delete"
          cancelText="Cancel"
          okButtonProps={{ danger: true, style: { borderRadius: "4px" } }}
          cancelButtonProps={{ style: { borderRadius: "4px" } }}
        >
          <Button
            danger
            type="text"
            size="middle"
            icon={<DeleteOutlined />}
            style={{ borderRadius: "6px" }}
          />
        </Popconfirm>
      </Space>
    ),
  },
];
