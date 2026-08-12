"use client";

import React from "react";
import { Card, Col, Form, Input, Row, Select } from "antd";

export default function InvoiceDetails() {
  return (
    <Card
      title={
        <span style={{ fontSize: 13, fontWeight: 700, color: "#102a63" }}>
          📄 Invoice Information
        </span>
      }
      variant="borderless"
      styles={{
        header: {
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          padding: "0 16px",
          minHeight: 38,
        },
        body: {
          padding: "12px 16px",
        },
      }}
      style={{
        borderRadius: 6,
        border: "1px solid #e2e8f0",
        marginBottom: 12,
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      }}
    >
      {/* Single unified row automatically wraps inputs seamlessly.
        No split rows mean no broken empty spacing traps on different viewports.
      */}
      <Row gutter={[12, 10]}>
        {/* Mobile: single column (xs=24), Tablet and up: 2 columns (sm=12) */}
        {/* Field 1 */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Invoice Number"
            name="invoiceNumber"
            layout="vertical"
            style={{ marginBottom: 0 }}
            labelCol={{
              style: {
                fontWeight: 600,
                color: "#475569",
                fontSize: 12,
                paddingBottom: 2,
              },
            }}
          >
            <Input
              disabled
              placeholder="Auto Generated"
              style={{
                borderRadius: 4,
                background: "#f1f5f9",
                height: 32,
                fontSize: 12,
              }}
            />
          </Form.Item>
        </Col>

        {/* Field 2 */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Currency"
            name="currency"
            layout="vertical"
            style={{ marginBottom: 0 }}
            labelCol={{
              style: {
                fontWeight: 600,
                color: "#475569",
                fontSize: 12,
                paddingBottom: 2,
              },
            }}
          >
            <Select
              style={{ width: "100%", borderRadius: 4, height: 32 }}
              options={[
                { value: "CAD", label: "CAD" },
                { value: "USD", label: "USD" },
              ]}
            />
          </Form.Item>
        </Col>

        {/* Field 3 */}
        {/* <Col xs={24} sm={12}>
          <Form.Item
            label="Invoice Date"
            name="invoiceDate"
            layout="vertical"
            style={{ marginBottom: 0 }}
            labelCol={{
              style: {
                fontWeight: 600,
                color: "#475569",
                fontSize: 12,
                paddingBottom: 2,
              },
            }}
          >
            <Input
              type="date"
              style={{
                width: "100%",
                borderRadius: 4,
                height: 32,
                fontSize: 12,
              }}
              placeholder="YYYY-MM-DD"
            />
          </Form.Item>
        </Col> */}

        {/* Field 4 */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Institution Number"
            name="institutionNumber"
            layout="vertical"
            style={{ marginBottom: 0 }}
            labelCol={{
              style: {
                fontWeight: 600,
                color: "#475569",
                fontSize: 12,
                paddingBottom: 2,
              },
            }}
          >
            <Input
              placeholder="e.g. 003"
              style={{ borderRadius: 4, height: 32, fontSize: 12 }}
            />
          </Form.Item>
        </Col>

        {/* Field 5 */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Transit Number"
            name="transitNumber"
            layout="vertical"
            style={{ marginBottom: 0 }}
            labelCol={{
              style: {
                fontWeight: 600,
                color: "#475569",
                fontSize: 12,
                paddingBottom: 2,
              },
            }}
          >
            <Input
              placeholder="e.g. 12345"
              style={{ borderRadius: 4, height: 32, fontSize: 12 }}
            />
          </Form.Item>
        </Col>

        {/* Field 6 */}
        <Col xs={24} sm={12}>
          <Form.Item
            label="Account Number"
            name="accountNumber"
            layout="vertical"
            style={{ marginBottom: 0 }}
            labelCol={{
              style: {
                fontWeight: 600,
                color: "#475569",
                fontSize: 12,
                paddingBottom: 2,
              },
            }}
          >
            <Input
              placeholder="e.g. 1234567890"
              style={{ borderRadius: 4, height: 32, fontSize: 12 }}
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );
}
