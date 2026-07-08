"use client";
import React from "react";
import {
  Table,
  Tag,
  Button,
  Typography,
  Spin,
  Space,
  Tooltip,
  Grid,
} from "antd";
import {
  EyeOutlined,
  DownloadOutlined,
  ShareAltOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { downloadInvoicePDF } from "../../modules/invoice/route";
import type { ColumnsType } from "antd/es/table";
import type { Invoice } from "../types/invoice";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface Props {
  invoices: Invoice[];
  loading: boolean;
  onView: (inv: Invoice) => void;
  isAdmin?: boolean;
}

const handleDownload = async (
  invoiceId: string,
  invoiceNumber: string,
  isAdmin: boolean = false,
) => {
  try {
    const response = await downloadInvoicePDF(invoiceId, isAdmin);

    // Handle both blob and JSON responses
    if (response.data instanceof Blob) {
      // Blob response - create download link
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else if (response.data?.pdfUrl) {
      // JSON response with URL - open in new tab
      window.open(response.data.pdfUrl, "_blank");
    }
  } catch (error) {
    console.error("Error downloading invoice:", error);
    alert("Failed to download invoice. Please try again.");
  }
};

export default function InvoiceTable({
  invoices,
  loading,
  onView,
  isAdmin = false,
}: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: isMobile ? 100 : 140,
      render: (text) => (
        <Text
          strong
          style={{
            color: "#ffffff",
            background: "#10b981",
            padding: isMobile ? "2px 8px" : "4px 10px",
            borderRadius: "6px",
            display: "inline-block",
            fontSize: isMobile ? 11 : 12,
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
      responsive: ["md"],
      render: (text) => (
        <Text
          style={{
            fontWeight: 500,
            color: "#334155",
            fontSize: isMobile ? 12 : 13,
          }}
        >
          {text || "N/A"}
        </Text>
      ),
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: isMobile ? 120 : 160,
      render: (amount, record) => (
        <Text strong style={{ color: "#0f172a", fontSize: isMobile ? 12 : 13 }}>
          {record.currency || "CAD"} $
          {amount?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </Text>
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
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      width: isMobile ? 100 : 140,
      render: (status) => {
        const colorMap: Record<string, string> = {
          draft: "default",
          pending: "warning",
          approved: "success",
          paid: "processing",
          rejected: "error",
        };
        return (
          <Tag
            color={colorMap[status] || "default"}
            style={{ fontSize: isMobile ? 11 : 12 }}
          >
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 80 : 120,
      align: "center" as const,
      render: (_, record) => (
        <Space size={isMobile ? "small" : "middle"}>
          <Tooltip title="Download PDF" placement="top">
            <Button
              type="primary"
              size={isMobile ? "small" : "middle"}
              icon={<DownloadOutlined />}
              onClick={() =>
                handleDownload(record._id, record.invoiceNumber, isAdmin)
              }
              style={{
                borderRadius: "6px",
                backgroundColor: "#102a63",
                borderColor: "#102a63",
              }}
            >
              {isMobile ? "" : "Download"}
            </Button>
          </Tooltip>
          <Tooltip title="View Invoice" placement="top">
            <Button
              type="primary"
              size={isMobile ? "small" : "middle"}
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              style={{ borderRadius: "6px" }}
            >
              {isMobile ? "" : "View"}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={loading}>
      <div
        style={{
          background: "#fff",
          borderRadius: isMobile ? 8 : 12,
          overflow: "hidden",
          padding: isMobile ? "8px" : "16px",
        }}
      >
        <Table
          columns={columns}
          dataSource={invoices}
          rowKey={(r) => r._id}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            size: "small",
            showSizeChanger: !isMobile,
            showTotal: (total) =>
              isMobile ? `${total} items` : `Total ${total} items`,
          }}
          size="small"
          scroll={isMobile ? { x: "max-content" } : { x: undefined }}
          style={{ fontSize: isMobile ? 12 : 13 }}
          components={{
            body: {
              cell: (props) => (
                <td
                  {...props}
                  style={{
                    ...props.style,
                    padding: isMobile ? "8px 12px" : "12px 16px",
                  }}
                />
              ),
            },
          }}
        />
      </div>
    </Spin>
  );
}
