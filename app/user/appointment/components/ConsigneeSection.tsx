"use client";

import { Form, Input } from "antd";

export default function ConsigneeSection() {
  return (
    <div
      style={{
        backgroundColor: "#fef2f2",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #ef4444",
        marginBottom: "16px",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#b91c1c",
          margin: "0 0 12px 0",
        }}
      >
        📍 Consignee (Destination)
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Form.Item
          name="consigneeName"
          label="Consignee Name"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Company/Individual name" />
        </Form.Item>
        <Form.Item
          name="consigneeAddress"
          label="Consignee Address"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Full address" />
        </Form.Item>
        <Form.Item
          name="consigneeCity"
          label="City"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="City" />
        </Form.Item>
        <Form.Item
          name="consigneeProvince"
          label="Province/State"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="ON" />
        </Form.Item>
        <Form.Item
          name="consigneePostalCode"
          label="Postal Code"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="L1N9E1" />
        </Form.Item>
      </div>
    </div>
  );
}
