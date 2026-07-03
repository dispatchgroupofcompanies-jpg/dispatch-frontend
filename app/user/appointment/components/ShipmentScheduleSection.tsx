"use client";

import { Form, Input, InputNumber, DatePicker, TimePicker } from "antd";
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
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
        }}
      >
        <Form.Item
          name="pickupDate"
          label="Pickup Date"
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
        <Form.Item
          name="pickupTimeStart"
          label="Pickup Time Start"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <TimePicker
            style={{ width: "100%" }}
            size="large"
            format="HH:mm"
            placeholder="Start"
            needConfirm={false}
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
          />
        </Form.Item>
        <Form.Item
          name="pickupTimeEnd"
          label="Pickup Time End"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <TimePicker
            style={{ width: "100%" }}
            size="large"
            format="HH:mm"
            placeholder="End"
            needConfirm={false}
            getPopupContainer={(trigger) =>
              trigger.parentElement || document.body
            }
          />
        </Form.Item>
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
        <Form.Item
          name="pickupNumber"
          label="Pickup Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Pickup ref#" />
        </Form.Item>
        <Form.Item
          name="dropOffNumber"
          label="Drop Off Number"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="Drop off ref#" />
        </Form.Item>
        <Form.Item
          name="commodityDescription"
          label="Commodity"
          rules={[{ required: true, message: "Required" }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" placeholder="e.g., Baled Paper" />
        </Form.Item>
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
      </div>
    </div>
  );
}
