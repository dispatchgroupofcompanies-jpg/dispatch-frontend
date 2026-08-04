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
  Modal,
  Select,
} from "antd";
import { EyeOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
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
  onUpdatePaymentStatus?: (
    invoice: Invoice,
    status: "pending" | "paid",
    proofFile?: File,
  ) => Promise<boolean>;
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
  onUpdatePaymentStatus,
}: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const payeeSerialNumbers = React.useMemo(
    () => getPayeeSerialNumbers(invoices),
    [invoices],
  );
  const [downloadingInvoiceId, setDownloadingInvoiceId] = React.useState<string | null>(null);

  // Payment proof modal state
  const [paymentModalInvoice, setPaymentModalInvoice] = React.useState<Invoice | null>(null);
  const [proofFile, setProofFile] = React.useState<File | null>(null);
  const [proofPreview, setProofPreview] = React.useState<string | null>(null);
  const [paymentSubmitting, setPaymentSubmitting] = React.useState(false);
  const proofInputRef = React.useRef<HTMLInputElement | null>(null);

  const clearProofSelection = () => {
    if (proofPreview) {
      window.URL.revokeObjectURL(proofPreview);
    }
    setProofFile(null);
    setProofPreview(null);
    if (proofInputRef.current) {
      proofInputRef.current.value = "";
    }
  };

  const closePaymentModal = () => {
    setPaymentModalInvoice(null);
    clearProofSelection();
  };

  const handleProofFileChosen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
      message.error("Only JPG, PNG, and WebP images are allowed as payment proof.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      message.error("Payment proof image must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (proofPreview) {
      window.URL.revokeObjectURL(proofPreview);
    }
    setProofFile(file);
    setProofPreview(window.URL.createObjectURL(file));
  };

  const submitPaymentProof = async () => {
    if (!paymentModalInvoice || !proofFile || !onUpdatePaymentStatus) return;
    setPaymentSubmitting(true);
    try {
      const succeeded = await onUpdatePaymentStatus(paymentModalInvoice, "paid", proofFile);
      if (succeeded) {
        closePaymentModal();
      }
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handlePaymentSelect = (record: Invoice, value: "pending" | "paid") => {
    const current = (record.paymentStatus || "pending") as "pending" | "paid";
    if (value === current || !onUpdatePaymentStatus) return;

    if (value === "paid") {
      // Open the payment proof modal - proof image is required to mark as paid.
      clearProofSelection();
      setPaymentModalInvoice(record);
      return;
    }

    Modal.confirm({
      title: "Mark payment as Pending?",
      content: "This will remove the stored payment proof for this invoice.",
      okText: "Yes, mark Pending",
      cancelText: "Cancel",
      onOk: () => onUpdatePaymentStatus(record, "pending"),
    });
  };

  const renderPaymentControl = (record: Invoice) => {
    const current = (record.paymentStatus || "pending") as "pending" | "paid";

    if (!isAdmin || !onUpdatePaymentStatus) {
      return (
        <Tag color={current === "paid" ? "success" : "warning"} style={{ margin: 0 }}>
          {current.toUpperCase()}
        </Tag>
      );
    }

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-start" }}>
        <Select
          size="small"
          value={current}
          style={{ width: 115 }}
          onChange={(value) => handlePaymentSelect(record, value as "pending" | "paid")}
          options={[
            { value: "pending", label: "🕐 Pending" },
            { value: "paid", label: "✅ Paid" },
          ]}
        />
        {current === "paid" && record.paymentProofUrl && (
          <a
            href={record.paymentProofUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "#2563eb" }}
          >
            View proof
          </a>
        )}
      </div>
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
    ...(isAdmin
      ? [
          {
            title: "Payment",
            key: "paymentStatus",
            width: 130,
            responsive: ["md" as const],
            render: (_: unknown, record: Invoice) => renderPaymentControl(record),
          },
        ]
      : []),
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 80 : 240,
      align: "center" as const,
      render: (_, record) => (
        <Space size={isMobile ? "small" : "middle"}>
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
        {isMobile ? (
          <div style={{ display: "grid", gap: 12, padding: 8 }}>
            {invoices.map((record) => {
              const serialNumber = payeeSerialNumbers.get(record._id) || 1;
              const vrids = record.trips?.map((trip) => trip.vrid).filter(Boolean) || [];
              const status = record.invoiceStatus || "draft";
              const statusColors: Record<string, string> = { draft: "default", pending: "warning", approved: "success", paid: "processing", rejected: "error" };
              return <div key={record._id} style={{ display: "grid", gap: 12, padding: 14, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 2px 6px rgba(15,23,42,.05)" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", alignItems: "center", gap: 10, paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
                  <span style={{ fontWeight: 700, color: "#fff", background: "#10b981", padding: "4px 9px", borderRadius: 6 }}>#{serialNumber}</span>
                  <span style={{ color: "#1e40af", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vrids.join(", ") || "No VRID"}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Amount</div><div style={{ fontWeight: 700, color: "#0f172a" }}>{record.currency || "CAD"} ${Number(record.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Status</div><Tag color={statusColors[status] || "default"} style={{ margin: 0 }}>{status.toUpperCase()}</Tag></div>
                </div>
                {isAdmin && (
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Payment</div>
                    {renderPaymentControl(record)}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8 }}>
                  <Button size="small" icon={<DownloadOutlined />} loading={downloadingInvoiceId === record._id} onClick={() => downloadInvoice(record)}>PDF</Button>
                  <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => onView(record)}>View</Button>
                </div>
              </div>;
            })}
          </div>
        ) : <Table
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
        />}
      </div>

      <Modal
        title="Upload Payment Proof"
        open={!!paymentModalInvoice}
        onCancel={closePaymentModal}
        onOk={submitPaymentProof}
        okText="Mark as Paid"
        cancelText="Cancel"
        confirmLoading={paymentSubmitting}
        okButtonProps={{ disabled: !proofFile }}
        destroyOnHidden
      >
        <div style={{ display: "grid", gap: 12, paddingTop: 8 }}>
          <Text style={{ fontSize: 13 }}>
            Upload a payment proof image to mark invoice{" "}
            <Tag color="success" style={{ margin: 0 }}>PAID</Tag>
          </Text>

          <input
            ref={proofInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleProofFileChosen}
          />

          <Button
            icon={<UploadOutlined />}
            onClick={() => proofInputRef.current?.click()}
            style={{ width: "fit-content" }}
          >
            {proofFile ? "Change Image" : "Choose Image"}
          </Button>

          {proofFile && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              {proofFile.name} ({(proofFile.size / 1024).toFixed(0)} KB)
            </Text>
          )}

          {proofPreview && (
            <img
              src={proofPreview}
              alt="Payment proof preview"
              style={{
                maxWidth: "100%",
                maxHeight: 240,
                objectFit: "contain",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
                background: "#f8fafc",
              }}
            />
          )}

          {!proofFile && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              Accepted formats: JPG, PNG, WebP. Max size: 5 MB.
            </Text>
          )}
        </div>
      </Modal>
    </Spin>
  );
}
