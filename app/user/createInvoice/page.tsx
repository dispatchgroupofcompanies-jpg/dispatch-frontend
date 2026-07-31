"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
  Modal,
  Space,
  Row,
  Col,
  Popconfirm,
  Tag,
  Tooltip,
  message,
  Grid,
  Select,
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
  DownloadOutlined,
} from "@ant-design/icons";
import CreateInvoiceModal from "../../../modules/invoice/InvoiceModal";
import InvoicePreview from "../../../src/components/InvoicePreview";
import {
  getInvoices,
  deleteInvoice,
  downloadInvoicePDF,
} from "../../../modules/invoice/route";
import type { Invoice as InvoiceType } from "../../../src/types/invoice";
import { getPayeeSerialNumbers } from "../../../src/utils/invoiceSerial";

const { useBreakpoint } = Grid;

function DashboardComponent() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<InvoiceType | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceType | null>(
    null,
  );
  const [downloading, setDownloading] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState("all");

  // -------------------------
  // FETCH DATA FROM SERVER
  // -------------------------
  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();
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

  const payeeSerialNumbers = useMemo(
    () => getPayeeSerialNumbers(invoices),
    [invoices],
  );

  const payeeSummaries = useMemo(() => {
    const summaries = new Map<
      string,
      { name: string; count: number; total: number; currency: string }
    >();

    invoices.forEach((invoice) => {
      const name = invoice.payee?.companyName?.trim() || "Unassigned company";
      const current = summaries.get(name) || {
        name,
        count: 0,
        total: 0,
        currency: invoice.currency || "CAD",
      };
      current.count += 1;
      current.total += Number(invoice.grandTotal || 0);
      summaries.set(name, current);
    });

    return Array.from(summaries.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [invoices]);

  const filteredInvoices = useMemo(
    () =>
      selectedPayee === "all"
        ? invoices
        : invoices.filter(
            (invoice) =>
              (invoice.payee?.companyName?.trim() || "Unassigned company") ===
              selectedPayee,
          ),
    [invoices, selectedPayee],
  );

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
      link.download = `Invoice-${payeeSerialNumbers.get(record._id) || "Statement"}.pdf`;

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

  const openView = (record: InvoiceType) => {
    setSelected(record);
    setViewOpen(true);
  };

  const getSerialNumber = (invoiceId: string) => {
    const invoice = invoices.find((inv) => inv._id === invoiceId);
    return invoice ? payeeSerialNumbers.get(invoiceId) : undefined;
  };

  const openEditModal = (record: InvoiceType) => {
    setEditingInvoice(record);
    setOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await deleteInvoice(id);
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
        key: "invoiceNumber",
        width: isMobile ? 54 : 140,
        render: (_: unknown, record: InvoiceType) => {
          const serialNumber = payeeSerialNumbers.get(record._id) || 1;
          return (
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
              #{serialNumber}
            </span>
          );
        },
      },
      {
        title: "Vendor",
        dataIndex: ["payee", "companyName"],
        key: "payeeCompany",
        responsive: ["md"],
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
        width: isMobile ? 82 : 160,
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
        responsive: ["md"],
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
        responsive: ["lg"],
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
        width: isMobile ? 134 : 260,
        render: (_: unknown, record: InvoiceType) => {
          const isDraft =
            (record.invoiceStatus || "draft").toLowerCase() === "draft";
          return (
            <Space size={isMobile ? 2 : "small"}>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => openView(record)}
              >
                {!isMobile && "View"}
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
                description="Are you sure you want to delete this invoice statement permanently?"
                onConfirm={() => handleDeleteInvoice(record._id)}
                okText="Confirm Delete"
                okButtonProps={{ danger: true, type: "primary" }}
              >
                <Button danger type="text" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [selected, downloading, payeeSerialNumbers, isMobile],
  );

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
              Create, tracking logs, view, and instantly download invoices.
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
        size="small"
        style={{
          marginBottom: 16,
          borderRadius: 12,
          border: "1px solid #dbeafe",
          background: "#f8fbff",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            flexDirection: isMobile ? "column" : "row",
            gap: 12,
            marginBottom: 12,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: "#0f2962" }}>
              Company-wise invoice view
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Invoice numbering and totals are separated by payee company.
            </div>
          </div>
          <Select
            value={selectedPayee}
            onChange={setSelectedPayee}
            style={{ width: isMobile ? "100%" : 280 }}
            options={[
              { value: "all", label: `All companies (${invoices.length})` },
              ...payeeSummaries.map((company) => ({
                value: company.name,
                label: `${company.name} (${company.count})`,
              })),
            ]}
          />
        </div>
      </Card>

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
          dataSource={filteredInvoices as unknown as Record<string, unknown>[]}
          columns={columns}
          rowKey={(record) => (record as unknown as InvoiceType)._id}
          loading={loading}
          pagination={{
            pageSize: 8,
            style: { marginTop: 12 },
          }}
          size="middle"
          enableHorizontalScroll={!isMobile}
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

      {/* Optimized Modal UI: Removes white backdrop spacing around the invoice */}
      <Modal
        open={viewOpen}
        onCancel={() => setViewOpen(false)}
        width={isMobile ? "100%" : "auto"}
        centered
        title={null}
        closable={true}
        footer={null} // Cleaner layout matching original UI
        styles={{
          mask: {
            backgroundColor: "rgba(15, 23, 42, 0.85)", // Modern crisp dark blur tint
          },
          body: {
            padding: 0,
            background: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {selected && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Embedded Clean Frame for Invoice Content */}
            <div
              id="printable-invoice-modal-content"
              style={{
                backgroundColor: "#ffffff",
                padding: isMobile ? "6px" : "24px",
                borderRadius: "8px",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                maxWidth: "100%",
                maxHeight: "80vh",
                // Keep a single scrollbar inside InvoicePreview's iframe.
                overflow: "hidden",
              }}
            >
              <InvoicePreview
                invoice={selected}
                serialNumber={
                  selected ? getSerialNumber(selected._id) : undefined
                }
              />
            </div>

            {/* Seamless Outside UI Controls Floating Container */}
            <div
              style={{
                marginTop: isMobile ? "8px" : "20px",
                display: "flex",
                gap: isMobile ? "8px" : "12px",
                width: "100%",
                maxWidth: "600px",
                justifyContent: "center",
              }}
            >
              <Button
                key="close"
                onClick={() => setViewOpen(false)}
                size={isMobile ? "middle" : "large"}
                style={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  flex: 1,
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                }}
              >
                Close Preview
              </Button>
              <Button
                key="download"
                type="primary"
                icon={<DownloadOutlined />}
                size={isMobile ? "middle" : "large"}
                loading={downloading}
                disabled={!selected}
                style={{
                  borderRadius: "8px",
                  fontWeight: 600,
                  flex: 1,
                  backgroundColor: "#10b981",
                  borderColor: "#10b981",
                  color: "#ffffff",
                }}
                onClick={() => {
                  if (selected) triggerDownloadPDF(selected);
                }}
              >
                Download PDF
              </Button>
            </div>
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
