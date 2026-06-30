"use client";

import { Card, Col, DatePicker, Form, Input, Radio, Row, Select } from "antd";
import dayjs from "dayjs";

export default function InvoiceDetails() {
  return (
    <Card 
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#334155" }}>Invoice Information</span>}
      variant="borderless" 
      styles={{ body: { padding: "8px 12px" }, header: { minHeight: 32, padding: "0 12px", borderBottom: "1px solid #f1f5f9" } }}
      style={{ marginBottom: 10, border: "1px solid #e2e8f0", borderRadius: 6 }}
    >
      <Row gutter={12}>
        <Col xs={24} md={8}>
          <Form.Item label="Invoice Number" name="invoiceNumber" style={{ marginBottom: 8 }}>
            <Input placeholder="Auto Generated" disabled style={{ backgroundColor: "#f8fafc" }} />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Invoice Type" name="invoiceType" style={{ marginBottom: 8 }}>
            <Radio.Group optionType="button" buttonStyle="solid" style={{ width: "100%" }}>
              <Radio.Button value="single" style={{ width: "50%", textAlign: "center" }}>Single Trip</Radio.Button>
              <Radio.Button value="multiple" style={{ width: "50%", textAlign: "center" }}>Multiple Trips</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Currency" name="currency" style={{ marginBottom: 8 }}>
            <Select>
              <Select.Option value="CAD">CAD</Select.Option>
              <Select.Option value="USD">USD</Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col xs={24} md={6}>
          <Form.Item label="Invoice Date" name="invoiceDate" initialValue={dayjs()} style={{ marginBottom: 8 }}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Transit Number" name="transitNumber" style={{ marginBottom: 8 }}>
            <Input placeholder="12345" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Institution Number" name="institutionNumber" style={{ marginBottom: 8 }}>
            <Input placeholder="001" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Account Number" name="accountNumber" style={{ marginBottom: 8 }}>
            <Input placeholder="1234567890" />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}