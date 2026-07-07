"use client";

import { Form, InputNumber, DatePicker, TimePicker, Row, Col } from "antd";
import dayjs from "dayjs";

// Safe dayjs wrapper to prevent isValid errors
const safeDayjs = (value: unknown) => {
  try {
    const d = dayjs.isDayjs(value)
      ? value
      : dayjs(value as string | number | Date | dayjs.Dayjs);
    return d.isValid() ? d : null;
  } catch (e) {
    return null;
  }
};

export default function ShipmentScheduleSection() {
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
        📅 Shipment Schedule
      </h4>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Pickup Section */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h5
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#2563eb",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            📍 Pickup Details
          </h5>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="pickupDate"
                label="Date"
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  disabledDate={(current) => {
                    if (!current) return false;
                    const dayjsCurrent = safeDayjs(current);
                    if (!dayjsCurrent) return false;
                    return dayjsCurrent < dayjs().startOf("day");
                  }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="pickupTimeStart"
                label="Arrival Time"
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="HH:mm"
                  placeholder="Arrival"
                  needConfirm={false}
                  getPopupContainer={(trigger) =>
                    trigger.parentElement || document.body
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="pickupTimeEnd"
                label="Departure Time"
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="HH:mm"
                  placeholder="Departure"
                  needConfirm={false}
                  getPopupContainer={(trigger) =>
                    trigger.parentElement || document.body
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Delivery & Weight Combined Section */}
        <div
          style={{
            padding: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
          }}
        >
          <h5
            style={{
              fontSize: "12px",
              fontWeight: 700,
              color: "#dc2626",
              margin: "0 0 16px 0",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            📦 Delivery & Shipment Details
          </h5>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="deliveryDate"
                label="Delivery Date"
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  size="large"
                  disabledDate={(current) => {
                    if (!current) return false;
                    const dayjsCurrent = safeDayjs(current);
                    if (!dayjsCurrent) return false;
                    return dayjsCurrent < dayjs().startOf("day");
                  }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="deliveryTime"
                label="Delivery Time"
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <TimePicker
                  style={{ width: "100%" }}
                  size="large"
                  format="HH:mm"
                  placeholder="Select time"
                  needConfirm={false}
                  getPopupContainer={(trigger) =>
                    trigger.parentElement || document.body
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="weight"
                label="Weight (lbs)"
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <InputNumber
                  size="large"
                  style={{ width: "100%" }}
                  placeholder="50000"
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}
