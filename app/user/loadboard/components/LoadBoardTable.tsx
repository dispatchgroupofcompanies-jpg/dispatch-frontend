"use client";

import React from "react";
import { Button, Grid, Popconfirm, Select, Space, Table, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { LoadBoardRecord } from "../types";

const { useBreakpoint } = Grid;

interface Props {
  records: LoadBoardRecord[];
  loading: boolean;
  onViewRecord: (record: LoadBoardRecord) => void;
  onEditRecord: (record: LoadBoardRecord) => void;
  onDeleteRecord: (record: LoadBoardRecord) => void;
  onStatusChange: (
    record: LoadBoardRecord,
    field: "invoiceStatus" | "paymentStatus",
    value: "generated" | "paid" | "pending"
  ) => void;
}

const statusStyle = (value: string, type: "invoice" | "payment") => {
  const active = value === "generated" || value === "paid";
  return {
    width: "100%",
    color: active ? (type === "invoice" ? "#2563eb" : "#16a34a") : "#d97706",
    fontWeight: 600,
    background: active ? (type === "invoice" ? "#eff6ff" : "#f0fdf4") : "#fffbeb",
    borderColor: active ? (type === "invoice" ? "#bfdbfe" : "#bbf7d0") : "#fde68a",
    borderRadius: 6,
  };
};

export default function LoadBoardTable({
  records,
  loading,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
  onStatusChange,
}: Props) {
  const screens = useBreakpoint();
  const useCards = !screens.lg;

  const columns: ColumnsType<LoadBoardRecord> = [
    {
      title: "S.No",
      key: "serial",
      width: 60,
      render: (_v, _r, index) => (
        <span
          style={{
            fontWeight: 700,
            color: "#fff",
            background: "#10b981",
            padding: "4px 9px",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          #{index + 1}
        </span>
      ),
    },
    {
      title: "Pay To / Driver",
      dataIndex: "thirdPartyCarrierName",
      ellipsis: true,
      render: (value) => (
        <span style={{ fontWeight: 600, color: "#334155" }}>
          <UserOutlined style={{ marginRight: 6, color: "#2563eb" }} />
          {value || "—"}
        </span>
      ),
    },
    {
      title: "CAD",
      dataIndex: "tripCharges",
      width: 140,
      render: (value) => (
        <span style={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
          CAD ${Number(value || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Invoice",
      dataIndex: "invoiceStatus",
      width: 150,
      responsive: ["md"],
      render: (value, record) => (
        <Select
          size="small"
          value={value || "pending"}
          style={statusStyle(value || "pending", "invoice")}
          onChange={(next) => onStatusChange(record, "invoiceStatus", next)}
          options={[
            { value: "generated", label: "Generated" },
            { value: "pending", label: "Pending" },
          ]}
        />
      ),
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      width: 130,
      responsive: ["md"],
      render: (value, record) => (
        <Select
          size="small"
          value={value || "pending"}
          style={statusStyle(value || "pending", "payment")}
          onChange={(next) => onStatusChange(record, "paymentStatus", next)}
          options={[
            { value: "paid", label: "Paid" },
            { value: "pending", label: "Pending" },
          ]}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_v, record) => (
        <Space size={0}>
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onViewRecord(record)}
              style={{ color: "#2563eb" }}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEditRecord(record)} />
          </Tooltip>
          <Popconfirm
            title="Delete this dispatch record?"
            description="This also removes its screenshot."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => onDeleteRecord(record)}
          >
            <Tooltip title="Delete">
              <Button danger type="text" icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (useCards) {
    return (
      <div style={{ display: "grid", gap: 12, padding: 12 }}>
        {loading && (
          <div style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
            Loading dispatch records...
          </div>
        )}
        {!loading && records.length === 0 && (
          <div style={{ textAlign: "center", padding: 24, color: "#64748b" }}>
            No dispatch records found.
          </div>
        )}
        {records.map((record, index) => (
          <div
            key={record._id || `${record.thirdPartyCarrierName}-${record.date}`}
            style={{
              display: "grid",
              gap: 12,
              padding: 14,
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              boxShadow: "0 2px 6px rgba(15, 23, 42, 0.05)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr)",
                alignItems: "center",
                gap: 10,
                paddingBottom: 10,
                borderBottom: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  color: "#fff",
                  background: "#10b981",
                  padding: "4px 9px",
                  borderRadius: 6,
                }}
              >
                #{index + 1}
              </span>
              <span
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <UserOutlined style={{ marginRight: 6, color: "#2563eb" }} />
                {record.thirdPartyCarrierName || "—"}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
              <div style={{ fontSize: 11, color: "#64748b" }}>CAD Amount</div>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 15 }}>
                CAD ${Number(record.tripCharges || 0).toLocaleString()}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Select
                size="small"
                value={record.invoiceStatus || "pending"}
                style={statusStyle(record.invoiceStatus || "pending", "invoice")}
                onChange={(value) => onStatusChange(record, "invoiceStatus", value)}
                options={[
                  { value: "generated", label: "Invoice Generated" },
                  { value: "pending", label: "Invoice Pending" },
                ]}
              />
              <Select
                size="small"
                value={record.paymentStatus || "pending"}
                style={statusStyle(record.paymentStatus || "pending", "payment")}
                onChange={(value) => onStatusChange(record, "paymentStatus", value)}
                options={[
                  { value: "paid", label: "Paid" },
                  { value: "pending", label: "Pending" },
                ]}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onViewRecord(record)}
                style={{ color: "#2563eb" }}
              >
                View
              </Button>
              <Button size="small" icon={<EditOutlined />} onClick={() => onEditRecord(record)}>
                Edit
              </Button>
              <Popconfirm
                title="Delete this dispatch record?"
                description="This also removes its screenshot."
                okText="Delete"
                okButtonProps={{ danger: true }}
                onConfirm={() => onDeleteRecord(record)}
              >
                <Button danger size="small" icon={<DeleteOutlined />} style={{ width: "100%" }}>
                  Delete
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={records}
      loading={loading}
      rowKey={(record) => record._id || `${record.thirdPartyCarrierName}-${record.date}`}
      pagination={{ pageSize: 10, showSizeChanger: false }}
      size="middle"
    />
  );
}