"use client";

import { Card, Row, Col, Typography } from "antd";

const { Text, Title } = Typography;

interface Props {
  subtotal: number;
}

export default function SummaryCard({ subtotal }: Props) {
  // 🚫 Tax/GST removed completely. Grand total directly matches subtotal.
  const grandTotal = subtotal;

  return (
    <Card 
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Invoice Summary</span>} 
      variant="borderless"
      styles={{ 
        body: { padding: "8px 12px" }, 
        header: { minHeight: 32, padding: "0 12px", borderBottom: "1px solid #f1f5f9" } 
      }}
      style={{ marginTop: 10, border: "1px solid #e2e8f0", borderRadius: 6 }}
    >
      {/* Subtotal Row */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 4 }}>
        <Col>
          <Text style={{ color: "#64748b", fontSize: 12 }}>Subtotal Value</Text>
        </Col>
        <Col>
          <Text strong style={{ fontSize: 13, color: "#334155" }}>
            $
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </Col>
      </Row>

      {/* Thin Highlight Bar for Grand Total */}
      <Row 
        justify="space-between" 
        align="middle" 
        style={{ 
          marginTop: 6, 
          padding: "6px 10px", 
          background: "#f0fdf4", 
          border: "1px solid #bbf7d0", 
          borderRadius: 6 
        }}
      >
        <Col>
          <Title level={5} style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#166534" }}>
            Grand Total
          </Title>
        </Col>
        <Col>
          <Title
            level={4}
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 800,
              color: "#16a34a",
              fontVariantNumeric: "tabular-nums"
            }}
          >
            $
            {grandTotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Title>
        </Col>
      </Row>
    </Card>
  );
}