"use client";

import React from "react";
import { Descriptions, Image, Modal, Tag, Typography } from "antd";
import type { LoadBoardRecord } from "../types";

const { Text } = Typography;

interface Props {
  open: boolean;
  record: LoadBoardRecord | null;
  onClose: () => void;
}

const statusTag = (value: string | undefined, type: "invoice" | "payment") => {
  const complete = value === "generated" || value === "paid";
  const color = complete ? (type === "invoice" ? "blue" : "green") : "gold";
  const label =
    type === "invoice"
      ? value === "generated"
        ? "Invoice Generated"
        : "Invoice Pending"
      : value === "paid"
      ? "Paid"
      : "Pending";
  return (
    <Tag color={color} style={{ margin: 0, fontWeight: 600 }}>
      {label}
    </Tag>
  );
};

export default function LoadBoardDetailsModal({ open, record, onClose }: Props) {
  if (!record) return null;

  const payeeCompany = record.companyName || record.carrierName;
  const payToCompany = record.carrierName || record.thirdPartyCarrierName;
  const loadDate = record.loadDate || record.date;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={680}
      centered
      title="3P Dispatch Details"
    >
      <div style={{ padding: "8px 0" }}>
        {record.screenshotUrl && (
          <div style={{ marginBottom: 20 }}>
            <Text strong style={{ display: "block", marginBottom: 8, color: "#475569" }}>
              Load Screenshot
            </Text>
            <Image
              src={record.screenshotUrl}
              alt="Load screenshot"
              preview={{ src: record.screenshotUrl }}
              width="100%"
              style={{
                maxHeight: 250,
                objectFit: "contain",
                borderRadius: 8,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
              }}
            />
          </div>
        )}
        <Descriptions
          bordered
          column={{ xs: 1, sm: 2 }}
          size="small"
          labelStyle={{ fontWeight: 600, color: "#475569", width: 165 }}
        >
          <Descriptions.Item label="Company Name / Payee">
            {payeeCompany || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Pay To / Company Driver">
            {payToCompany || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Driver Name">
            {record.driverName || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="CAD Amount">
            CAD ${Number(record.tripCharges || 0).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {record.address || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Postal Code">
            {record.postalCode || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="E-Transfer Email">
            {record.eTransfer || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Load Date">
            {loadDate ? new Date(loadDate).toLocaleDateString() : "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Dispatcher">
            {record.dispatcher || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Invoice Status">
            {statusTag(record.invoiceStatus, "invoice")}
          </Descriptions.Item>
         
        </Descriptions>
      </div>
    </Modal>
  );
}