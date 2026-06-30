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
  Select,
  Tooltip,
  message,
  Statistic,
} from "antd";
import { 
  EyeOutlined, 
  FileAddOutlined, 
  EditOutlined, 
  DeleteOutlined,
  DollarCircleOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  DownloadOutlined
} from "@ant-design/icons";
import CreateInvoiceModal from "../../../modules/invoice/InvoiceModal";
import { getInvoices, updateInvoiceStatus, deleteInvoiceAPI } from "../../../modules/invoice/route";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [viewOpen, setViewOpen] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const [downloading, setDownloading] = useState(false);

  // -------------------------
  // FETCH DATA FROM SERVER
  // -------------------------
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await getInvoices();
      setInvoices(res.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // -------------------------
  // RUNTIME ANALYTICS METRICS
  // -------------------------
  const stats = useMemo(() => {
    const total = invoices.length;
    const grossEarnings = invoices.reduce((sum, inv) => sum + Number(inv.grandTotal || 0), 0);
    const draftCount = invoices.filter(inv => (inv.invoiceStatus || "draft").toLowerCase() === "draft").length;
    return { total, grossEarnings, draftCount };
  }, [invoices]);

  // -------------------------
  // HIGH PRECISION ISOLATED SECTION PDF CAPTURE HANDLER
  // -------------------------
  const triggerDownloadPDF = async (record: any) => {
    setDownloading(true);
    const hideLoading = message.loading(`Compiling Invoice #${record.invoiceNumber} PDF...`, 0);
    
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const element = document.getElementById("printable-invoice-modal-content");
      
      if (!element) {
        setSelected(record);
        setViewOpen(true);
        setTimeout(() => triggerDownloadPDF(record), 400);
        hideLoading();
        return;
      }

      // Explicit tuple assignment to satisfy 'Html2PdfOptions' type matching constraint
      const options = {
        margin: [8, 10, 8, 10] as [number, number, number, number], 
        filename: `Invoice-${record.invoiceNumber || "Statement"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true 
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      } as const;

      await html2pdf().set(options).from(element).save();
      message.success("PDF Downloaded successfully!");
    } catch (error) {
      console.error("PDF engine crash context track:", error);
      message.error("Could not render selected HTML node block into PDF stream.");
    } finally {
      hideLoading();
      setDownloading(false);
    }
  };

  // -------------------------
  // CONTROLLER ROUTE DRIVERS
  // -------------------------
  const openView = (record: any) => {
    setSelected(record);
    setViewOpen(true);
  };

  const openEditModal = (record: any) => {
    setEditingInvoice(record);
    setOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    try {
      setLoading(true);
      await deleteInvoiceAPI(id);
      setInvoices((prev) => prev.filter((inv) => inv._id !== id));
      message.success("Invoice statement wiped permanently.");
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Failed to delete invoice");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setLoading(true);
      await updateInvoiceStatus(id, newStatus);
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === id ? { ...inv, invoiceStatus: newStatus } : inv))
      );
      message.success(`Status updated to ${newStatus.toUpperCase()}`);
    } catch (err: any) {
      console.error(err);
      message.error(err?.response?.data?.message || "Status sync error");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // TABLE MASTER COLUMNS
  // -------------------------
  const columns = [
    {
      title: "Invoice Identification",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text: string) => <span style={{ fontWeight: 700, color: "#1e3a8a", letterSpacing: "0.5px" }}>#{text}</span>,
    },
    {
      title: "Client Entity",
      dataIndex: ["customer", "companyName"],
      key: "customer",
      render: (text: string) => <span style={{ fontWeight: 500, color: "#334155" }}>{text || "N/A"}</span>,
    },
    {
      title: "Grand Evaluation",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (val: number, record: any) => (
        <span style={{ fontWeight: 700, color: "#0f172a" }}>
          {record.currency || "CAD"} ${val?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      ),
    },
    {
      title: "Pipeline Status Monitor",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      render: (status: string, record: any) => {
        const cleanStatus = status?.toLowerCase() || "draft";
        const tagColor = cleanStatus === "paid" ? "success" : cleanStatus === "sent" ? "processing" : "warning";

        return (
          <Space direction="horizontal" size={12} style={{ alignItems: "center" }}>
            <Tag color={tagColor} style={{ textTransform: "uppercase", fontWeight: 700, borderRadius: "4px", padding: "2px 8px" }}>
              {status || "DRAFT"}
            </Tag>
            <Select
              size="small"
              variant="filled"
              value={cleanStatus}
              style={{ width: 95, borderRadius: "4px" }}
              onChange={(newStatus) => handleStatusChange(record._id, newStatus)}
              options={[
                { value: "draft", label: "Draft" },
                { value: "paid", label: "Paid" },
              ]}
            />
          </Space>
        );
      },
    },
    {
      title: "Creation Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => (
        <span style={{ color: "#64748b", fontSize: "13px" }}>
          {val ? new Date(val).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }) : "-"}
        </span>
      ),
    },
    {
      title: "Administrative Actions",
      key: "action",
      render: (_: any, record: any) => {
        const isDraft = (record.invoiceStatus || "draft").toLowerCase() === "draft";

        return (
          <Space size="middle">
            <Button type="primary" variant="outlined" icon={<EyeOutlined />} onClick={() => openView(record)}>
              View
            </Button>

            <Tooltip title="Download clean PDF Copy">
              <Button 
                type="default" 
                loading={downloading && selected?._id === record._id}
                style={{ color: "#10b981", borderColor: "#a7f3d0", backgroundColor: "#f0fdf4" }}
                icon={<DownloadOutlined />} 
                onClick={() => { setSelected(record); triggerDownloadPDF(record); }} 
              />
            </Tooltip>

            <Tooltip title={isDraft ? "Modify Properties" : "Locked (Only editable in draft stage)"}>
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
              description="Are you absolutely sure you want to delete this invoice statement permanently?"
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
  ];

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      {/* 📊 RUNTIME ANALYTICS CARDS ROW */}
      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} md={8}>
          <Card style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)", borderRadius: "12px" }}>
            <Statistic title="Total Ledger Statements" value={stats.total} prefix={<FileTextOutlined style={{ color: "#3b82f6", marginRight: "6px" }} />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)", borderRadius: "12px" }}>
            <Statistic title="Gross Volume Valuation" value={stats.grossEarnings} precision={2} prefix={<DollarCircleOutlined style={{ color: "#10b981", marginRight: "6px" }} />} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)", borderRadius: "12px" }}>
            <Statistic title="Active Draft Modifications" value={stats.draftCount} prefix={<CheckCircleOutlined style={{ color: "#f59e0b", marginRight: "6px" }} />} />
          </Card>
        </Col>
      </Row>

      <Card 
        style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", borderRadius: "16px" }}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "8px 0" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>Invoice Management Ledger</h2>
              <p style={{ margin: "4px 0 0 0", fontSize: "13px", fontWeight: 400, color: "#64748b" }}>Create, tracking logs, view, and instantly download isolated layout copies.</p>
            </div>
            <Button type="primary" size="large" icon={<FileAddOutlined />} style={{ borderRadius: "8px", fontWeight: 600 }} onClick={() => { setEditingInvoice(null); setOpen(true); }}>
              Create Statement
            </Button>
          </div>
        }
      >
        <Table dataSource={invoices} columns={columns} rowKey={(record: any) => record._id} loading={loading} pagination={{ pageSize: 8 }} />
      </Card>

      <CreateInvoiceModal open={open} onClose={() => { setOpen(false); setEditingInvoice(null); fetchInvoices(); }} editData={editingInvoice} />

      {/* 👁️ PREVIEW MODAL SPECIFICATION */}
      <Modal 
        open={viewOpen} 
        footer={[
          <Button key="close" onClick={() => setViewOpen(false)} size="large" style={{ borderRadius: "6px" }}>
            Close Preview
          </Button>,
          <Button 
            key="download" 
            type="primary" 
            icon={<DownloadOutlined />} 
            size="large" 
            loading={downloading}
            style={{ borderRadius: "6px", backgroundColor: "#10b981", borderColor: "#10b981" }} 
            onClick={() => triggerDownloadPDF(selected)}
          >
            Download Isolated PDF
          </Button>
        ]} 
        onCancel={() => setViewOpen(false)} 
        width={850} 
        centered 
        styles={{ body: { padding: "24px" } }} 
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
              position: "relative",
              overflow: "hidden"
            }}
          >
            {/* 🛡️ Subtle Background Watermark */}
            <div 
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%) rotate(-45deg)",
                fontSize: "44px",
                fontWeight: 900,
                color: "rgba(226, 232, 240, 0.45)",
                letterSpacing: "4px",
                whiteSpace: "nowrap",
                zIndex: 0,
                pointerEvents: "none",
                userSelect: "none",
                textAlign: "center"
              }}
            >
              EXTREME LOGISTICS
            </div>

            <div style={{ position: "relative", zIndex: 10 }}>
              <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
                <Col>
                  <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#1e3a8a", margin: 0 }}>
                    {selected.trips?.length > 1 ? "INVOICE - T" : "INVOICE - 1"}
                  </h1>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Num: <b>#{selected.invoiceNumber}</b></span>
                </Col>
                <Col style={{ textAlign: "right" }}>
                  <Tag color={selected.invoiceStatus?.toLowerCase() === "paid" ? "success" : selected.invoiceStatus?.toLowerCase() === "sent" ? "processing" : "warning"} style={{ textTransform: "uppercase", fontWeight: 700, padding: "2px 8px", fontSize: "11px", borderRadius: "4px" }}>
                    {selected.invoiceStatus || "DRAFT"}
                  </Tag>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>Date: {selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}</div>
                </Col>
              </Row>

              <hr style={{ border: 0, borderTop: "2px solid #f1f5f9", marginBottom: "20px" }} />

              <Row gutter={24} style={{ marginBottom: "20px" }}>
                <Col span={12}>
                  <h3 style={{ fontSize: "11px", textTransform: "uppercase", color: "#475569", margin: "0 0 6px 0", letterSpacing: "0.5px", fontWeight: 700 }}>Extreme Logistic Invoice From:</h3>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>{selected.payee?.companyName || "N/A"}</div>
                  <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px", lineHeight: "1.4" }}>
                    {selected.payee?.address1 || selected.payee?.address || "N/A"}<br/>
                    <b>Driver Name:</b> {selected.payee?.contactPerson || selected.payee?.driverName || "N/A"}<br/>
                    <b>Phone:</b> {selected.payee?.phone || "N/A"} <br/>
                    <b>Email:</b> {selected.payee?.email || "N/A"} <br/>
                    <b>GST/HST:</b> {selected.payee?.gstNumber || "N/A"}
                  </div>
                </Col>
                <Col span={12} style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "20px" }}>
                  <h3 style={{ fontSize: "11px", textTransform: "uppercase", color: "#475569", margin: "0 0 6px 0", letterSpacing: "0.5px", fontWeight: 700 }}>Invoice To:</h3>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>{selected.customer?.companyName || "N/A"}</div>
                  <div style={{ fontSize: "11px", color: "#475569", marginTop: "4px", lineHeight: "1.4" }}>
                    {selected.customer?.address1 || selected.customer?.address || "N/A"}<br/>
                    <b>Attention:</b> {selected.customer?.contactPerson || "N/A"}<br/>
                    <b>Phone:</b> {selected.customer?.phone || "N/A"} <br/>
                    <b>Email:</b> {selected.customer?.email || "N/A"} <br/>
                    <b>GST/HST:</b> {selected.customer?.gstNumber || "N/A"}
                  </div>
                </Col>
              </Row>

              {selected.invoicePeriod?.startDate && (
                <div style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", padding: "8px 10px", borderRadius: "4px", fontSize: "11px", marginBottom: "20px", color: "#334155" }}>
                  📅 <b>Billing Period:</b> {new Date(selected.invoicePeriod.startDate).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })} — {new Date(selected.invoicePeriod.endDate).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}
                </div>
              )}

              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: "20px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#1e3a8a", color: "#ffffff", fontSize: "11px" }}>
                    <th style={{ padding: "8px 4px", textAlign: "center", width: "4%" }}>#</th>
                    <th style={{ padding: "8px 6px" }}>Date</th>
                    <th style={{ padding: "8px 6px" }}>VRID</th>
                    <th style={{ padding: "8px 6px" }}>Route</th>
                    <th style={{ padding: "8px 6px" }}>Description</th>
                    <th style={{ padding: "8px 6px", textAlign: "right" }}>Charges</th>
                    <th style={{ padding: "8px 4px", textAlign: "center" }}>Disp%</th>
                    <th style={{ padding: "8px 6px", textAlign: "right" }}>Disp. Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {selected.trips && selected.trips.length > 0 ? (
                    selected.trips.map((trip: any, index: number) => (
                      <tr key={index} style={{ borderBottom: "1px solid #e2e8f0", fontSize: "11px", color: "#334155" }}>
                        <td style={{ padding: "8px 4px", textAlign: "center" }}>{index + 1}</td>
                        <td style={{ padding: "8px 6px", whiteSpace: "nowrap" }}>{trip.tripDate ? new Date(trip.tripDate).toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" }) : "-"}</td>
                        <td style={{ padding: "8px 6px", fontWeight: "bold", color: "#1e293b" }}>{trip.vrid || "N/A"}</td>
                        <td style={{ padding: "8px 6px" }}>{trip.route || "N/A"}</td>
                        <td style={{ padding: "8px 6px" }}>{trip.pickup || "N/A"} to {trip.drop || "N/A"}</td>
                        <td style={{ padding: "8px 6px", textAlign: "right" }}>${trip.totalCharges?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td style={{ padding: "8px 4px", textAlign: "center", color: "#475569" }}>{trip.dispatchPercent || 0}%</td>
                        <td style={{ padding: "8px 6px", textAlign: "right", fontWeight: 600, color: "#b91c1c" }}>
                          ${(trip.dispatchAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={8} style={{ padding: "20px", textAlign: "center", color: "#94a3b8" }}>No active trips found in system database</td></tr>
                  )}
                </tbody>
              </table>

              {/* 💰 Totals Realignment */}
              <Row justify="end" style={{ marginBottom: "20px" }}>
                <Col span={8}>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 6px", fontSize: "11px", color: "#475569" }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 500, color: "#0f172a" }}>${selected.subtotal?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || "0.00"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "6px", borderTop: "1.5px solid #cbd5e1", marginTop: "4px", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold", fontSize: "12px", color: "#1e3a8a" }}>Grand Total:</span>
                    <span style={{ fontWeight: "bold", fontSize: "13px", color: "#1e3a8a" }}>
                      {selected.currency || "CAD"} ${selected.grandTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </Col>
              </Row>

              {selected.accountNumber && (
                <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "12px", marginTop: "20px" }}>
                  <h4 style={{ fontSize: "10px", textTransform: "uppercase", color: "#64748b", margin: "0 0 4px 0", letterSpacing: "0.5px" }}>Direct Deposit Details</h4>
                  <p style={{ fontSize: "10px", color: "#475569", margin: 0, lineHeight: "1.4" }}>
                    <b>Institution Number:</b> {selected.institutionNumber || "N/A"} | 
                    <b>Transit Number:</b> {selected.transitNumber || "N/A"} | 
                    <b>Account Number:</b> {selected.accountNumber}
                  </p>
                </div>
              )}

              {selected.notes && (
                <div style={{ marginTop: "12px", fontSize: "10px", color: "#64748b", fontStyle: "italic" }}>
                  <b>Notes:</b> {selected.notes}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}