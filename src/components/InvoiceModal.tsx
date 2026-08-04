"use client";
import React from "react";
import { Modal, Button, Space, Grid } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import InvoicePreview from "./InvoicePreview";
import type { Invoice } from "../types/invoice";
import { getPayeeSerialNumbers } from "../utils/invoiceSerial";

const { useBreakpoint } = Grid;

interface Props {
  invoice: Invoice | null;
  open: boolean;
  onClose: () => void;
  onUpdateStatus?: (
    id: string,
    status: "approved" | "rejected",
  ) => Promise<void>;
  approveLoading?: boolean;
  rejectLoading?: boolean;
  allInvoices?: Invoice[];
  /** Only admins can approve/reject invoices. Defaults to false. */
  isAdmin?: boolean;
}

export default function InvoiceModal({
  invoice,
  open,
  onClose,
  onUpdateStatus,
  approveLoading = false,
  rejectLoading = false,
  allInvoices = [],
  isAdmin = false,
}: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const payeeSerialNumbers = React.useMemo(
    () => getPayeeSerialNumbers(allInvoices),
    [allInvoices],
  );

  if (!invoice) return null;

  const serialNumber = payeeSerialNumbers.get(invoice._id) || 1;
  // Approve/reject is an admin-only action. Regular users must never see it.
  const canModerate =
    isAdmin &&
    typeof onUpdateStatus === "function" &&
    (invoice.invoiceStatus === "pending" ||
      invoice.invoiceStatus === "draft");

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            width: "100%",
            paddingRight: isMobile ? "8px" : "20px",
          }}
        >
          <Button
            type="text"
            onClick={onClose}
            aria-label="Close invoice preview"
            title="Close invoice preview"
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
      width={isMobile ? "100vw" : 900} // Full screen width on mobile
      style={{
        top: isMobile ? 0 : 20,
        margin: isMobile ? 0 : undefined,
        padding: 0,
        maxWidth: "100vw",
      }}
      footer={[]}
      closeIcon={null}
      styles={{
        body: {
          padding: 0, // Zero padding to remove side whitespace
          maxHeight: isMobile ? "100vh" : "85vh",
          overflow: "hidden",
        },
      }}
    >
      {canModerate && (
        <div
          style={{
            display: "flex",
            gap: isMobile ? 8 : 12,
            flexWrap: "wrap",
            justifyContent: isMobile ? "center" : "flex-end",
            backgroundColor: "#f8fafc",
            padding: isMobile ? "6px 8px" : "12px 16px",
            borderBottom: "1px solid #e2e8f0",
            marginBottom: 0,
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <Space
            size="small"
            direction={isMobile ? "horizontal" : "horizontal"}
          >
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => onUpdateStatus?.(invoice._id, "approved")}
              loading={approveLoading}
              disabled={rejectLoading}
              size="small"
              style={{
                background: "#10b981",
                borderRadius: 6,
                minWidth: "90px",
              }}
            >
              {isMobile ? "✓ Approve" : "Approve"}
            </Button>
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => onUpdateStatus?.(invoice._id, "rejected")}
              loading={rejectLoading}
              disabled={approveLoading}
              size="small"
              style={{ borderRadius: 6, minWidth: "90px" }}
            >
              {isMobile ? "✗ Reject" : "Reject"}
            </Button>
          </Space>
        </div>
      )}

      <div
        style={{
          padding: 0,
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <InvoicePreview invoice={invoice} serialNumber={serialNumber} />
      </div>
    </Modal>
  );
}