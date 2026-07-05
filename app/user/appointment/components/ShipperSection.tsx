"use client";

import { Form, Input } from "antd";

export default function ShipperSection() {
  return (
    <div
      style={{
        backgroundColor: "#f0fdf4",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #22c55e",
        marginBottom: "16px",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#15803d",
          margin: "0 0 12px 0",
        }}
      >
        📍 Shipper (Origin)
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        <Form.Item
          name="shipperName"
          label="Shipper Name"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Company/Individual name" />
        </Form.Item>
        <Form.Item
          name="shipperAddress"
          label="Shipper Address"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Full address" />
        </Form.Item>
        <Form.Item
          name="shipperCity"
          label="City"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="City" />
        </Form.Item>
        <Form.Item
          name="shipperProvince"
          label="Province/State"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="ON" />
        </Form.Item>
        <Form.Item
          name="shipperPostalCode"
          label="Postal Code"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="L6X 1Z2" />
        </Form.Item>
      </div>
    </div>
  );
}
