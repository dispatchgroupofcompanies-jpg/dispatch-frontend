"use client";
import React from "react";
import { Modal, Button, Space, Tag } from "antd";
import {
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import InvoicePreview from "./InvoicePreview";
import type { Invoice } from "../types/invoice";

interface Props {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus: (
    id: string,
    status: "approved" | "rejected",
  ) => Promise<void>;
  approveLoading: boolean;
  rejectLoading: boolean;
}

export default function InvoiceModal({
  invoice,
  open,
  onClose,
  onUpdateStatus,
  approveLoading,
  rejectLoading,
}: Props) {
  if (!invoice) return null;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      width={980}
      style={{ top: 20 }}
      footer={[
        <Button
          key="close"
          size="large"
          onClick={onClose}
          style={{ borderRadius: 6 }}
        >
          Close
        </Button>,
      ]}
    >
      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          justifyContent: "space-between",
          backgroundColor: "#f8fafc",
          padding: "16px 24px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        {invoice.pdfUrl ? (
          <Button
            type="default"
            icon={<FilePdfOutlined />}
            href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${invoice.pdfUrl}`}
            target="_blank"
            style={{ borderRadius: 6 }}
          >
            Download Original PDF
          </Button>
        ) : (
          <div />
        )}

        {(invoice.invoiceStatus === "pending" ||
          invoice.invoiceStatus === "draft") && (
          <Space>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => onUpdateStatus(invoice._id, "approved")}
              loading={approveLoading}
              disabled={rejectLoading}
              style={{ background: "#10b981", borderRadius: 6 }}
            >
              Approve Invoice
            </Button>
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => onUpdateStatus(invoice._id, "rejected")}
              loading={rejectLoading}
              disabled={approveLoading}
              style={{ borderRadius: 6 }}
            >
              Reject Invoice
            </Button>
          </Space>
        )}
      </div>

      <InvoicePreview invoice={invoice} />
    </Modal>
  );
}
