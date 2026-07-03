"use client";

import { Form, Input, Select } from "antd";

const equipmentTypeOptions = [
  { value: "Dry Van", label: "Dry Van" },
  { value: "Reefer", label: "Reefer" },
  { value: "Flatbed", label: "Flatbed" },
  { value: "Step Deck", label: "Step Deck" },
  { value: "Box Truck", label: "Box Truck" },
  { value: "Tanker", label: "Tanker" },
  { value: "Other", label: "Other" },
];

export default function CarrierInfoSection() {
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
        🏢 Carrier Information
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Form.Item
          name="carrierName"
          label="Carrier Name"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Carrier company name" />
        </Form.Item>
        <Form.Item
          name="carrierAddress"
          label="Carrier Address"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Full address" />
        </Form.Item>
        <Form.Item
          name="carrierPhone"
          label="Carrier Phone"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="+1 (555) 123-4567" />
        </Form.Item>
        <Form.Item
          name="carrierEmail"
          label="Carrier Email"
          rules={[
            { required: true, message: "Required" },
            { type: "email", message: "Invalid email" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="carrier@example.com" />
        </Form.Item>
        <Form.Item
          name="equipmentType"
          label="Equipment Type"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Select
            size="large"
            placeholder="Select equipment type"
            options={equipmentTypeOptions}
          />
        </Form.Item>
      </div>
    </div>
  );
}
