"use client";

import { Card, Col, Form, Input, Row } from "antd";

export default function PayeeDetails() {
  return (
    <Card 
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>🏢 Payee Information (Issuer)</span>} 
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
        marginBottom: 10, 
        border: "1px solid #e2e8f0", 
        borderRadius: 6,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      <Row gutter={10}>
        <Col xs={24} md={12}>
          <Form.Item 
            label="Company Name" 
            name={["payee", "companyName"]} 
            rules={[{ required: true, message: "Required" }]} 
            style={{ marginBottom: 10 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="Company Name" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item 
            label="Contact Person" 
            name={["payee", "contactPerson"]} 
            style={{ marginBottom: 10 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="Contact Person" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col span={24}>
          <Form.Item 
            label="Address" 
            name={["payee", "address1"]} 
            style={{ marginBottom: 10 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="Street Address, City, Province, Postal Code" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={10}>
        <Col xs={24} md={8}>
          <Form.Item 
            label="Phone" 
            name={["payee", "phone"]} 
            style={{ marginBottom: 10 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="+1 647 XXX XXXX" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            label="Email" 
            name={["payee", "email"]} 
            rules={[{ type: "email", message: "Invalid email" }]} 
            style={{ marginBottom: 10 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="email@company.com" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            label="GST/HST" 
            name={["payee", "gstNumber"]} 
            style={{ marginBottom: 10 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="123456789 RT0001" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}