"use client";

import React, { useEffect, useState } from "react";
import { Table, Card, Typography, message, Button, Grid, Select, Tooltip, Modal, Image, Tag } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { getAdminLoadboard, updateAdminLoadboardStatus } from "../../../src/services/admin/loadboard";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface LoadBoardRecord {
  _id: string;
  invoiceStatus?: string;
  paymentStatus?: string;
  createdBy?: { email: string; name: string };
  createdAt: string;
  vrid?: string;
  load1Id?: string;
  carrierName?: string;
  thirdPartyCarrierName?: string;
  driverName?: string;
  dispatcher?: string;
  tripCharges?: number;
  screenshotUrl?: string;
  [key: string]: any;
}

const statusStyle = (value: string, isDisabled: boolean = false) => {
  const isGenerated = value === "generated";
  return {
    width: "100%",
    color: isGenerated ? "#15803d" : "#dc2626",
    fontWeight: 600,
    background: isGenerated ? "#dcfce7" : "#fef2f2",
    borderColor: isGenerated ? "#86efac" : "#fecaca",
    borderRadius: 6,
    opacity: isDisabled ? 0.75 : 1,
  };
};

const statusTag = (value: string | undefined) => {
  const isGenerated = value === "generated";
  return (
    <Tag color={isGenerated ? "green" : "red"} style={{ margin: 0, fontWeight: 600 }}>
      {isGenerated ? "Invoice Generated" : "Invoice Pending"}
    </Tag>
  );
};

