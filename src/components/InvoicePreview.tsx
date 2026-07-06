"use client";

import React from "react";
import { Divider, Typography, Row, Col, Grid } from "antd";
import type { Invoice } from "../types/invoice";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

// Mask GST/HST number to show only last 6 digits
const maskGstNumber = (gstNumber?: string) => {
  if (!gstNumber || gstNumber.length <= 6) return gstNumber || "N/A";
  const lastSix = gstNumber.slice(-6);
  return `******${lastSix}`;
};

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
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const tripCount = invoice.trips?.length || 0;
  const title = tripCount > 1 ? "INVOICE - T" : "INVOICE - 1";

  const containerPadding = isMobile ? "12px 16px" : "20px 24px";

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#ffffff",
        padding: containerPadding,
        color: "#1e293b",
        overflow: "hidden",
        borderRadius: isMobile ? 8 : 12,
      }}
    >
      {/* Background Watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-45deg)",
          fontSize: 54,
          fontWeight: 900,
          color: "rgba(226, 232, 240, 0.22)",
          letterSpacing: 6,
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
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: isMobile ? 12 : 16,
            marginBottom: isMobile ? 8 : 10,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <div>
            <Title
              level={2}
              style={{
                margin: 0,
                textTransform: "uppercase",
                color: "#102a63",
                letterSpacing: 0.5,
                lineHeight: 1.1,
                fontSize: isMobile ? 20 : 24,
              }}
            >
              {title}
            </Title>
            <Text
              style={{
                fontSize: isMobile ? 11 : 12,
                color: "#64748b",
                display: "block",
                marginTop: 4,
              }}
            >
              Num: <strong>#{invoice.invoiceNumber}</strong>
            </Text>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: isMobile ? "4px 10px" : "6px 14px",
                borderRadius: 999,
                border: `1px solid ${getStatusTagStyle(invoice.invoiceStatus).borderColor}`,
                backgroundColor: getStatusTagStyle(invoice.invoiceStatus)
                  .backgroundColor,
                color: getStatusTagStyle(invoice.invoiceStatus).color,
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: isMobile ? 10 : 11,
                letterSpacing: 0.5,
              }}
            >
              {invoice.invoiceStatus?.toUpperCase() || "DRAFT"}
            </div>
            <div
              style={{
                marginTop: 6,
                color: "#64748b",
                fontSize: isMobile ? 11 : 12,
              }}
            >
              Date: {formatDate(invoice.createdAt)}
            </div>
          </div>
        </div>

        <Divider style={{ margin: isMobile ? "8px 0" : "12px 0" }} />

        {/* Addresses Section */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? 16 : 32,
            marginBottom: isMobile ? 12 : 16,
          }}
        >
          <div>
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 10,
                color: "#64748b",
                letterSpacing: 0.5,
              }}
            >
              EXTREME LOGISTIC INVOICE FROM:
            </Text>
            <div style={{ marginTop: 4 }}>
              <Text
                strong
                style={{ fontSize: 13, color: "#dc2626", display: "block" }}
              >
                {invoice.payee?.companyName || "N/A"}
              </Text>
              <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.4 }}>
                {invoice.payee?.address1 || invoice.payee?.address || "N/A"}
              </div>
              <div
                style={{
                  marginTop: 4,
                  color: "#475569",
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                <strong>Phone:</strong> {invoice.payee?.phone || "N/A"}
                <br />
                <strong>Email:</strong> {invoice.payee?.email || "N/A"}
                <br />
                <strong>GST/HST:</strong>{" "}
                {maskGstNumber(invoice.payee?.gstNumber)}
              </div>
            </div>
          </div>

          <div>
            <Text
              style={{
                textTransform: "uppercase",
                fontWeight: 700,
                fontSize: 10,
                color: "#64748b",
                letterSpacing: 0.5,
              }}
            >
              INVOICE TO:
            </Text>
            <div style={{ marginTop: 4 }}>
              <Text
                strong
                style={{ fontSize: 13, color: "#2563eb", display: "block" }}
              >
                {invoice.customer?.companyName ||
                  invoice.customer?.customerName ||
                  "N/A"}
              </Text>
              <div style={{ color: "#475569", fontSize: 12, lineHeight: 1.4 }}>
                {invoice.customer?.address1 ||
                  invoice.customer?.address ||
                  "N/A"}
              </div>
              <div
                style={{
                  marginTop: 4,
                  color: "#475569",
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                <strong>Phone:</strong> {invoice.customer?.phone || "N/A"}
                <br />
                <strong>Email:</strong> {invoice.customer?.email || "N/A"}
                <br />
                <strong>GST/HST:</strong>{" "}
                {maskGstNumber(invoice.customer?.gstNumber)}
              </div>
            </div>
          </div>
        </div>

        {invoice.invoicePeriod?.startDate && (
          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: isMobile ? "6px 10px" : "8px 12px",
              borderRadius: 6,
              marginBottom: isMobile ? 12 : 16,
              color: "#334155",
              fontSize: isMobile ? 11 : 12,
            }}
          >
            <strong>📅 Billing Period:</strong>{" "}
            {formatDate(invoice.invoicePeriod.startDate)} —{" "}
            {formatDate(invoice.invoicePeriod.endDate)}
          </div>
        )}

        {/* Responsive Fluid Table Layout */}
        <div
          style={{
            marginBottom: isMobile ? 12 : 16,
            width: "100%",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
              tableLayout: "fixed",
              minWidth: isMobile ? 600 : undefined,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#102a63", color: "#ffffff" }}>
                <th style={{ ...getTableHeaderStyle(isMobile), width: "5%" }}>
                  #
                </th>
                <th style={{ ...getTableHeaderStyle(isMobile), width: "12%" }}>
                  Date
                </th>
                <th style={{ ...getTableHeaderStyle(isMobile), width: "12%" }}>
                  VRID
                </th>
                <th style={{ ...getTableHeaderStyle(isMobile), width: "14%" }}>
                  Driver Name
                </th>
                <th style={{ ...getTableHeaderStyle(isMobile), width: "10%" }}>
                  Route
                </th>
                <th style={{ ...getTableHeaderStyle(isMobile), width: "17%" }}>
                  Description
                </th>
                <th
                  style={{
                    ...getTableHeaderStyle(isMobile),
                    textAlign: "right",
                    width: "10%",
                  }}
                >
                  Charges
                </th>
                <th
                  style={{
                    ...getTableHeaderStyle(isMobile),
                    textAlign: "center",
                    width: "10%",
                  }}
                >
                  Dispatch%
                </th>
                <th
                  style={{
                    ...getTableHeaderStyle(isMobile),
                    textAlign: "right",
                    width: "10%",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {(invoice.trips || []).length > 0 ? (
                invoice.trips!.map((trip, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={getTableCellStyle(isMobile)}>{index + 1}</td>
                    <td style={getTableCellStyle(isMobile)}>
                      {formatDate(trip.tripDate || null)}
                    </td>
                    <td
                      style={{
                        ...getTableCellStyle(isMobile),
                        fontWeight: 700,
                        color: "#1e293b",
                      }}
                    >
                      {trip.vrid || "N/A"}
                    </td>
                    <td
                      style={{
                        ...getTableCellStyle(isMobile),
                        fontWeight: 600,
                        color: "#2563eb",
                      }}
                    >
                      {trip.driverName || "N/A"}
                    </td>
                    <td style={getTableCellStyle(isMobile)}>
                      {trip.route || "N/A"}
                    </td>
                    <td
                      style={{
                        ...getTableCellStyle(isMobile),
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {`${trip.pickup || "N/A"} to ${trip.drop || "N/A"}`}
                    </td>
                    <td
                      style={{
                        ...getTableCellStyle(isMobile),
                        textAlign: "right",
                      }}
                    >
                      ${(trip.totalCharges ?? 0).toFixed(2)}
                    </td>
                    <td
                      style={{
                        ...getTableCellStyle(isMobile),
                        textAlign: "center",
                        color: "#475569",
                      }}
                    >
                      {trip.dispatchPercent ?? 0}%
                    </td>
                    <td
                      style={{
                        ...getTableCellStyle(isMobile),
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
                    colSpan={9}
                    style={{
                      padding: isMobile ? 12 : 16,
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: isMobile ? 11 : 12,
                    }}
                  >
                    No active trips found in system database
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Block */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: isMobile ? 12 : 16,
          }}
        >
          <div style={{ width: isMobile ? 220 : 260 }}>
            <div style={summaryRowStyle}>
              <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                Subtotal:
              </Text>
              <Text strong style={{ fontSize: isMobile ? 12 : 13 }}>
                ${(invoice.subtotal ?? 0).toFixed(2)}
              </Text>
            </div>
            {invoice.tax ? (
              <div style={summaryRowStyleWithBorder}>
                <Text type="secondary" style={{ fontSize: isMobile ? 11 : 12 }}>
                  Tax / VAT:
                </Text>
                <Text strong style={{ fontSize: isMobile ? 12 : 13 }}>
                  ${(invoice.tax ?? 0).toFixed(2)}
                </Text>
              </div>
            ) : null}
            <div
              style={{
                ...summaryRowStyle,
                marginTop: isMobile ? 6 : 8,
                alignItems: "center",
                borderTop: "1px solid #e2e8f0",
                paddingTop: isMobile ? 6 : 8,
              }}
            >
              <Text
                strong
                style={{ fontSize: isMobile ? 12 : 13, color: "#1e293b" }}
              >
                Grand Total:
              </Text>
              <Text
                strong
                style={{ fontSize: isMobile ? 14 : 16, color: "#2563eb" }}
              >
                {invoice.currency || "CAD"} $
                {(invoice.grandTotal ?? 0).toFixed(2)}
              </Text>
            </div>
          </div>
        </div>

        {(invoice.accountNumber ||
          invoice.institutionNumber ||
          invoice.transitNumber ||
          invoice.customer?.eTransfer ||
          invoice.payee?.eTransferAddress) && (
          <div
            style={{
              padding: isMobile ? "10px 12px" : "12px 16px",
              backgroundColor: "#f8fafc",
              borderRadius: 8,
            }}
          >
            <Row gutter={[12, 6]}>
              {invoice.accountNumber && (
                <Col xs={24} sm={14}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 2,
                      fontSize: isMobile ? 9 : 10,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "#64748b",
                    }}
                  >
                    Direct Deposit Details
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 11 : 12,
                      color: "#475569",
                      display: "block",
                    }}
                  >
                    Institution: {invoice.institutionNumber || "N/A"} | Transit:{" "}
                    {invoice.transitNumber || "N/A"} | Account:{" "}
                    {invoice.accountNumber}
                  </Text>
                </Col>
              )}
              {(invoice.customer?.eTransfer ||
                invoice.payee?.eTransferAddress) && (
                <Col xs={24} sm={10}>
                  <Text
                    strong
                    style={{
                      display: "block",
                      marginBottom: 2,
                      fontSize: isMobile ? 9 : 10,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      color: "#64748b",
                    }}
                  >
                    💥 E-Transfer Details
                  </Text>
                  <Text
                    style={{
                      fontSize: isMobile ? 11 : 12,
                      color: "#1e293b",
                      fontWeight: 600,
                    }}
                  >
                    {invoice.customer?.eTransfer ||
                      invoice.payee?.eTransferAddress}
                  </Text>
                </Col>
              )}
            </Row>
          </div>
        )}

        {invoice.notes && (
          <div
            style={{
              marginTop: isMobile ? 10 : 12,
              fontSize: isMobile ? 10 : 11,
              color: "#64748b",
            }}
          >
            <Text strong>Notes:</Text> {invoice.notes}
          </div>
        )}
      </div>
    </div>
  );
}

const getTableHeaderStyle = (mobile: boolean): React.CSSProperties => ({
  padding: mobile ? "6px 6px" : "8px 8px",
  fontSize: mobile ? 10 : 11,
  fontWeight: 700,
  color: "#ffffff",
  lineHeight: 1.2,
});

const getTableCellStyle = (mobile: boolean): React.CSSProperties => ({
  padding: mobile ? "4px 6px" : "6px 8px",
  fontSize: mobile ? 10 : 11,
  color: "#475569",
  verticalAlign: "middle",
  lineHeight: 1.3,
});

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "4px 0",
  color: "#475569",
  fontSize: 12,
};

const summaryRowStyleWithBorder: React.CSSProperties = {
  ...summaryRowStyle,
  borderBottom: "1px solid #e2e8f0",
};
