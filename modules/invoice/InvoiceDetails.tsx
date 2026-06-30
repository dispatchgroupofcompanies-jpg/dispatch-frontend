"use client";

import { Card, Col, DatePicker, Form, Input, Radio, Row, Select } from "antd";
import dayjs from "dayjs";

export default function InvoiceDetails() {
  return (
    <Card 
      title={<span style={{ fontSize: 13, fontWeight: 700, color: "#1e3a8a" }}>📄 Invoice Information</span>}
      variant="borderless" 
      styles={{ 
        body: { padding: "12px 16px" }, 
        header: { 
          minHeight: 40, 
          padding: "0 16px", 
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc"
        } 
      }}
      style={{ 
        marginBottom: 12, 
        border: "1px solid #e2e8f0", 
        borderRadius: 6,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
      }}
    >
      <Row gutter={12}>
        <Col xs={24} md={6}>
          <Form.Item 
            label="Invoice Number" 
            name="invoiceNumber" 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="Auto Generated" 
              disabled 
              style={{ 
                backgroundColor: "#f1f5f9",
                borderRadius: 4
              }} 
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item 
            label="Invoice Type" 
            name="invoiceType" 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Radio.Group 
              optionType="button" 
              buttonStyle="solid" 
              style={{ width: "100%" }}
            >
              <Radio.Button 
                value="single" 
                style={{ 
                  width: "50%", 
                  textAlign: "center",
                  borderRadius: "4px 0 0 4px",
                  fontSize: 12
                }}
              >
                Single
              </Radio.Button>
              <Radio.Button 
                value="multiple" 
                style={{ 
                  width: "50%", 
                  textAlign: "center",
                  borderRadius: "0 4px 4px 0",
                  fontSize: 12
                }}
              >
                Multiple
              </Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item 
            label="Currency" 
            name="currency" 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Select 
              style={{ borderRadius: 4 }}
              options={[
                { value: "CAD", label: "CAD" },
                { value: "USD", label: "USD" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={6}>
          <Form.Item 
            label="Invoice Date" 
            name="invoiceDate" 
            initialValue={dayjs()} 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <DatePicker 
              style={{ width: "100%", borderRadius: 4 }} 
              format="YYYY-MM-DD"
              size="middle"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={12}>
        <Col xs={24} md={6}>
          <Form.Item 
            label="Transit Number" 
            name="transitNumber" 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="e.g. 12345" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item 
            label="Institution Number" 
            name="institutionNumber" 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="e.g. 001" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item 
            label="Account Number" 
            name="accountNumber" 
            style={{ marginBottom: 12 }}
            labelCol={{ style: { fontWeight: 600, color: "#475569", fontSize: 12 } }}
          >
            <Input 
              placeholder="e.g. 1234567890" 
              size="middle"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          {/* Empty column for alignment */}
        </Col>
      </Row>
    </Card>
  );
}