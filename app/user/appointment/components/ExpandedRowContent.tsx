"use client";

import { Button } from "antd";
import type { Appointment } from "../lib/appointmentApi";

interface ExpandedRowContentProps {
  record: Appointment;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function ExpandedRowContent({
  record,
  isExpanded,
  onToggle,
}: ExpandedRowContentProps) {
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
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        margin: "12px 0",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "2px solid #2563eb",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 700,
            color: "#1e3a8a",
          }}
        >
          📋 Load Confirmation Details
        </h3>
        <Button
          type="primary"
          size="middle"
          onClick={onToggle}
          style={{
            borderRadius: "8px",
            background: isExpanded ? "#ef4444" : "#2563eb",
            borderColor: isExpanded ? "#ef4444" : "#2563eb",
            fontWeight: 600,
            minWidth: "100px",
          }}
        >
          {isExpanded ? "▲ Collapse" : "▼ Expand"}
        </Button>
      </div>

      {isExpanded && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {/* Trip Info */}
          <div style={{ gridColumn: "1 / -1", marginBottom: "12px" }}>
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#2563eb",
                margin: "0 0 16px 0",
                paddingBottom: "10px",
                borderBottom: "3px solid #2563eb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📦</span>
              Trip Information
            </h4>
          </div>
          {record.tripNumber && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Trip Number
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.tripNumber}
              </div>
            </div>
          )}
          {record.loadConfirmationNumber && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Load Confirmation #
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.loadConfirmationNumber}
              </div>
            </div>
          )}
          {record.shipmentNumber && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Shipment #
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.shipmentNumber}
              </div>
            </div>
          )}

          {/* Carrier Info */}
          <div
            style={{
              gridColumn: "1 / -1",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          >
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#2563eb",
                margin: "0 0 16px 0",
                paddingBottom: "10px",
                borderBottom: "3px solid #2563eb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>🚛</span>
              Carrier Information
            </h4>
          </div>
          {record.carrierName && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Carrier Name
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.carrierName}
              </div>
            </div>
          )}
          {record.carrierPhone && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Phone
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.carrierPhone}
              </div>
            </div>
          )}
          {record.carrierEmail && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Email
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.carrierEmail}
              </div>
            </div>
          )}
          {record.equipmentType && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Equipment Type
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.equipmentType}
              </div>
            </div>
          )}

          {/* Shipment Schedule */}
          <div
            style={{
              gridColumn: "1 / -1",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          >
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#2563eb",
                margin: "0 0 16px 0",
                paddingBottom: "10px",
                borderBottom: "3px solid #2563eb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📅</span>
              Shipment Schedule
            </h4>
          </div>
          {record.pickupDate && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Pickup Date
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {formatDate(record.pickupDate)}
              </div>
            </div>
          )}
          {record.deliveryDate && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Delivery Date
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {formatDate(record.deliveryDate)}
              </div>
            </div>
          )}
          {(record.pickupTimeStart || record.pickupTimeEnd) && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Pickup Time
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.pickupTimeStart}
                {record.pickupTimeEnd && ` - ${record.pickupTimeEnd}`}
              </div>
            </div>
          )}
          {record.deliveryTime && (
            <div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Delivery Time
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.deliveryTime}
              </div>
            </div>
          )}

          {/* Shipper & Consignee */}
          <div
            style={{
              gridColumn: "1 / -1",
              marginTop: "12px",
              marginBottom: "12px",
            }}
          >
            <h4
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#2563eb",
                margin: "0 0 16px 0",
                paddingBottom: "10px",
                borderBottom: "3px solid #2563eb",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>📍</span>
              Locations
            </h4>
          </div>
          {record.shipperName && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Shipper (Origin)
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.shipperName}
                {record.shipperAddress && `, ${record.shipperAddress}`}
                {record.shipperCity && `, ${record.shipperCity}`}
                {record.shipperProvince && `, ${record.shipperProvince}`}
                {record.shipperPostalCode && ` ${record.shipperPostalCode}`}
              </div>
            </div>
          )}
          {record.consigneeName && (
            <div style={{ gridColumn: "1 / -1" }}>
              <div
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "4px",
                }}
              >
                Consignee (Destination)
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#334155",
                }}
              >
                {record.consigneeName}
                {record.consigneeAddress && `, ${record.consigneeAddress}`}
                {record.consigneeCity && `, ${record.consigneeCity}`}
                {record.consigneeProvince && `, ${record.consigneeProvince}`}
                {record.consigneePostalCode && ` ${record.consigneePostalCode}`}
              </div>
            </div>
          )}

          {/* Charges */}
          {(record.chargeDescription || record.totalAmount) && (
            <>
              <div
                style={{
                  gridColumn: "1 / -1",
                  marginTop: "12px",
                  marginBottom: "12px",
                }}
              >
                <h4
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#2563eb",
                    margin: "0 0 16px 0",
                    paddingBottom: "10px",
                    borderBottom: "3px solid #2563eb",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>💰</span>
                  Charges
                </h4>
              </div>
              {record.chargeDescription && (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#334155",
                    }}
                  >
                    {record.chargeDescription}
                  </div>
                </div>
              )}
              {record.totalAmount && (
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Total Amount
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e3a8a",
                    }}
                  >
                    ${record.totalAmount} {record.currency || "CAD"}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Notes */}
          {record.notesTerms && (
            <div style={{ gridColumn: "1 / -1", marginTop: "12px" }}>
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#2563eb",
                  margin: "0 0 16px 0",
                  paddingBottom: "10px",
                  borderBottom: "3px solid #2563eb",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: "18px" }}>📝</span>
                Notes & Terms
              </h4>
              <div
                style={{
                  fontSize: "14px",
                  color: "#334155",
                  padding: "12px",
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  lineHeight: "1.6",
                }}
              >
                {record.notesTerms}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
