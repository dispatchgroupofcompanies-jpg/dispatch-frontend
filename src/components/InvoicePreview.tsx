"use client";

import React from "react";
import { Divider, Tag, Typography, Row, Col } from "antd";
import type { Invoice } from "../types/invoice";

const { Text, Title } = Typography;

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

const getStatusTagStyle = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        backgroundColor: "#ecfdf5",
        borderColor: "#bbf7d0",
        color: "#166534",
      };
    case "rejected":
      return {
        backgroundColor: "#fee2e2",
        borderColor: "#fecaca",
        color: "#991b1b",
      };
    case "paid":
      return {
        backgroundColor: "#eff6ff",
        borderColor: "#bfdbfe",
        color: "#1d4ed8",
      };
    case "pending":
      return {
        backgroundColor: "#fef3c7",
        borderColor: "#fde68a",
        color: "#92400e",
      };
    default:
      return {
        backgroundColor: "#f1f5f9",
        borderColor: "#e2e8f0",
        color: "#475569",
      };
  }
};

export default function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const tripCount = invoice.trips?.length || 0;
  const title = tripCount > 1 ? "INVOICE - T" : "INVOICE - 1";

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
        padding: 28,
        color: "#1e293b",
        overflow: "hidden",
        borderRadius: 16,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-45deg)",
          fontSize: 48,
          fontWeight: 900,
          color: "rgba(226, 232, 240, 0.25)",
          letterSpacing: 4,
          whiteSpace: "nowrap",
          zIndex: 0,
          pointerEvents: "none",
          userSelect: "none",
          textAlign: "center",
        }}
      >
        EXTREME LOGISTICS
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 14,
          }}
        >
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                textTransform: "uppercase",
                color: "#102a63",
                letterSpacing: 1,
                lineHeight: 1,
              }}
            >
              {title}
            </Title>
            <Text
              style={{
                fontSize: 12,
                color: "#64748b",
                display: "block",
                marginTop: 6,
              }}
            >
              Num: <strong>#{invoice.invoiceNumber}</strong>
            </Text>
          </div>

          <div style={{ textAlign: "right", minWidth: 180 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 16px",
                borderRadius: 999,
                border: `1px solid ${getStatusTagStyle(invoice.invoiceStatus).borderColor}`,
                backgroundColor: getStatusTagStyle(invoice.invoiceStatus)
                  .backgroundColor,
                color: getStatusTagStyle(invoice.invoiceStatus).color,
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: 11,
                letterSpacing: 0.75,
                minWidth: 96,
              }}
            >
              {invoice.invoiceStatus?.toUpperCase() || "DRAFT"}
            </div>
            <div style={{ marginTop: 10, color: "#64748b", fontSize: 12 }}>
              Date: {formatDate(invoice.createdAt)}
            </div>
          </div>
        </div>

        <Divider style={{ margin: "0 0 24px 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            marginBottom: 24,
          }}
        >
          <div>
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 10,
                color: "#475569",
                letterSpacing: 0.6,
              }}
            >
              EXTREME LOGISTIC INVOICE FROM:
            </Text>
            <div style={{ marginTop: 10 }}>
              <Text
                strong
                style={{ fontSize: 14, color: "#dc2626", display: "block" }}
              >
                {invoice.payee?.companyName || "N/A"}
              </Text>
              <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.6 }}>
                {invoice.payee?.address1 || invoice.payee?.address || "N/A"}
              </div>
              <div style={{ marginTop: 8, color: "#334155", fontSize: 12 }}>
                <strong>Driver Name:</strong>{" "}
                {invoice.payee?.contactPerson ||
                  invoice.payee?.driverName ||
                  "N/A"}
                <br />
                <strong>Phone:</strong> {invoice.payee?.phone || "N/A"}
                <br />
                <strong>Email:</strong> {invoice.payee?.email || "N/A"}
                <br />
                <strong>GST/HST:</strong> {invoice.payee?.gstNumber || "N/A"}
              </div>
            </div>
          </div>

          <div>
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 10,
                color: "#475569",
                letterSpacing: 0.6,
              }}
            >
              INVOICE TO:
            </Text>
            <div style={{ marginTop: 10 }}>
              <Text
                strong
                style={{ fontSize: 14, color: "#2563eb", display: "block" }}
              >
                {invoice.customer?.companyName ||
                  invoice.customer?.customerName ||
                  "N/A"}
              </Text>
              <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.6 }}>
                {invoice.customer?.address1 ||
                  invoice.customer?.address ||
                  "N/A"}
              </div>
              <div style={{ marginTop: 8, color: "#334155", fontSize: 12 }}>
                <strong>Attention:</strong>{" "}
                {invoice.customer?.contactPerson || "N/A"}
                <br />
                <strong>Phone:</strong> {invoice.customer?.phone || "N/A"}
                <br />
                <strong>Email:</strong> {invoice.customer?.email || "N/A"}
                <br />
                <strong>GST/HST:</strong> {invoice.customer?.gstNumber || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {invoice.invoicePeriod?.startDate && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: 12,
              borderRadius: 6,
              marginBottom: 24,
              color: "#334155",
              fontSize: 12,
            }}
          >
            <strong>📅 Billing Period:</strong>{" "}
            {formatDate(invoice.invoicePeriod.startDate)} —{" "}
            {formatDate(invoice.invoicePeriod.endDate)}
          </div>
        )}

        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              tableLayout: "fixed",
              minWidth: 860,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#102a63", color: "#ffffff" }}>
                <th style={{ ...tableHeaderStyle, width: "4%" }}>#</th>
                <th style={{ ...tableHeaderStyle, width: "12%" }}>Date</th>
                <th
                  style={{
                    ...tableHeaderStyle,
                    width: "16%",
                    whiteSpace: "nowrap",
                  }}
                >
                  VRID
                </th>
                <th
                  style={{
                    ...tableHeaderStyle,
                    width: "12%",
                    whiteSpace: "nowrap",
                  }}
                >
                  Route
                </th>
                <th
                  style={{
                    ...tableHeaderStyle,
                    width: "34%",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "right",
                    width: "10%",
                    whiteSpace: "nowrap",
                  }}
                >
                  Charges
                </th>
                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "center",
                    width: "8%",
                    whiteSpace: "nowrap",
                  }}
                >
                  Dispatch%
                </th>
                <th
                  style={{
                    ...tableHeaderStyle,
                    textAlign: "right",
                    width: "12%",
                    paddingRight: 16,
                    whiteSpace: "nowrap",
                  }}
                >
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {(invoice.trips || []).length > 0 ? (
                invoice.trips!.map((trip, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={tableCellStyle}>{index + 1}</td>
                    <td style={tableCellStyle}>
                      {formatDate(trip.tripDate || null)}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        fontWeight: 700,
                        color: "#1e293b",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {trip.vrid || "N/A"}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {trip.route || "N/A"}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {`${trip.pickup || "N/A"} to ${trip.drop || "N/A"}`}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      ${trip.totalCharges?.toFixed(2) ?? "0.00"}
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign: "center",
                        color: "#475569",
                      }}
                    >
                      {trip.dispatchPercent ?? 0}%
                    </td>
                    <td
                      style={{
                        ...tableCellStyle,
                        textAlign: "right",
                        fontWeight: 700,
                        color: "#b91c1c",
                      }}
                    >
                      ${(trip.dispatchAmount ?? 0).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      padding: 20,
                      textAlign: "center",
                      color: "#94a3b8",
                    }}
                  >
                    No active trips found in system database
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 320 }}>
            <div style={summaryRowStyle}>
              <Text type="secondary">Subtotal:</Text>
              <Text>${(invoice.subtotal ?? 0).toFixed(2)}</Text>
            </div>
            {invoice.tax ? (
              <div style={summaryRowStyleWithBorder}>
                <Text type="secondary">Tax / VAT:</Text>
                <Text>${(invoice.tax ?? 0).toFixed(2)}</Text>
              </div>
            ) : null}
            <div
              style={{
                ...summaryRowStyle,
                marginTop: 16,
                alignItems: "center",
                borderTop: "1px solid #e2e8f0",
                paddingTop: 16,
              }}
            >
              <Text strong style={{ fontSize: 15, color: "#1e293b" }}>
                Grand Total:
              </Text>
              <Text strong style={{ fontSize: 18, color: "#2563eb" }}>
                {invoice.currency || "CAD"} $
                {(invoice.grandTotal ?? 0).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>

        {(invoice.accountNumber ||
          invoice.institutionNumber ||
          invoice.transitNumber ||
          invoice.eTransfer ||
          invoice.payee?.eTransfer ||
          invoice.payee?.eTransferAddress) && (
          <div
            style={{
              marginTop: 28,
              padding: 20,
              backgroundColor: "#f8fafc",
              borderRadius: 8,
            }}
          >
            <Row gutter={[16, 16]}>
              {invoice.accountNumber && (
                <Col
                  xs={24}
                  md={
                    invoice.eTransfer ||
                    invoice.payee?.eTransfer ||
                    invoice.payee?.eTransferAddress
                      ? 12
                      : 24
                  }
                >
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    Direct Deposit Details
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      display: "block",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Institution Number: {invoice.institutionNumber || "N/A"} |
                    Transit Number: {invoice.transitNumber || "N/A"} | Account
                    Number: {invoice.accountNumber}
                  </Text>
                </Col>
              )}
              {(invoice.eTransfer ||
                invoice.payee?.eTransfer ||
                invoice.payee?.eTransferAddress) && (
                <Col xs={24} md={invoice.accountNumber ? 12 : 24}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 6,
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    💥 E-Transfer Details
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#1e293b", fontWeight: 600 }}
                  >
                    {invoice.eTransfer ||
                      invoice.payee?.eTransfer ||
                      invoice.payee?.eTransferAddress}
                  </Text>
                </Col>
              )}
            </Row>
          </div>
        )}

        {invoice.notes && (
          <div style={{ marginTop: 20, fontSize: 12, color: "#64748b" }}>
            <Text strong>Notes:</Text> {invoice.notes}
          </div>
        )}
      </div>
    </div>
  );
}

const tableHeaderStyle: React.CSSProperties = {
  padding: "10px 10px",
  fontSize: 12,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.2,
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const tableCellStyle: React.CSSProperties = {
  padding: "6px 10px",
  fontSize: 12,
  color: "#475569",
  verticalAlign: "middle",
  lineHeight: 1.35,
  overflow: "hidden",
  textOverflow: "ellipsis",
  overflowWrap: "anywhere",
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
  color: "#475569",
};

const summaryRowStyleWithBorder: React.CSSProperties = {
  ...summaryRowStyle,
  borderBottom: "1px solid #e2e8f0",
};
