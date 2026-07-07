"use client";

import { Card, Col, Form, Input, Row } from "antd";

export default function PayToDetails() {
  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>
          💳 PAY TO / Customer Info...
        </span>
      }
      variant="borderless"
      styles={{
        // Padding kam kar di choti screens ke liye
        body: { padding: "10px 12px" },
        header: {
          minHeight: 36,
          padding: "0 12px",
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
        },
      }}
      style={{
        marginBottom: 12,
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      <Form layout="vertical">
        <Row gutter={[12, 8]}>
          {/* Mobile: single column (xs=24), Tablet and up: 2 columns (sm=12) */}
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Customer/Company Name"
              name={["customer", "companyName"]}
              rules={[{ required: true, message: "Required" }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="Customer Company Name"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Phone"
              name={["customer", "phone"]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="+1 647 XXX XXXX"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Email"
              name={["customer", "email"]}
              rules={[{ type: "email", message: "Invalid email" }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="email@company.com"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="GST/HST"
              name={["customer", "gstNumber"]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="123456789RT0001"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="E-Transfer Email"
              name={["customer", "eTransfer"]}
              rules={[{ type: "email", message: "Invalid email" }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="etransfer@company.com"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Address"
              name={["customer", "address1"]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Street Address, City, Province, Postal Code"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Card>
  );
}
