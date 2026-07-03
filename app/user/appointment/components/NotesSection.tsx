"use client";

import { Form, Input } from "antd";

export default function NotesSection() {
  return (
    <div
      style={{
        backgroundColor: "#fafafa",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        marginBottom: "16px",
      }}
    >
      <h4
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "#374151",
          margin: "0 0 12px 0",
        }}
      >
        📝 Notes / Terms & Conditions
      </h4>
      <Form.Item name="notesTerms" label="Notes & Terms">
        <Input.TextArea
          rows={4}
          placeholder="Enter any special instructions, terms and conditions, or additional notes here..."
        />
      </Form.Item>
    </div>
  );
}
