"use client";

import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  message,
  Spin,
  Modal,
  Typography,
  Divider,
} from "antd";
import {
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FilePdfOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type { ColumnsType } from "antd/es/table";

const { Title, Text } = Typography;

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface Trip {
  pickup: string;
  drop: string;
  route: string;
  totalCharges: number;
  tripDate: string;
  vrid: string;
}

interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  invoiceType: string;
  currency: string;
  subtotal: number;
  tax: number;
  grandTotal: number;
  createdAt: string;
  pdfUrl?: string;
  payee: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address1: string;
    gstNumber?: string;
  };
  customer: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
    address1: string;
  };
  trips: Trip[];
}

export default function AdminInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/invoices");
      if (response.data?.success) {
        setInvoices(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
      message.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleView = (record: Invoice) => {
    setSelectedInvoice(record);
    setViewModalOpen(true);
  };

  const handleStatusUpdate = async (
    id: string,
    newStatus: "approved" | "rejected",
  ) => {
    try {
      setActionLoading(true);
      await API.patch(`/admin/invoices/${id}/status`, { status: newStatus });
      message.success(`Invoice ${newStatus} successfully!`);
      setViewModalOpen(false);
      fetchInvoices();
    } catch (error) {
      console.error(`Error updating status:`, error);
      message.error(`Failed to update invoice status`);
    } finally {
      setActionLoading(false);
    }
  };

  const invoiceColumns: ColumnsType<Invoice> = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      width: 130,
      render: (text) => (
        <Text strong style={{ color: "#1e293b" }}>
          {text}
        </Text>
      ),
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
      width: 150,
      render: (amount, record) => (
        <Text strong style={{ color: "#0f172a" }}>
          {amount?.toFixed(2)} {record.currency || "CAD"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      width: 120,
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
            style={{ borderRadius: "4px", fontWeight: 600 }}
          >
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      width: 180,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
          style={{ background: "#2563eb", borderRadius: "6px" }}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "32px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Title
          level={2}
          style={{ color: "#0f172a", margin: 0, fontWeight: 700 }}
        >
          Invoice Management
        </Title>
        <Text style={{ color: "#64748b", fontSize: "14px" }}>
          Review, audit, and approve vendor billing pipelines
        </Text>
      </div>

      {/* Main Table Card */}
      <Card
        style={{
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <Spin spinning={loading}>
          <Table
            columns={invoiceColumns}
            dataSource={invoices}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </Spin>
      </Card>

      {/* Real Invoice Layout Sheet inside Modal */}
      <Modal
        title={null}
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        width={800}
        style={{ top: 20 }}
        bodyStyle={{ padding: 0 }}
        footer={[
          <Button
            key="close"
            size="large"
            onClick={() => setViewModalOpen(false)}
            style={{ borderRadius: "6px", marginRight: 16, marginBottom: 16 }}
          >
            Close
          </Button>,
        ]}
      >
        {selectedInvoice && (
          <div>
            {/* Top Operational Action Header */}
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "space-between",
                backgroundColor: "#f8fafc",
                padding: "16px 24px",
                borderBottom: "1px solid #e2e8f0",
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
              }}
            >
              {selectedInvoice.pdfUrl ? (
                <Button
                  type="default"
                  danger
                  icon={<FilePdfOutlined />}
                  href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${selectedInvoice.pdfUrl}`}
                  target="_blank"
                  style={{ borderRadius: "6px" }}
                >
                  Download Original PDF
                </Button>
              ) : (
                <div />
              )}

              {(selectedInvoice.invoiceStatus === "pending" ||
                selectedInvoice.invoiceStatus === "draft") && (
                <Space size="middle">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() =>
                      handleStatusUpdate(selectedInvoice._id, "approved")
                    }
                    loading={actionLoading}
                    style={{
                      background: "#10b981",
                      borderColor: "#10b981",
                      borderRadius: "6px",
                    }}
                  >
                    Approve Bill
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<CloseCircleOutlined />}
                    onClick={() =>
                      handleStatusUpdate(selectedInvoice._id, "rejected")
                    }
                    loading={actionLoading}
                    style={{ borderRadius: "6px" }}
                  >
                    Reject Bill
                  </Button>
                </Space>
              )}
            </div>

            {/* 📄 REAL WHITE A4 INVOICE SHEET WRAPPER */}
            <div
              style={{
                backgroundColor: "#ffffff",
                padding: "40px",
                fontFamily: "'Inter', sans-serif",
                color: "#1e293b",
              }}
            >
              {/* Invoice Brand Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "32px",
                }}
              >
                <div>
                  <Title
                    level={3}
                    style={{
                      margin: 0,
                      color: "#0f172a",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {selectedInvoice.payee?.companyName}
                  </Title>
                  <Text type="secondary" style={{ fontSize: "13px" }}>
                    {selectedInvoice.payee?.address1}
                  </Text>
                  {selectedInvoice.payee?.gstNumber && (
                    <div>
                      <Text size="small" type="secondary">
                        GST/HST:{" "}
                        <strong>{selectedInvoice.payee.gstNumber}</strong>
                      </Text>
                    </div>
                  )}
                </div>
                <div style={{ textAlign: "right" }}>
                  <Title
                    level={2}
                    style={{
                      margin: 0,
                      color: "#2563eb",
                      fontWeight: 900,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    INVOICE
                  </Title>
                  <Text strong style={{ color: "#475569" }}>
                    # {selectedInvoice.invoiceNumber}
                  </Text>
                  <div style={{ marginTop: "4px" }}>
                    <Tag
                      color={
                        selectedInvoice.invoiceStatus === "approved"
                          ? "success"
                          : "warning"
                      }
                    >
                      {selectedInvoice.invoiceStatus.toUpperCase()}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Bill To & Metadata Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1fr",
                  gap: "24px",
                  marginBottom: "40px",
                  backgroundColor: "#f8fafc",
                  padding: "20px",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <Text
                    type="secondary"
                    style={{
                      textTransform: "uppercase",
                      fontSize: "11px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                    }}
                  >
                    Bill To:
                  </Text>
                  <div style={{ marginTop: "6px" }}>
                    <Text strong style={{ fontSize: "16px", color: "#0f172a" }}>
                      {selectedInvoice.customer?.companyName}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ fontSize: "13px" }}>
                      {selectedInvoice.customer?.address1 || "Canada"}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      Attn: {selectedInvoice.customer?.contactPerson}
                    </Text>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: "13px" }}>
                      {selectedInvoice.customer?.email} |{" "}
                      {selectedInvoice.customer?.phone}
                    </Text>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    textAlign: "right",
                  }}
                >
                  <div>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Date Issued:
                    </Text>
                    <div>
                      <Text strong>
                        {new Date(selectedInvoice.createdAt).toLocaleDateString(
                          "en-CA",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </Text>
                    </div>
                  </div>
                  <div style={{ marginTop: "12px" }}>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      Payment Type:
                    </Text>
                    <div>
                      <Tag color="blue">
                        {selectedInvoice.invoiceType?.toUpperCase()}
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items / Trips Flat Invoice Table */}
              <div style={{ marginBottom: "32px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "2px solid #cbd5e1",
                        backgroundColor: "#f1f5f9",
                      }}
                    >
                      <th
                        style={{
                          padding: "10px 12px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#475569",
                        }}
                      >
                        Trip Description / Route
                      </th>
                      <th
                        style={{
                          padding: "10px 12px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#475569",
                        }}
                      >
                        VRID
                      </th>
                      <th
                        style={{
                          padding: "10px 12px",
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "#475569",
                          textAlign: "right",
                        }}
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.trips?.map((trip, idx) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: "1px solid #e2e8f0" }}
                      >
                        <td style={{ padding: "12px" }}>
                          <div>
                            <Text strong style={{ color: "#334155" }}>
                              {trip.pickup} ➔ {trip.drop}
                            </Text>
                          </div>
                          <Text type="secondary" style={{ fontSize: "12px" }}>
                            Route Segment: {trip.route || "Standard Linehaul"}
                          </Text>
                        </td>
                        <td style={{ padding: "12px", color: "#475569" }}>
                          {trip.vrid || "—"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            textAlign: "right",
                            fontWeight: 600,
                            color: "#0f172a",
                          }}
                        >
                          ${trip.totalCharges?.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Bottom Totals Area */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "260px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                    }}
                  >
                    <Text type="secondary">Subtotal:</Text>
                    <Text>
                      $
                      {selectedInvoice.subtotal?.toFixed(2) ||
                        selectedInvoice.grandTotal?.toFixed(2)}
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <Text type="secondary">Tax / VAT:</Text>
                    <Text>${selectedInvoice.tax?.toFixed(2) || "0.00"}</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      alignItems: "center",
                    }}
                  >
                    <Text strong style={{ fontSize: "16px", color: "#0f172a" }}>
                      Grand Total:
                    </Text>
                    <Text strong style={{ fontSize: "20px", color: "#2563eb" }}>
                      ${selectedInvoice.grandTotal?.toFixed(2)}{" "}
                      {selectedInvoice.currency}
                    </Text>
                  </div>
                </div>
              </div>

              {/* Vendor Signature Placeholder footer */}
              <Divider style={{ marginTop: "40px", marginBottom: "20px" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  Generated via Automated Ledger Core System.
                </Text>
                <Text type="secondary" style={{ fontSize: "11px" }}>
                  Contact: {selectedInvoice.payee?.email}
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
