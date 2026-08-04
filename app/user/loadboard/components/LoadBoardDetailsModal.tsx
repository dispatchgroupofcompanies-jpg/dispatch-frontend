"use client";

import React from "react";
import { Descriptions, Image, Modal, Tag } from "antd";
import type { LoadBoardRecord } from "../types";

interface Props {
  open: boolean;
  record: LoadBoardRecord | null;
  onClose: () => void;
}

const statusTag = (value: string | undefined, type: "invoice" | "payment") => {
  const complete = value === "generated" || value === "paid";
  const color = complete ? (type === "invoice" ? "blue" : "green") : "gold";
  const label = type === "invoice"
    ? value === "generated" ? "Invoice Generated" : "Invoice Pending"
    : value === "paid" ? "Paid" : "Pending";
  return <Tag color={color} style={{ margin: 0, fontWeight: 600 }}>{label}</Tag>;
};

export default function LoadBoardDetailsModal({ open, record, onClose }: Props) {
  if (!record) return null;

  return <Modal open={open} onCancel={onClose} footer={null} width={680} centered title="3P Dispatch Details">
    <div style={{ padding: "8px 0" }}>
      {record.screenshotUrl && <Image src={record.screenshotUrl} alt="Load screenshot" width="100%" style={{ maxHeight: 250, objectFit: "contain", borderRadius: 8, background: "#f8fafc", marginBottom: 20 }} />}
      <Descriptions bordered column={{ xs: 1, sm: 2 }} size="small" labelStyle={{ fontWeight: 600, color: "#475569", width: 135 }}>
        <Descriptions.Item label="Company Name">{record.carrierName || "—"}</Descriptions.Item>
        <Descriptions.Item label="VRID">{record.vrid || "—"}</Descriptions.Item>
        <Descriptions.Item label="CAD Amount">CAD ${Number(record.tripCharges || 0).toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="Driver Name">{record.driverName || "—"}</Descriptions.Item>
        <Descriptions.Item label="Invoice Status">{statusTag(record.invoiceStatus, "invoice")}</Descriptions.Item>
        <Descriptions.Item label="Payment Status">{statusTag(record.paymentStatus, "payment")}</Descriptions.Item>
      </Descriptions>
    </div>
  </Modal>;
}
