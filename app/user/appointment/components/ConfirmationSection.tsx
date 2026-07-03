"use client";

import { Form, Input, DatePicker } from "antd";

export default function ConfirmationSection() {
  return (
    <div
      style={{
        backgroundColor: "#f0f9ff",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #0ea5e9",
        marginBottom: "16px",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#0e7490",
          margin: "0 0 12px 0",
        }}
      >
        ✅ Confirmation
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Form.Item
          name="signature"
          label="Signature"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Signature name" />
        </Form.Item>
        <Form.Item
          name="signatureDate"
          label="Signature Date"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <DatePicker
            style={{ width: "100%" }}
            size="large"
            format="YYYY-MM-DD"
          />
        </Form.Item>
        <Form.Item
          name="carrierProNumber"
          label="Carrier Pro Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="PRO number" />
        </Form.Item>
        <Form.Item
          name="driverCellNumber"
          label="Driver's Cell Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="+1 (555) 123-4567" />
        </Form.Item>
      </div>
    </div>
  );
}
