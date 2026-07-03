"use client";

import { useMemo } from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
} from "antd";
import type { FormInstance } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { TripForm } from "../../src/types/invoiceForm";

interface Props {
  form: FormInstance<any>;
  allowMultiple?: boolean;
}

export default function TripSection({ form }: Props) {
  const trips = Form.useWatch("trips", form) || ([] as TripForm[]);
  const invoiceTypeRaw = Form.useWatch("invoiceType", form) || "single";

  const isMultipleMode = useMemo(() => {
    return String(invoiceTypeRaw).toLowerCase() === "multiple";
  }, [invoiceTypeRaw]);

  const totalChargesSum = useMemo(() => {
    if (!trips || !Array.isArray(trips)) return 0;
    return trips.reduce(
      (sum: number, trip: TripForm) => sum + Number(trip?.totalCharges || 0),
      0,
    );
  }, [trips]);

  // Shared Label Style - Matches Payee/Customer Cards
  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
    marginBottom: "6px",
  };

  return (
    <div style={{ width: "100%" }}>
      <Card
        variant="borderless"
        styles={{
          body: { padding: "14px 14px" },
          header: {
            minHeight: 42,
            padding: "0 14px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          },
        }}
        style={{
          marginBottom: 10,
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <Form.List
          name="trips"
          initialValue={[{ dispatchPercent: 10, totalCharges: 0 }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                const trip = trips?.[index] || ({} as TripForm);
                const totalCharges = Number(trip?.totalCharges || 0);
                const dispatchPercent = Number(trip?.dispatchPercent || 0);
                const dispatchAmount = (totalCharges * dispatchPercent) / 100;

                return (
                  <Card
                    key={key}
                    size="small"
                    variant="borderless"
                    style={{
                      marginBottom: 12,
                      background: "#ffffff",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                    }}
                    styles={{
                      body: { padding: "14px" },
                      header: {
                        minHeight: 36,
                        padding: "0 14px",
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      },
                    }}
                    title={
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#334155",
                        }}
                      >
                        📋 Trip Row #{index + 1}
                      </span>
                    }
                    extra={
                      isMultipleMode &&
                      fields.length > 1 && (
                        <Button
                          danger
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          style={{
                            fontSize: 12,
                            height: 24,
                            padding: "0 8px",
                            borderRadius: 4,
                          }}
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      )
                    }
                  >
                    {/* Top Row UI Info Blocks */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      <Row gutter={12}>
                        {/* Trip Date */}
                        <Col span={4}>
                          <span style={labelStyle}>Trip Date</span>
                          <Form.Item
                            {...restField}
                            name={[name, "tripDate"]}
                            rules={[{ required: true, message: "Required" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <DatePicker
                              style={{ width: "100%", borderRadius: 4 }}
                              format="YYYY-MM-DD"
                              placeholder="YYYY-MM-DD"
                              size="middle"
                            />
                          </Form.Item>
                        </Col>

                        {/* VRID */}
                        <Col span={4}>
                          <span style={labelStyle}>VRID</span>
                          <Form.Item
                            {...restField}
                            name={[name, "vrid"]}
                            rules={[{ required: true, message: "Required" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="VRID"
                              style={{
                                textTransform: "uppercase",
                                borderRadius: 4,
                              }}
                              size="middle"
                            />
                          </Form.Item>
                        </Col>

                        {/* Route */}
                        <Col span={4}>
                          <span style={labelStyle}>Route</span>
                          <Form.Item
                            {...restField}
                            name={[name, "route"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="e.g. YHM1 → YYZ1"
                              size="middle"
                              style={{ borderRadius: 4 }}
                            />
                          </Form.Item>
                        </Col>

                        {/* Pickup Location */}
                        <Col span={6}>
                          <span style={labelStyle}>Pickup Location</span>
                          <Form.Item
                            {...restField}
                            name={[name, "pickup"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Pickup Location"
                              size="middle"
                              style={{ borderRadius: 4 }}
                            />
                          </Form.Item>
                        </Col>

                        {/* Drop Location */}
                        <Col span={6}>
                          <span style={labelStyle}>Drop Location</span>
                          <Form.Item
                            {...restField}
                            name={[name, "drop"]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Drop Location"
                              size="middle"
                              style={{ borderRadius: 4 }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Calculations Values Sub-Row */}
                      <Row
                        gutter={12}
                        style={{
                          borderTop: "1px dashed #e2e8f0",
                          paddingTop: "14px",
                        }}
                      >
                        <Col span={8}>
                          <span style={labelStyle}>Total Charges</span>
                          <Form.Item
                            {...restField}
                            name={[name, "totalCharges"]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              style={{ width: "100%", borderRadius: 4 }}
                              min={0}
                              size="middle"
                              precision={2}
                              formatter={(value) =>
                                `$ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ",",
                                )
                              }
                              parser={(value) =>
                                parseFloat(
                                  value!.replace(/\$\s?|(,*)/g, "") || "0",
                                ) as any
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <span style={labelStyle}>Dispatch %</span>
                          <Form.Item
                            {...restField}
                            name={[name, "dispatchPercent"]}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              style={{ width: "100%", borderRadius: 4 }}
                              min={0}
                              max={100}
                              size="middle"
                              formatter={(value) => `${value}%`}
                              parser={(value) =>
                                parseFloat(
                                  value!.replace("%", "") || "0",
                                ) as any
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col span={8}>
                          <span style={labelStyle}>Dispatch Pay</span>
                          <Form.Item style={{ marginBottom: 0 }}>
                            <InputNumber
                              disabled
                              size="middle"
                              style={{
                                width: "100%",
                                background: "#fef2f2",
                                color: "#dc2626",
                                fontWeight: "700",
                                borderRadius: 4,
                              }}
                              precision={2}
                              value={dispatchAmount}
                              formatter={(value) =>
                                `$ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ",",
                                )
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                    </div>
                  </Card>
                );
              })}

              {/* Bottom Actions Splitter Bar */}
              <Space
                style={{
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                {isMultipleMode ? (
                  <Button
                    icon={<PlusOutlined />}
                    type="dashed"
                    size="middle"
                    onClick={() =>
                      add({ dispatchPercent: 10, totalCharges: 0 })
                    }
                    style={{
                      borderRadius: 4,
                      fontWeight: 600,
                      color: "#2563eb",
                      borderColor: "#bfdbfe",
                      height: 36,
                    }}
                  >
                    Add Another Trip
                  </Button>
                ) : (
                  <div />
                )}

                <div
                  style={{
                    textAlign: "right",
                    padding: "6px 14px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 6,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <span
                    style={{ fontSize: 12, color: "#16a34a", fontWeight: 600 }}
                  >
                    Total:
                  </span>
                  <strong
                    style={{
                      fontSize: 14,
                      color: "#166534",
                      fontVariantNumeric: "tabular-nums",
                      fontWeight: 700,
                    }}
                  >
                    $
                    {totalChargesSum.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong>
                </div>
              </Space>
            </>
          )}
        </Form.List>
      </Card>
    </div>
  );
}
