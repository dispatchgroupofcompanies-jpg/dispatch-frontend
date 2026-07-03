"use client";

import { Form, Input, InputNumber, Select } from "antd";

const currencyOptions = [
  { value: "CAD", label: "CAD" },
  { value: "USD", label: "USD" },
];

export default function ChargesSection() {
  return (
    <div
      style={{
        backgroundColor: "#fef3c7",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #f59e0b",
        marginBottom: "16px",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#b45309",
          margin: "0 0 12px 0",
        }}
      >
        💰 Charges
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Form.Item
          name="chargeDescription"
          label="Charge Description"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input
            size="large"
            placeholder="e.g., All Inclusive Rate - INCL FUEL SURCHARGES"
          />
        </Form.Item>
        <Form.Item
          name="rateAmount"
          label="Rate/Amount"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            placeholder="900.00"
            min={0}
            precision={2}
          />
        </Form.Item>
        <Form.Item
          name="totalAmount"
          label="Total Amount"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            size="large"
            style={{ width: "100%" }}
            placeholder="900.00"
            min={0}
            precision={2}
          />
        </Form.Item>
        <Form.Item
          name="currency"
          label="Currency"
          rules={[{ required: true, message: "Required" }]}
          initialValue="CAD"
          style={{ marginBottom: 0 }}
        >
          <Select
            size="large"
            placeholder="Select currency"
            options={currencyOptions}
          />
        </Form.Item>
      </div>
    </div>
  );
}
