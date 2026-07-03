"use client";

import { Form, Input } from "antd";

export default function TripInfoSection() {
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
        🚛 Trip Info
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Form.Item
          name="tripNumber"
          label="Trip Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="TRP-12345" />
        </Form.Item>
        <Form.Item
          name="loadConfirmationNumber"
          label="Load Confirmation Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="LC-12345" />
        </Form.Item>
        <Form.Item
          name="shipmentNumber"
          label="Shipment Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="SHP-12345" />
        </Form.Item>
      </div>
    </div>
  );
}
