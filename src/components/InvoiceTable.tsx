"use client";
import React from "react";
import { Table, Tag, Button, Typography, Spin, Space, Tooltip } from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { Invoice } from "../types/invoice";

const { Text } = Typography;

interface Props {
  invoices: Invoice[];
  loading: boolean;
  onView: (inv: Invoice) => void;
}

export default function InvoiceTable({ invoices, loading, onView }: Props) {
  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 140,
      render: (text) => (
        <Text
          strong
          style={{
            color: "#ffffff",
            background: "#10b981",
            padding: "4px 10px",
            borderRadius: "6px",
            display: "inline-block",
          }}
        >
          #{text}
        </Text>
      ),
    },
    {
      title: "Payee (Vendor)",
      dataIndex: ["payee", "companyName"],
      key: "payeeCompany",
      render: (text) => (
        <Text style={{ fontWeight: 500, color: "#334155" }}>
          {text || "N/A"}
        </Text>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 160,
      render: (amount, record) => (
        <Text strong style={{ color: "#0f172a" }}>
          {record.currency || "CAD"} $
          {amount?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      width: 140,
      render: (status) => {
        const colorMap: Record<string, string> = {
          draft: "default",
          pending: "warning",
          approved: "success",
          paid: "processing",
          rejected: "error",
        };
        return (
          <Tag color={colorMap[status] || "default"}>
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 260,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => onView(record)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <Table
        columns={columns}
        dataSource={invoices}
        rowKey={(r) => r._id}
        pagination={{ pageSize: 10 }}
      />
    </Spin>
  );
}
