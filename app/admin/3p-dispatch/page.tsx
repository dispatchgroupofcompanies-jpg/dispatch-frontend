"use client";

import React, { useEffect, useState } from "react";
import { Table, Card, Typography, message, Button, Grid, Select, Tooltip, Modal, Descriptions, Image, Tag } from "antd";
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
      title: "Driver",
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

            return (
              <div
                key={record._id}
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 14,
                  background: "#f0fdf4",
                  borderBottom: "1px solid #a7f3d0",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "auto minmax(0, 1fr)",
                    alignItems: "center",
                    gap: 10,
                    paddingBottom: 10,
                    borderBottom: "1px solid #a7f3d0",
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
                      color: "#064e3b",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.thirdPartyCarrierName || "—"}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: "#047857" }}>
                  Dispatcher: <strong>{record.dispatcher || "—"}</strong>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 4 }}>
                  <div style={{ fontSize: 11, color: "#047857" }}>CAD Amount</div>
                  <div style={{ fontWeight: 700, color: "#022c22", fontSize: 15 }}>
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

        {/* Details Modal */}
        <Modal
          open={Boolean(detailsRecord)}
          onCancel={() => setDetailsRecord(null)}
          footer={null}
          width={320}
          centered
          title={<span style={{ color: "#065f46" }}>Dispatch Details</span>}
          bodyStyle={{ maxHeight: "70vh", overflowY: "auto", background: "#f0fdf4" }}
        >
          {detailsRecord && (
            <div style={{ padding: "8px 0" }}>
              {detailsRecord.screenshotUrl && (
                <Image
                  src={detailsRecord.screenshotUrl}
                  alt="Load screenshot"
                  width="100%"
                  style={{
                    maxHeight: 200,
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "#ecfdf5",
                    marginBottom: 16,
                  }}
                />
              )}
              <Descriptions
                column={1}
                size="small"
                labelStyle={{ fontWeight: 600, color: "#047857" }}
                contentStyle={{ color: "#064e3b" }}
              >
                <Descriptions.Item label="Driver">
                  {detailsRecord.thirdPartyCarrierName || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Dispatcher">
                  {detailsRecord.dispatcher || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="CAD Amount">
                  CAD ${Number(detailsRecord.tripCharges || 0).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Invoice Status">
                  {statusTag(detailsRecord.invoiceStatus)}
                </Descriptions.Item>
                <Descriptions.Item label="Created By">
                  {detailsRecord.createdBy?.email || "—"}
                </Descriptions.Item>
                <Descriptions.Item label="Created At">
                  {new Date(detailsRecord.createdAt).toLocaleString()}
                </Descriptions.Item>
              </Descriptions>
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
          rowClassName={() => "green-table-row"}
          style={{ background: "#f0fdf4" }}
        />
      </Card>

      {/* Details Modal */}
      <Modal
        open={Boolean(detailsRecord)}
        onCancel={() => setDetailsRecord(null)}
        footer={null}
        width={680}
        centered
        title={<span style={{ color: "#065f46" }}>3P Dispatch Details</span>}
      >
        {detailsRecord && (
          <div style={{ padding: "8px 0" }}>
            {detailsRecord.screenshotUrl && (
              <Image
                src={detailsRecord.screenshotUrl}
                alt="Load screenshot"
                width="100%"
                style={{
                  maxHeight: 250,
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "#ecfdf5",
                  marginBottom: 20,
                }}
              />
            )}
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2 }}
              size="small"
              labelStyle={{ fontWeight: 600, color: "#047857", width: 165, background: "#d1fae5" }}
              contentStyle={{ color: "#064e3b", background: "#f0fdf4" }}
            >
              <Descriptions.Item label="Driver">
                {detailsRecord.thirdPartyCarrierName || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Dispatcher">
                {detailsRecord.dispatcher || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="CAD Amount">
                CAD ${Number(detailsRecord.tripCharges || 0).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Payment ID">
                {detailsRecord.driverName ? (
                  <Text copyable={{ tooltips: ["Copy", "Copied!"] }}>
                    {detailsRecord.driverName}
                  </Text>
                ) : (
                  "—"
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Invoice Status">
                {statusTag(detailsRecord.invoiceStatus)}
              </Descriptions.Item>
              <Descriptions.Item label="Created By">
                {detailsRecord.createdBy?.email || "—"}
              </Descriptions.Item>
              <Descriptions.Item label="Created At">
                {new Date(detailsRecord.createdAt).toLocaleString()}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
}
