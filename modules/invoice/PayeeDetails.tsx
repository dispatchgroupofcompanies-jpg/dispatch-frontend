"use client";

import { Card, Col, Form, Input, Row } from "antd";

export default function PayeeDetails() {
  return (
    <Card 
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Payee Information (Issuer)</span>} 
      variant="borderless" 
      styles={{ body: { padding: "8px 12px" }, header: { minHeight: 32, padding: "0 12px", borderBottom: "1px solid #f1f5f9" } }}
      style={{ marginBottom: 10, border: "1px solid #e2e8f0", borderRadius: 6 }}
    >
      <Row gutter={12}>
        <Col xs={24} md={12}>
          <Form.Item label="Company Name" name={["payee", "companyName"]} rules={[{ required: true }]} style={{ marginBottom: 8 }}>
            <Input placeholder="Dispatch Group of Companies Inc." />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Contact Person" name={["payee", "contactPerson"]} style={{ marginBottom: 8 }}>
            <Input placeholder="John Doe" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col span={24}>
          <Form.Item label="Address Line 1" name={["payee", "address1"]} style={{ marginBottom: 8 }}>
            <Input placeholder="Street Address" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col xs={24} md={8}>
          <Form.Item label="Phone Number" name={["payee", "phone"]} style={{ marginBottom: 8 }}>
            <Input placeholder="+1 647 XXX XXXX" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Email Address" name={["payee", "email"]} rules={[{ type: "email" }]} style={{ marginBottom: 8 }}>
            <Input placeholder="dispatch@gmail.com" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="GST / HST Number" name={["payee", "gstNumber"]} style={{ marginBottom: 8 }}>
            <Input placeholder="123456789 RT0001" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}