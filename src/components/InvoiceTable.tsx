"use client";
import React from "react";
import { Table, Tag, Button, Typography, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
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
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Payee (Vendor)",
      dataIndex: ["payee", "companyName"],
      key: "payeeCompany",
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 160,
      render: (amount, record) => (
        <Text strong>
          {amount?.toFixed(2)} {record.currency || "CAD"}
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
      width: 160,
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          type="primary"
          onClick={() => onView(record)}
        >
          View Invoice
        </Button>
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
