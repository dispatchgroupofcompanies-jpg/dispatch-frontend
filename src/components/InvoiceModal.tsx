"use client";
import React from "react";
import { Modal, Button, Space, Tag, Grid } from "antd";
import {
  FilePdfOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import InvoicePreview from "./InvoicePreview";
import type { Invoice } from "../types/invoice";

const { useBreakpoint } = Grid;

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
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  if (!invoice) return null;

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      width={isMobile ? "95vw" : 980}
      style={{ top: isMobile ? 10 : 20 }}
      footer={[
        <Button
          key="close"
          size={isMobile ? "middle" : "large"}
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
          gap: isMobile ? 8 : 12,
          flexWrap: "wrap",
          justifyContent: isMobile ? "center" : "space-between",
          backgroundColor: "#f8fafc",
          padding: isMobile ? "12px 16px" : "16px 24px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: isMobile ? 8 : 0,
        }}
      >
        {invoice.pdfUrl ? (
          <Button
            type="default"
            icon={<FilePdfOutlined />}
            href={
              invoice.pdfUrl.startsWith("http://") ||
              invoice.pdfUrl.startsWith("https://")
                ? invoice.pdfUrl
                : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${invoice.pdfUrl}`
            }
            target="_blank"
            style={{ borderRadius: 6, fontSize: isMobile ? 12 : 14 }}
          >
            {isMobile ? "PDF" : "Download Original PDF"}
          </Button>
        ) : (
          <div />
        )}

        {(invoice.invoiceStatus === "pending" ||
          invoice.invoiceStatus === "draft") && (
          <Space
            size={isMobile ? "small" : "middle"}
            direction={isMobile ? "vertical" : "horizontal"}
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => onUpdateStatus(invoice._id, "approved")}
              loading={approveLoading}
              disabled={rejectLoading}
              style={{ background: "#10b981", borderRadius: 6 }}
            >
              {isMobile ? "Approve" : "Approve Invoice"}
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
              {isMobile ? "Reject" : "Reject Invoice"}
            </Button>
          </Space>
        )}
      </div>

      <InvoicePreview invoice={invoice} />
    </Modal>
  );
}
