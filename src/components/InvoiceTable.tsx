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
  message,
} from "antd";
import { EyeOutlined, DownloadOutlined, MessageOutlined } from "@ant-design/icons";
import { downloadInvoicePDF } from "../../modules/invoice/route";
import type { ColumnsType } from "antd/es/table";
import type { Invoice } from "../types/invoice";
import { getPayeeSerialNumbers } from "../utils/invoiceSerial";

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

    // Axios returns fallback JSON as a Blob too when responseType is "blob".
    // Only save a response when it is a real PDF; otherwise extract the
    // Cloudinary URL returned by the API and open that instead.
    const contentType = String(response.headers?.["content-type"] ?? "");
    const isPdf =
      response.data instanceof Blob &&
      (contentType.includes("application/pdf") ||
        response.data.type.includes("application/pdf"));

    if (isPdf) {
      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      return;
    }

    const fallback =
      response.data instanceof Blob
        ? JSON.parse(await response.data.text())
        : response.data;

    if (fallback?.pdfUrl) {
      // Do not use window.open here: browsers can block it because this runs
      // after the asynchronous API request. Direct navigation is not blocked
      // and Cloudinary serves the valid PDF to the browser.
      window.location.assign(fallback.pdfUrl);
      return;
    }

    throw new Error("The server did not return a PDF file.");
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
  const payeeSerialNumbers = React.useMemo(
    () => getPayeeSerialNumbers(invoices),
    [invoices],
  );
  const [downloadingInvoiceId, setDownloadingInvoiceId] = React.useState<string | null>(null);

  const sendToWhatsApp = (record: Invoice) => {
    const recipient = record.payee?.phone?.replace(/\D/g, "");
    if (!recipient) {
      message.warning("This invoice has no Payee Phone number.");
      return;
    }

    const serialNumber = payeeSerialNumbers.get(record._id) || 1;
    const amount = Number(record.grandTotal || 0).toLocaleString("en-CA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const text = `Hello,\n\nThis is an invoice from +91 9596523404.\nInvoice #${serialNumber}\nAmount: ${record.currency || "CAD"} $${amount}`;
    window.open(
      `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const downloadInvoice = async (record: Invoice) => {
    setDownloadingInvoiceId(record._id);
    try {
      await handleDownload(record._id, record.invoiceNumber, isAdmin);
    } finally {
      setDownloadingInvoiceId(null);
    }
  };

  const renderIdSummary = (
    values: Array<string | undefined>,
    emptyLabel = "-",
    tone: "neutral" | "blue" = "neutral",
  ) => {
    const uniqueValues = [...new Set(values.filter(Boolean) as string[])];
    if (!uniqueValues.length) return <Text type="secondary">{emptyLabel}</Text>;

    const firstValue = uniqueValues[0];
    const remainingCount = uniqueValues.length - 1;
    const palette = tone === "blue"
      ? { background: "#dbeafe", color: "#2563eb" }
      : { background: "#f1f5f9", color: "#334155" };

    return (
      <Tooltip title={uniqueValues.join(", ")} placement="top">
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, maxWidth: "100%" }}>
          <span
            style={{
              ...palette,
              padding: "3px 6px",
              borderRadius: 4,
              fontSize: isMobile ? 9 : 10,
              maxWidth: isMobile ? 70 : 92,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {firstValue}
          </span>
          {remainingCount > 0 && (
            <span style={{ color: "#64748b", fontSize: isMobile ? 9 : 10, whiteSpace: "nowrap" }}>
              +{remainingCount}
            </span>
          )}
        </div>
      </Tooltip>
    );
  };

  const columns: ColumnsType<Invoice> = [
    {
      title: "Invoice #",
      key: "invoiceNumber",
      width: isMobile ? 62 : 100,
      fixed: isMobile ? "left" : undefined,
      render: (_, record) => {
        const serialNumber = payeeSerialNumbers.get(record._id) || 1;
        return (
          <Text
            strong
            style={{
              color: "#ffffff",
              background: "#10b981",
              padding: isMobile ? "2px 5px" : "2px 8px",
              borderRadius: "4px",
              display: "inline-block",
              fontSize: isMobile ? 9 : 11,
              whiteSpace: "nowrap",
              lineHeight: "16px",
            }}
          >
            #{serialNumber}
          </Text>
        );
      },
    },
    {
      title: "VRID",
      key: "vrid",
      width: isMobile ? 92 : 150,
      render: (_, record) => {
        const vrids = record.trips?.map((t) => t.vrid).filter(Boolean) || [];
        return renderIdSummary(vrids);
      },
    },
    {
      title: "Load ID",
      key: "loadId",
      width: isMobile ? 90 : 120,
      responsive: ["md"],
      render: (_, record) => {
        const loadIds =
          record.trips
            ?.map((t) =>
              t.loadId2 ? `${t.loadId1 || ""}/${t.loadId2}` : t.loadId1,
            )
            .filter(Boolean) || [];
        return renderIdSummary(loadIds, "-", "blue");
      },
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: isMobile ? 92 : 120,
      render: (amount, record) => (
        <Text
          strong
          style={{
            color: "#0f172a",
            fontSize: isMobile ? 11 : 13,
            whiteSpace: "nowrap",
          }}
        >
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
      width: isMobile ? 85 : 110,
      responsive: ["md"],
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
            style={{ fontSize: isMobile ? 10 : 12 }}
          >
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 80 : 330,
      align: "center" as const,
      render: (_, record) => (
        <Space size={isMobile ? "small" : "middle"}>
          {isAdmin && !isMobile && (
            <Tooltip title="Send invoice on WhatsApp" placement="top">
              <Button
                type="primary"
                size={isMobile ? "small" : "middle"}
                icon={<MessageOutlined />}
                disabled={!record.payee?.phone}
                onClick={() => sendToWhatsApp(record)}
                style={{
                  borderRadius: "6px",
                  backgroundColor: "#16a34a",
                  borderColor: "#16a34a",
                  padding: isMobile ? "4px 8px" : "8px 16px",
                }}
              >
                {isMobile ? "" : "WhatsApp"}
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Download PDF" placement="top">
            <Button
              type="primary"
              size={isMobile ? "small" : "middle"}
              icon={<DownloadOutlined />}
              loading={downloadingInvoiceId === record._id}
              disabled={downloadingInvoiceId !== null && downloadingInvoiceId !== record._id}
              onClick={() => downloadInvoice(record)}
              style={{
                borderRadius: "6px",
                backgroundColor: "#102a63",
                borderColor: "#102a63",
                padding: isMobile ? "4px 6px" : "8px 16px",
              }}
            >
              {isMobile ? "" : downloadingInvoiceId === record._id ? "Downloading..." : "Download"}
            </Button>
          </Tooltip>
          <Tooltip title="View Invoice" placement="top">
            <Button
              type="primary"
              size={isMobile ? "small" : "middle"}
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              style={{
                borderRadius: "6px",
                padding: isMobile ? "4px 8px" : "8px 16px",
              }}
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
          padding: isMobile ? "4px" : "16px",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
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
          scroll={undefined}
          style={{
            fontSize: isMobile ? 12 : 13,
            minWidth: "100%",
          }}
        />
      </div>
    </Spin>
  );
}
