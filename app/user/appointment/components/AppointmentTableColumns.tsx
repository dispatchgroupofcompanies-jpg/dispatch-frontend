"use client";

import React from "react";
import { Button, Space, Tag, Popconfirm, Select, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  updateAppointmentStatus,
  type Appointment,
} from "../lib/appointmentApi";

interface AppointmentTableColumnsProps {
  onEdit: (record: Appointment) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}

const renderText = (text?: string | number) => text || "—";

export const createColumns = ({
  onEdit,
  onDelete,
  onStatusChange,
}: AppointmentTableColumnsProps) => [
  {
    title: "Carrier Name",
    dataIndex: "carrierName",
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
    width: 180,
    render: (status: string, record: Appointment) => {
      const normalizedStatus = status?.toLowerCase() || "pending";

      // Lock Logic: Agar status confirmed hai toh select dropdown block ho jayega
      const isConfirmed = normalizedStatus === "confirmed";

      return (
        <Select
          value={normalizedStatus}
          style={{ width: "100%" }}
          disabled={isConfirmed}
          onChange={async (value) => {
            try {
              await updateAppointmentStatus(record._id, value);
              message.success(
                `Status updated to ${value.toUpperCase()} successfully`,
              );
              onStatusChange();
            } catch (error) {
              console.error("Status sync failed:", error);
              message.error("Failed to update status");
            }
          }}
          options={[
            {
              value: "pending",
              label: (
                <Tag
                  color="warning"
                  style={{ margin: 0, borderRadius: "4px", fontWeight: 600 }}
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
                  style={{ margin: 0, borderRadius: "4px", fontWeight: 600 }}
                >
                  CONFIRMED
                </Tag>
              ),
            },
          ]}
        />
      );
    },
  },
  {
    title: "Actions",
    key: "action",
    width: 130,
    align: "center" as const,
    render: (_: unknown, record: Appointment) => {
      const normalizedStatus = record.status?.toLowerCase() || "pending";
      const isConfirmed = normalizedStatus === "confirmed";

      return (
        <Space size="middle">
          {/* EDIT BUTTON */}
          <Button
            type="primary"
            size="middle"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            disabled={isConfirmed}
            style={{
              background: isConfirmed ? undefined : "#2563eb",
              borderColor: isConfirmed ? undefined : "#2563eb",
              borderRadius: "6px",
            }}
          />

          {/* DELETE BUTTON */}
          <Popconfirm
            title="Delete Appointment"
            description="Are you sure you want to delete this appointment?"
            onConfirm={() => onDelete(record._id)}
            okText="Delete"
            cancelText="Cancel"
            disabled={isConfirmed}
            okButtonProps={{ danger: true, style: { borderRadius: "4px" } }}
            cancelButtonProps={{ style: { borderRadius: "4px" } }}
          >
            <Button
              danger
              type="text"
              size="middle"
              icon={<DeleteOutlined />}
              disabled={isConfirmed}
              style={{ borderRadius: "6px" }}
            />
          </Popconfirm>
        </Space>
      );
    },
  },
];