// Helper component for Heading Top -> Data Bottom layout
const DetailItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div
    style={{
      background: "#ffffff",
      padding: "10px 12px",
      borderRadius: "8px",
      border: "1px solid #d1fae5",
      boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    }}
  >
    <span
      style={{
        fontSize: "11px",
        fontWeight: 700,
        color: "#059669",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {label}
    </span>
    <div
      style={{
        fontSize: "13px",
        fontWeight: 600,
        color: "#064e3b",
        wordBreak: "break-word",
      }}
    >
      {children}
    </div>
  </div>
);

export default function Admin3PDispatchPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<LoadBoardRecord[]>([]);
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});
  const [detailsRecord, setDetailsRecord] = useState<LoadBoardRecord | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await getAdminLoadboard({ limit: 500 });
      if (res && res.success) {
        setRecords(res.data || []);
      } else {
        message.error(res?.message || "Failed to load 3P dispatch records");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch 3P dispatch records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleStatusChange = async (
    recordId: string,
    field: "invoiceStatus" | "paymentStatus",
    value: string
  ) => {
    setStatusUpdating((prev) => ({ ...prev, [recordId]: true }));
    try {
      const statusUpdate = { [field]: value };
      const res = await updateAdminLoadboardStatus(recordId, statusUpdate);
      if (res.success) {
        setRecords((prev) =>
          prev.map((r) => (r._id === recordId ? res.data : r))
        );
        message.success("Status updated successfully");
      } else {
        message.error(res.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to update status");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [recordId]: false }));
    }
  };

  const columns = [
    {
      title: "S.No",
      key: "serial",
      width: 60,
      render: (_v: any, _r: any, index: number) => (
        <span
          style={{
            fontWeight: 700,
            color: "#fff",
            background: "#059669",
            padding: "4px 9px",
            borderRadius: 6,
            display: "inline-block",
          }}
        >
          #{index + 1}
        </span>
      ),
    },
    {
      title: "Pay To / Company Driver",
      dataIndex: "thirdPartyCarrierName",
      width: 150,
      ellipsis: true,
      render: (value: string) => (
        <span style={{ fontWeight: 600, color: "#064e3b" }}>
          {value || "—"}
        </span>
      ),
    },
    {
      title: "Dispatcher",
      dataIndex: "dispatcher",
      width: 150,
      ellipsis: true,
      render: (value: string) => value || "—",
    },
    {
      title: "CAD",
      dataIndex: "tripCharges",
      width: 120,
      render: (value: number) => (
        <span style={{ fontWeight: 700, color: "#022c22", whiteSpace: "nowrap" }}>
          CAD ${Number(value || 0).toLocaleString()}
        </span>
      ),
    },
    {
      title: "Invoice",
      dataIndex: "invoiceStatus",
      width: 140,
      render: (value: string, record: LoadBoardRecord) => {
        const isGenerated = value === "generated";

        return (
          <Select
            size="small"
            value={value || "pending"}
            disabled={isGenerated}
            style={statusStyle(value || "pending", isGenerated)}
            onChange={(val) => handleStatusChange(record._id, "invoiceStatus", val)}
            loading={statusUpdating[record._id]}
            options={[
              { value: "generated", label: "Generated" },
              { value: "pending", label: "Pending" },
            ]}
          />
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_v: any, record: LoadBoardRecord) => (
        <Tooltip title="View">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setDetailsRecord(record)}
            style={{ color: "#047857", fontWeight: 600 }}
          />
        </Tooltip>
      ),
    },
  ];

  if (isMobile) {
    return (
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "12px",
          minHeight: "calc(100vh - 80px)",
          background: "#ecfdf5",
        }}
      >
        <Card
          title={<h3 style={{ margin: 0, color: "#065f46" }}>3P Dispatch Records</h3>}
          style={{ background: "#d1fae5", borderColor: "#a7f3d0" }}
          bodyStyle={{ padding: 0 }}
        >
          {loading && (
            <div style={{ textAlign: "center", padding: 24, color: "#047857" }}>
              Loading dispatch records...
            </div>
          )}
          {!loading && records.length === 0 && (
            <div style={{ textAlign: "center", padding: 24, color: "#047857" }}>
              No dispatch records found.
            </div>
          )}
          {records.map((record, index) => {
            const isInvoiceGenerated = record.invoiceStatus === "generated";
            const rowColors = isInvoiceGenerated
              ? { background: "#f0fdf4", border: "#86efac", text: "#166534" }
              : { background: "#fef2f2", border: "#fecaca", text: "#b91c1c" };

            return (
              <div
                key={record._id}
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 14,
                  background: rowColors.background,
                  borderBottom: `1px solid ${rowColors.border}`,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr)",
                    alignItems: "center",
                    gap: 10,
                    paddingBottom: 10,
                    borderBottom: `1px solid ${rowColors.border}`,
                  }}
                >
                  <span
                    style={{
                      fontWeight: 700,
                      color: "#fff",
                      background: "#059669",
                      padding: "4px 9px",
                      borderRadius: 6,
                    }}
                  >
                    #{index + 1}
                  </span>
                  <span
                    style={{
                      fontWeight: 700,
                      color: rowColors.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.thirdPartyCarrierName || "—"}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: rowColors.text }}>
                  Dispatcher: <strong>{record.dispatcher || "—"}</strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
                  <div style={{ fontSize: 11, color: rowColors.text }}>CAD Amount</div>
                  <div style={{ fontWeight: 700, color: rowColors.text, fontSize: 15 }}>
                    CAD ${Number(record.tripCharges || 0).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8 }}>
                  <Select
                    size="small"
                    value={record.invoiceStatus || "pending"}
                    disabled={isInvoiceGenerated}
                    style={statusStyle(record.invoiceStatus || "pending", isInvoiceGenerated)}
                    onChange={(value) => handleStatusChange(record._id, "invoiceStatus", value)}
                    loading={statusUpdating[record._id]}
                    options={[
                      { value: "generated", label: "Generated" },
                      { value: "pending", label: "Pending" },
                    ]}
                  />
                </div>

                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => setDetailsRecord(record)}
                  style={{ color: "#047857", borderColor: "#a7f3d0", background: "#ffffff" }}
                >
                  View Details
                </Button>
              </div>
            );
          })}
        </Card>

        {/* Mobile Details Modal */}
        <Modal
          open={Boolean(detailsRecord)}
          onCancel={() => setDetailsRecord(null)}
          footer={null}
          width={340}
          centered
          title={<span style={{ color: "#065f46", fontWeight: 700 }}>Dispatch Details</span>}
          bodyStyle={{ maxHeight: "80vh", overflowY: "auto", background: "#ecfdf5", padding: "16px" }}
        >
          {detailsRecord && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {detailsRecord.screenshotUrl && (
                <Image
                  src={detailsRecord.screenshotUrl}
                  alt="Load screenshot"
                  width="100%"
                  style={{
                    maxHeight: 180,
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "#ffffff",
                    border: "1px solid #d1fae5",
                  }}
                />
              )}
              <DetailItem label="Company Name / Payee">
                {detailsRecord.carrierName || "—"}
              </DetailItem>
              <DetailItem label="Pay To / Company Driver">
                {detailsRecord.thirdPartyCarrierName || "—"}
              </DetailItem>
              <DetailItem label="Dispatcher">
                {detailsRecord.dispatcher || "—"}
              </DetailItem>
              <DetailItem label="CAD Amount">
                CAD ${Number(detailsRecord.tripCharges || 0).toLocaleString()}
              </DetailItem>
              <DetailItem label="Invoice Status">
                {statusTag(detailsRecord.invoiceStatus)}
              </DetailItem>
              <DetailItem label="Created By">
                {detailsRecord.createdBy?.email || "—"}
              </DetailItem>
              <DetailItem label="Created At">
                {new Date(detailsRecord.createdAt).toLocaleString()}
              </DetailItem>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: 24,
        minHeight: "calc(100vh - 80px)",
        background: "#ecfdf5",
      }}
    >
      <Card
        title={<h3 style={{ margin: 0, color: "#065f46" }}>3P Dispatch Records</h3>}
        style={{ background: "#f0fdf4", borderColor: "#a7f3d0" }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          dataSource={records}
          columns={columns}
          rowKey={(r) => r._id}
          loading={loading}
          pagination={{ pageSize: 20 }}
          size="middle"
          rowClassName={(record) =>
            record.invoiceStatus === "generated"
              ? "loadboard-row-generated"
              : "loadboard-row-pending"
          }
          style={{ background: "#f0fdf4" }}
        />
      </Card>

      {/* Desktop Details Modal - 3 per column layout */}
      <Modal
        open={Boolean(detailsRecord)}
        onCancel={() => setDetailsRecord(null)}
        footer={null}
        width={780}
        centered
        title={<span style={{ color: "#065f46", fontWeight: 700, fontSize: "18px" }}>3P Dispatch Details</span>}
        bodyStyle={{ background: "#f0fdf4", padding: "20px" }}
      >
        {detailsRecord && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {detailsRecord.screenshotUrl && (
              <Image
                src={detailsRecord.screenshotUrl}
                alt="Load screenshot"
                width="100%"
                style={{
                  maxHeight: 250,
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "#ffffff",
                  border: "1px solid #a7f3d0",
                }}
              />
            )}

            {/* 3-Column Grid Layout */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <DetailItem label="Company Name / Payee">
                {detailsRecord.carrierName || "—"}
              </DetailItem>
              <DetailItem label="Pay To / Company Driver">
                {detailsRecord.thirdPartyCarrierName || "—"}
              </DetailItem>
              <DetailItem label="Dispatcher">
                {detailsRecord.dispatcher || "—"}
              </DetailItem>
              <DetailItem label="CAD Amount">
                CAD ${Number(detailsRecord.tripCharges || 0).toLocaleString()}
              </DetailItem>
              <DetailItem label="Payment ID">
                {detailsRecord.driverName ? (
                  <Text copyable={{ tooltips: ["Copy", "Copied!"] }}>
                    {detailsRecord.driverName}
                  </Text>
                ) : (
                  "—"
                )}
              </DetailItem>
              <DetailItem label="Invoice Status">
                {statusTag(detailsRecord.invoiceStatus)}
              </DetailItem>
              <DetailItem label="Created By">
                {detailsRecord.createdBy?.email || "—"}
              </DetailItem>
              <DetailItem label="Created At">
                {new Date(detailsRecord.createdAt).toLocaleString()}
              </DetailItem>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .ant-table-tbody > tr.loadboard-row-generated > td {
          background: #f0fdf4 !important;
        }
        .ant-table-tbody > tr.loadboard-row-pending > td {
          background: #fef2f2 !important;
        }
        .ant-table-tbody > tr.loadboard-row-generated:hover > td {
          background: #dcfce7 !important;
        }
        .ant-table-tbody > tr.loadboard-row-pending:hover > td {
          background: #fee2e2 !important;
        }
      `}</style>
    </div>
  );
}