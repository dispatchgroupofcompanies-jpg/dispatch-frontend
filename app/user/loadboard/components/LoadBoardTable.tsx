"use client";

import React from "react";
import { Button, Grid, Popconfirm, Space, Table, Tooltip } from "antd";
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
}

export default function LoadBoardTable({
  records,
  loading,
  onViewRecord,
  onEditRecord,
  onDeleteRecord,
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
      title: "Driver",
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
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_v, record) => {
        const isInvoiceGenerated = record.invoiceStatus === "generated";
        return (
          <Space size={0}>
            <Tooltip title="View">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => onViewRecord(record)}
                style={{ color: "#2563eb" }}
              />
            </Tooltip>
            <Tooltip title={isInvoiceGenerated ? "Cannot edit when invoice is generated" : "Edit"}>
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => onEditRecord(record)}
                disabled={isInvoiceGenerated}
                style={{ color: isInvoiceGenerated ? "#cbd5e1" : "#374151" }}
              />
            </Tooltip>
            <Popconfirm
              title="Delete this dispatch record?"
              description="This also removes its screenshot."
              okText="Delete"
              okButtonProps={{ danger: true }}
              onConfirm={() => onDeleteRecord(record)}
              disabled={isInvoiceGenerated}
            >
              <Tooltip title={isInvoiceGenerated ? "Cannot delete when invoice is generated" : "Delete"}>
                <Button
                  danger
                  type="text"
                  icon={<DeleteOutlined />}
                  disabled={isInvoiceGenerated}
                  style={{ color: isInvoiceGenerated ? "#cbd5e1" : "#ef4444" }}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
              <Button
                size="small"
                icon={<EyeOutlined />}
                onClick={() => onViewRecord(record)}
                style={{ color: "#2563eb" }}
              >
                View
              </Button>
              <Tooltip title={record.invoiceStatus === "generated" ? "Cannot edit when invoice is generated" : ""}>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => onEditRecord(record)}
                  disabled={record.invoiceStatus === "generated"}
                  style={{
                    color: record.invoiceStatus === "generated" ? "#cbd5e1" : "#374151",
                  }}
                >
                  Edit
                </Button>
              </Tooltip>
              <Popconfirm
                title="Delete this dispatch record?"
                description="This also removes its screenshot."
                okText="Delete"
                okButtonProps={{ danger: true }}
                onConfirm={() => onDeleteRecord(record)}
                disabled={record.invoiceStatus === "generated"}
              >
                <Tooltip title={record.invoiceStatus === "generated" ? "Cannot delete when invoice is generated" : ""}>
                  <Button
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    disabled={record.invoiceStatus === "generated"}
                    style={{
                      width: "100%",
                      color: record.invoiceStatus === "generated" ? "#cbd5e1" : "#ef4444",
                    }}
                  >
                    Delete
                  </Button>
                </Tooltip>
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