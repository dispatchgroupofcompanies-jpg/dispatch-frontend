"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Button,
  Card,
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
import InvoiceModal from "../../../src/components/InvoiceModal";
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
  const isCompact = !screens.lg;

  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceType[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<InvoiceType | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceType | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState("all");

  // -------------------------
  // PAGINATION STATE (Fixed continuous S No)
  // -------------------------
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

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
    loadInvoices();
  }, []);

  // Reset page to 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPayee]);

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
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${payeeSerialNumbers.get(record._id) || "Statement"}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      message.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF download error:", error);
      message.error("Could not download PDF. Please try again or contact support.");
    } finally {
      setDownloading(false);
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
      await deleteInvoice(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      message.success("Invoice statement wiped permanently.");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      message.error(error?.response?.data?.message || "Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to safely extract displayable string names
  const getPartyDisplayName = (party: unknown): string => {
    if (typeof party === "string") return party;
    if (typeof party === "object" && party !== null) {
      const p = party as Record<string, unknown>;
      if (typeof p.companyName === "string") return p.companyName;
      if (typeof p.name === "string") return p.name;
    }
    return "-";
  };

  // -------------------------
  // TABLE MASTER COLUMNS
  // -------------------------
  const columns = useMemo(
    () => [
      {
        title: "S No",
        key: "sNo",
        width: isMobile ? 50 : 70,
        fixed: isMobile ? ("left" as const) : undefined,
        render: (_: unknown, __: unknown, index: number) => {
          // Continuous Serial Number calculation
          const serialNumber = (currentPage - 1) * pageSize + index + 1;
          return (
            <span
              style={{
                color: "#0f172a",
                fontSize: isMobile ? "11px" : "13px",
                fontWeight: 500,
              }}
            >
              {serialNumber}
            </span>
          );
        },
      },
      {
        title: "Payee",
        key: "payee",
        width: isMobile ? 120 : 160,
        render: (_: unknown, record: InvoiceType) => {
          const companyName =
            getPartyDisplayName(record.payee) !== "-"
              ? getPartyDisplayName(record.payee)
              : record.payeeName || "-";

          return (
            <Tooltip title={companyName !== "-" ? companyName : undefined}>
              <span
                style={{
                  color: "#0f172a",
                  fontSize: isMobile ? "11px" : "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  maxWidth: "100%",
                }}
              >
                {companyName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "Pay To",
        key: "payTo",
        width: isMobile ? 120 : 160,
        render: (_: unknown, record: InvoiceType) => {
          const payToName =
            getPartyDisplayName(record.customer) !== "-"
              ? getPartyDisplayName(record.customer)
              : typeof record.companyName === "string"
              ? record.companyName
              : "-";

          return (
            <Tooltip title={payToName !== "-" ? payToName : undefined}>
              <span
                style={{
                  color: "#0f172a",
                  fontSize: isMobile ? "11px" : "13px",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "inline-block",
                  maxWidth: "100%",
                }}
              >
                {payToName}
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "Amount",
        dataIndex: "grandTotal",
        key: "grandTotal",
        width: isMobile ? 82 : 140,
        render: (val: number, record: InvoiceType) => (
          <span style={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
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
        width: 120,
        responsive: ["md" as const],
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
        title: "Actions",
        key: "action",
        width: isMobile ? 134 : 260,
        align: "center" as const,
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
    [selected, downloading, isMobile, currentPage, pageSize],
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
          <Card style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FileTextOutlined style={{ color: "#3b82f6", fontSize: "24px" }} />
              <div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>Total Ledger Statements</div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>{stats.total}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <DollarCircleOutlined style={{ color: "#10b981", fontSize: "24px" }} />
              <div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>Gross Volume Valuation</div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>
                  ${stats.grossEarnings?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8}>
          <Card style={{ boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)", borderRadius: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <CheckCircleOutlined style={{ color: "#f59e0b", fontSize: "24px" }} />
              <div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>Active Draft Modifications</div>
                <div style={{ fontSize: "20px", fontWeight: 700 }}>{stats.draftCount}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Company Selector */}
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
            <div style={{ fontWeight: 700, color: "#0f2962" }}>Company-wise invoice view</div>
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

      {/* Main Table / Grid */}
      <Card
        style={{
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06)",
          borderRadius: "16px",
        }}
        styles={{ body: isCompact ? { padding: 12 } : undefined }}
      >
        {isCompact ? (
          <div style={{ display: "grid", gap: 12 }}>
            {loading && <div style={{ textAlign: "center", padding: 24, color: "#64748b" }}>Loading invoices...</div>}
            {!loading && filteredInvoices.length === 0 && <div style={{ textAlign: "center", padding: 24, color: "#64748b" }}>No invoices found.</div>}
            {filteredInvoices.map((invoice, index) => {
              const serialNumber = (currentPage - 1) * pageSize + index + 1;
              const invoiceStatus = (invoice.invoiceStatus || "draft").toLowerCase();
              const isDraft = invoiceStatus === "draft";
              const statusColor: Record<string, string> = { draft: "default", pending: "warning", approved: "success", paid: "processing", rejected: "error" };
              return (
                <div key={invoice._id} style={{ display: "grid", gap: 12, padding: 14, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff", boxShadow: "0 2px 6px rgba(15,23,42,.05)" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 10, alignItems: "center", paddingBottom: 10, borderBottom: "1px solid #e2e8f0" }}>
                    <span style={{ fontWeight: 700, color: "#fff", background: "#10b981", padding: "4px 9px", borderRadius: 6 }}>#{serialNumber}</span>
                    <span style={{ color: "#334155", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{invoice.payee?.companyName || "Unassigned company"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div><div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Amount</div><div style={{ color: "#0f172a", fontWeight: 700 }}>{invoice.currency || "CAD"} ${Number(invoice.grandTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
                    <div><div style={{ color: "#64748b", fontSize: 11, marginBottom: 3 }}>Status</div><Tag color={statusColor[invoiceStatus] || "default"} style={{ margin: 0 }}>{invoiceStatus.toUpperCase()}</Tag></div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
                    <Button size="small" type="primary" icon={<EyeOutlined />} onClick={() => openView(invoice)} />
                    <Tooltip title="Download PDF"><Button size="small" icon={<DownloadOutlined />} loading={downloading && selected?._id === invoice._id} onClick={() => triggerDownloadPDF(invoice)} /></Tooltip>
                    <Tooltip title={isDraft ? "Edit invoice" : "Only draft invoices can be edited"}><Button size="small" icon={<EditOutlined />} disabled={!isDraft} onClick={() => openEditModal(invoice)} /></Tooltip>
                    <Popconfirm title="Purge Invoice Record" description="Are you sure you want to delete this invoice statement permanently?" onConfirm={() => handleDeleteInvoice(invoice._id)} okText="Confirm Delete" okButtonProps={{ danger: true, type: "primary" }}><Button size="small" danger icon={<DeleteOutlined />} /></Popconfirm>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <ResponsiveTable
            cardProps={{ borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            dataSource={filteredInvoices as unknown as Record<string, unknown>[]}
            columns={columns}
            rowKey={(record) => (record as unknown as InvoiceType)._id}
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              style: { marginTop: 12 },
              onChange: (page: number, size?: number) => {
                setCurrentPage(page);
                if (size) setPageSize(size);
              },
            }}
            size="middle"
            enableHorizontalScroll
          />
        )}
      </Card>

      {/* Form Modal for Create/Edit */}
      <CreateInvoiceModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditingInvoice(null);
          loadInvoices();
        }}
        editData={editingInvoice || undefined}
      />

      {/* Preview modal */}
      <InvoiceModal
        open={viewOpen}
        invoice={selected}
        onClose={() => {
          setViewOpen(false);
          setSelected(null);
        }}
        allInvoices={invoices}
      />
    </div>
  );
}

import dynamic from "next/dynamic";
const DashboardPage = dynamic(() => Promise.resolve(DashboardComponent), {
  ssr: false,
});

export default DashboardPage;