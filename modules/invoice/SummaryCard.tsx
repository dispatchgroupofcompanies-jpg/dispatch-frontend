"use client";

import { Card, Row, Col, Typography } from "antd";

const { Text, Title } = Typography;

interface Props {
  subtotal: number;
}

export default function SummaryCard({ subtotal }: Props) {
  const grandTotal = subtotal;

  return (
    <Card 
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>💰 Invoice Summary</span>}
      variant="borderless"
      styles={{ 
        body: { padding: "10px 14px" }, 
        header: { 
          minHeight: 38, 
          padding: "0 14px", 
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc"
        } 
      }}
      style={{ 
        marginTop: 10, 
        border: "1px solid #e2e8f0", 
        borderRadius: 6,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 8 }}>
        <Col>
          <Text style={{ color: "#64748b", fontSize: 12, fontWeight: 500 }}>Subtotal</Text>
        </Col>
        <Col>
          <Text strong style={{ fontSize: 13, color: "#334155", fontWeight: 600 }}>
            $
            {subtotal.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
        </Col>
      </Row>

      <Row 
        justify="space-between" 
        align="middle" 
        style={{ 
          padding: "8px 12px", 
          background: "#f0fdf4", 
          border: "1px solid #bbf7d0", 
          borderRadius: 6,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}
      >
        <Col>
          <Title level={5} style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#166534" }}>
            Grand Total
          </Title>
        </Col>
        <Col>
          <Title
            level={3}
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