"use client";

import { Card, Typography, Grid } from "antd";
import type { Appointment } from "../types";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface ExpandedRowProps {
  record: Appointment;
  isMobile: boolean;
}

export default function AppointmentExpandedRow({
  record,
  isMobile,
}: ExpandedRowProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "-";
    }
  };

  return (
    <div
      style={{
        padding: isMobile ? "12px" : "16px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        marginTop: "8px",
      }}
    >
      {/* Carrier Section */}
      <div style={{ marginBottom: isMobile ? 16 : 20 }}>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#2563eb",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #2563eb",
          }}
        >
          🚛 Carrier Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Equipment / Pro #
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.equipmentType} · {record.carrierProNumber}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Phone
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.carrierPhone}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Email
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.carrierEmail}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Address
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.carrierAddress}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Driver Cell
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.driverCellNumber}
            </div>
          </div>
        </div>
      </div>

      {/* Shipper Section */}
      <div style={{ marginBottom: isMobile ? 16 : 20 }}>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#16a34a",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #16a34a",
          }}
        >
          📦 Shipper Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Name
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.shipperName}
            </div>
          </div>
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Address
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.shipperAddress}, {record.shipperCity},{" "}
              {record.shipperProvince} {record.shipperPostalCode}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Pickup # / Window
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.pickupNumber} · {record.pickupTimeStart}-
              {record.pickupTimeEnd}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Commodity
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.commodityDescription}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Weight
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.weight?.toLocaleString()} lbs
            </div>
          </div>
        </div>
      </div>

      {/* Consignee Section */}
      <div style={{ marginBottom: isMobile ? 16 : 20 }}>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#d97706",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #d97706",
          }}
        >
          📍 Consignee Information
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Name
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.consigneeName}
            </div>
          </div>
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Address
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.consigneeAddress}, {record.consigneeCity},{" "}
              {record.consigneeProvince} {record.consigneePostalCode}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Drop-off # / Time
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.dropOffNumber} · {record.deliveryTime}
            </div>
          </div>
        </div>
      </div>

      {/* Charges Section */}
      <div>
        <h3
          style={{
            fontSize: isMobile ? 14 : 16,
            fontWeight: 700,
            color: "#7c3aed",
            marginBottom: 12,
            paddingBottom: 8,
            borderBottom: "2px solid #7c3aed",
          }}
        >
          💰 Charges & Payment
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
            gap: isMobile ? 8 : 12,
          }}
        >
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Description
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.chargeDescription}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Rate
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.currency} {record.rateAmount?.toLocaleString()}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: 16,
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              {record.currency} {record.totalAmount?.toLocaleString()}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Signature
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
              }}
            >
              {record.signature} · {formatDate(record.signatureDate)}
            </div>
          </div>
          <div style={{ gridColumn: isMobile ? "auto" : "span 2" }}>
            <div
              style={{
                fontSize: 11,
                color: "#64748b",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Notes
            </div>
            <div
              style={{
                fontSize: isMobile ? 13 : 14,
                color: "#1e293b",
                fontWeight: 500,
                wordBreak: "break-word",
              }}
            >
              {record.notesTerms}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
