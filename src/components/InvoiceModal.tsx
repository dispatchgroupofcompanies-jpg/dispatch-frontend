"use client";
import React from "react";
import { Modal, Button, Space, Grid } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DownloadOutlined,
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

  const handleDownloadPDF = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `/api/user/invoice/${invoice._id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to download PDF");
      }

      // Get the blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF. Please try again.");
    }
  };

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            paddingRight: "20px",
          }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#1e293b" }}>
            Invoice #{invoice.invoiceNumber}
          </span>
          <Button
            type="text"
            onClick={onClose}
            style={{
              color: "#dc2626",
              fontSize: "20px",
              fontWeight: "bold",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </Button>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={isMobile ? "95vw" : 900}
      style={{ top: isMobile ? 5 : 20 }}
      footer={[]}
      closeIcon={null}
      styles={{
        body: {
          padding: isMobile ? "8px" : "12px",
          maxHeight: "85vh",
          overflowY: "auto",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          gap: isMobile ? 8 : 12,
          flexWrap: "wrap",
          justifyContent: isMobile ? "center" : "flex-end",
          backgroundColor: "#f8fafc",
          padding: isMobile ? "10px 12px" : "12px 16px",
          borderBottom: "1px solid #e2e8f0",
          marginBottom: isMobile ? 8 : 12,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Space
          size={isMobile ? "small" : "small"}
          direction={isMobile ? "vertical" : "horizontal"}
        >
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownloadPDF}
            size="small"
            style={{ borderRadius: 6, minWidth: "120px" }}
          >
            {isMobile ? "PDF" : "Download"}
          </Button>
          {(invoice.invoiceStatus === "pending" ||
            invoice.invoiceStatus === "draft") && (
            <>
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => onUpdateStatus(invoice._id, "approved")}
                loading={approveLoading}
                disabled={rejectLoading}
                size="small"
                style={{
                  background: "#10b981",
                  borderRadius: 6,
                  minWidth: "100px",
                }}
              >
                {isMobile ? "✓" : "Approve"}
              </Button>
              <Button
                type="primary"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => onUpdateStatus(invoice._id, "rejected")}
                loading={rejectLoading}
                disabled={approveLoading}
                size="small"
                style={{ borderRadius: 6, minWidth: "100px" }}
              >
                {isMobile ? "✗" : "Reject"}
              </Button>
            </>
          )}
        </Space>
      </div>

      <div
        style={{
          padding: isMobile ? "8px" : "12px",
          overflowX: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "210mm",
            minHeight: "296mm",
          }}
        >
          <InvoicePreview invoice={invoice} />
        </div>
      </div>
    </Modal>
  );
}
