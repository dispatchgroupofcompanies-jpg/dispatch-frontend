"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Table,
  Card,
  Modal,
  Space,
  Row,
  Col,
  Popconfirm,
  Tag,
  Tooltip,
  message,
} from "antd";
import ResponsiveTable from "../../../modules/common/ResponsiveTable";
import {
  EyeOutlined,
  FileAddOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ShareAltOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import CreateInvoiceModal from "../../../modules/invoice/InvoiceModal";
import InvoicePreview from "../../../src/components/InvoicePreview";
import {
  getInvoices,
  deleteInvoiceAPI,
  downloadInvoicePDF,
} from "../../../modules/invoice/route";
import type { Invoice as InvoiceType } from "../../../src/types/invoice";

function DashboardComponent() {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<InvoiceType | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceType | null>(
    null,
  );
  const [sharing, setSharing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // -------------------------
  // FETCH DATA FROM SERVER
  // -------------------------
  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();

      console.log("Fetched Invoices:", res.data?.data || []);
      setInvoices(res.data?.data || []);
    } catch (err) {
      message.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await loadInvoices();
    };
    init();
  }, []);

  // -------------------------
  // RUNTIME ANALYTICS METRICS
  // -------------------------
  const stats = useMemo(() => {
    const total = invoices.length;
    const grossEarnings = invoices.reduce(
      (sum, inv) => sum + Number(inv.grandTotal || 0),
      0,
    );
    const draftCount = invoices.filter(
      (inv) => (inv.invoiceStatus || "draft").toLowerCase() === "draft",
    ).length;
    return { total, grossEarnings, draftCount };
  }, [invoices]);

  // -------------------------
  // SERVER-SIDE PDF DOWNLOAD HANDLER
  // -------------------------
  const triggerDownloadPDF = async (record: InvoiceType) => {
    if (!record || typeof window === "undefined") return;
    setDownloading(true);

    try {
      const response = await downloadInvoicePDF(record._id);

      // Create blob from response
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${record.invoiceNumber || "Statement"}.pdf`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF download error:", error);
      message.error(
        "Could not download PDF. Please try again or contact support.",
      );
    } finally {
      setDownloading(false);
    }
  };

  // -------------------------
  // SHARE INVOICE HANDLER
  // -------------------------
  const triggerShareInvoice = async (record: InvoiceType) => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    setSharing(true);
    const hideLoading = message.loading(
      `Preparing to share Invoice #${record.invoiceNumber}...`,
      0,
    );

    try {
      const shareUrl = `${window.location.origin}/public/invoice/${record._id}`;
      const shareData = {
        title: `Invoice #${record.invoiceNumber}`,
        text: `Please review Invoice #${record.invoiceNumber} from Extreme Logistics for $${record.grandTotal?.toLocaleString()}`,
        url: shareUrl,
      };

      if (navigator.share) {
        await navigator.share(shareData);
        message.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(shareUrl);
        Modal.success({
          title: "Invoice Link Copied!",
          content: (
            <div>
              <p>
                Native sharing is not supported on this browser. Copy the link
                below to share manually:
              </p>
              <pre
                style={{
                  background: "#f1f5f9",
                  padding: "8px",
                  borderRadius: "4px",
                  overflowX: "auto",
                }}
              >
                {shareUrl}
              </pre>
            </div>
          ),
        });
      }
    } catch (error) {
      console.error("Share handler context track:", error);
      message.error("Could not complete share action.");
    } finally {
      hideLoading();
      setSharing(false);
    }
  };

  const openView = (record: InvoiceType) => {
    setSelected(record);
    setViewOpen(true);
  };

  const openEditModal = (record: InvoiceType) => {
    setEditingInvoice(record);
    setOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await deleteInvoiceAPI(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      message.success("Invoice statement wiped permanently.");
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      message.error(
        error?.response?.data?.message || "Failed to delete invoice",
      );
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // TABLE MASTER COLUMNS (Memoized)
  // -------------------------
  const columns = useMemo(
    () => [
      {
        title: "Invoice #",
        dataIndex: "invoiceNumber",
        key: "invoiceNumber",
        width: 140,
        render: (text: string) => (
          <span
            style={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "0.5px",
              background: "#10b981",
              padding: "4px 10px",
              borderRadius: "6px",
              display: "inline-block",
            }}
          >
            #{text}
          </span>
        ),
      },
      {
        title: "Vendor",
        dataIndex: ["payee", "companyName"],
        key: "payeeCompany",
        render: (text: string) => (
          <span style={{ fontWeight: 500, color: "#334155" }}>
            {text || "N/A"}
          </span>
        ),
      },
      {
        title: "Amount",
        dataIndex: "grandTotal",
        key: "grandTotal",
        width: 160,
        render: (val: number, record: InvoiceType) => (
          <span style={{ fontWeight: 700, color: "#0f172a" }}>
            {record.currency || "CAD"} $
            {val?.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        ),
      },
      {
        title: "Status",
        dataIndex: "invoiceStatus",
        key: "invoiceStatus",
        width: 140,
        render: (status: string) => {
          const cleanStatus = status?.toLowerCase() || "draft";
          const colorMap: Record<string, string> = {
            draft: "default",
            pending: "warning",
            approved: "success",
            paid: "processing",
            rejected: "error",
          };
          return (
            <Tag color={colorMap[cleanStatus] || "default"}>
              {status?.toUpperCase() || "DRAFT"}
            </Tag>
          );
        },
      },
      {
        title: "Created",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (val: string) => (
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            {val
              ? new Date(val).toLocaleDateString("en-CA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"}
          </span>
        ),
      },
      {
        title: "Actions",
        key: "action",
        width: 260,
        render: (_: unknown, record: InvoiceType) => {
          const isDraft =
            (record.invoiceStatus || "draft").toLowerCase() === "draft";
          return (
            <Space size="small">
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => openView(record)}
              >
                View
              </Button>

              <Tooltip title="Download Clean PDF">
                <Button
                  type="default"
                  loading={downloading && selected?._id === record._id}
                  style={{
                    color: "#10b981",
                    borderColor: "#a7f3d0",
                    backgroundColor: "#f0fdf4",
                  }}
                  icon={<DownloadOutlined />}
                  onClick={() => triggerDownloadPDF(record)}
                />
              </Tooltip>

              <Tooltip title="Share Invoice Link">
                <Button
                  type="default"
                  loading={sharing && selected?._id === record._id}
                  style={{
                    color: "#2563eb",
                    borderColor: "#bfdbfe",
                    backgroundColor: "#eff6ff",
                  }}
                  icon={<ShareAltOutlined />}
                  onClick={() => triggerShareInvoice(record)}
                />
              </Tooltip>

              <Tooltip
                title={
                  isDraft
                    ? "Modify Properties"
                    : "Locked (Only editable in draft stage)"
                }
              >
                <Button
                  type="default"
                  icon={<EditOutlined />}
                  disabled={!isDraft}
                  style={{ borderColor: isDraft ? "#cbd5e1" : "#f1f5f9" }}
                  onClick={() => openEditModal(record)}
                />
              </Tooltip>

              <Popconfirm
                title="Purge Invoice Record"
                description="Are you  sure you want to delete this invoice statement permanently?"
                onConfirm={() => handleDeleteInvoice(record._id)}
                okText="Confirm Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true, type: "primary" }}
              >
                <Button danger type="text" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [selected, downloading, sharing],
  );

  const isMobile = window.innerWidth < 768;
  const headerPadding = isMobile ? "20px 16px" : "24px 20px";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: isMobile ? "12px" : "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
          padding: headerPadding,
          marginBottom: isMobile ? 16 : 24,
          borderRadius: isMobile ? 12 : 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            gap: isMobile ? "16px" : "0",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 20 : 24,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              Invoice Management Ledger
            </h2>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: isMobile ? 12 : 14,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Create, tracking logs, view, and instantly download or share
              invoice links.
            </p>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<FileAddOutlined />}
            onClick={() => {
              setEditingInvoice(null);
              setOpen(true);
            }}
            style={{
              background: "#ffffff",
              color: "#2563eb",
              borderRadius: "8px",
              fontWeight: 600,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              width: isMobile ? "100%" : "auto",
            }}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileTextOutlined
                style={{ color: "#3b82f6", fontSize: "24px" }}
              />
              <div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Total Ledger Statements
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {stats.total}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <DollarCircleOutlined
                style={{ color: "#10b981", fontSize: "24px" }}
              />
              <div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Gross Volume Valuation
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  $
                  {stats.grossEarnings?.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              borderRadius: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircleOutlined
                style={{ color: "#f59e0b", fontSize: "24px" }}
              />
              <div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Active Draft Modifications
                </div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  {stats.draftCount}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        style={{
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
        }}
      >
        <ResponsiveTable
          cardProps={{
            borderRadius: "12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          dataSource={invoices as unknown as Record<string, unknown>[]}
          columns={columns}
          rowKey={(record) => (record as unknown as InvoiceType)._id}
          loading={loading}
          pagination={{
            pageSize: 8,
            style: { marginTop: 12 },
          }}
          size="middle"
          scroll={{ x: 900 }}
          minScrollWidth={900}
        />
      </Card>

      <CreateInvoiceModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingInvoice(null);
          loadInvoices();
        }}
        editData={editingInvoice || undefined}
      />

      <Modal
        open={viewOpen}
        footer={[
          <Button
            key="close"
            onClick={() => setViewOpen(false)}
            size="large"
            style={{ borderRadius: "6px" }}
          >
            Close Preview
          </Button>,
          <Button
            key="share"
            type="default"
            icon={<ShareAltOutlined />}
            size="large"
            loading={sharing}
            disabled={!selected}
            style={{
              borderRadius: "6px",
              color: "#2563eb",
              borderColor: "#bfdbfe",
              backgroundColor: "#eff6ff",
            }}
            onClick={() => {
              if (selected) triggerShareInvoice(selected);
            }}
          >
            Share Link
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            size="large"
            loading={downloading}
            disabled={!selected}
            style={{
              borderRadius: "6px",
              backgroundColor: "#10b981",
              borderColor: "#10b981",
            }}
            onClick={() => {
              if (selected) triggerDownloadPDF(selected);
            }}
          >
            Download PDF
          </Button>,
        ]}
        onCancel={() => setViewOpen(false)}
        width="95vw"
        style={{ top: 20, maxWidth: 980 }}
        centered
        title={null}
        closable
      >
        {selected && (
          <div
            id="printable-invoice-modal-content"
            style={{
              backgroundColor: "#ffffff",
              padding: "10px 15px",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <InvoicePreview invoice={selected} />
          </div>
        )}
      </Modal>
    </div>
  );
}

import dynamic from "next/dynamic";
const DashboardPage = dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
});

export default DashboardPage;
