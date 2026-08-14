"use client";

import { useMemo, useState } from "react";
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
import { checkVridExists } from "../../src/services/admin/invoice";

interface Props {
  form: FormInstance<TripForm[]>;
  allowMultiple?: boolean;
  invoiceId?: string;
}

export default function TripSection({ form, invoiceId }: Props) {
  const trips = Form.useWatch("trips", form) || ([] as TripForm[]);

  const totalChargesSum = useMemo(() => {
    if (!trips || !Array.isArray(trips)) return 0;
    return trips.reduce(
      (sum: number, trip: TripForm) => sum + Number(trip?.totalCharges || 0),
      0,
    );
  }, [trips]);

  // Shared Label Style - Clean and consistent
  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "#475569",
    marginBottom: "4px",
  };

  // Shared style for Uppercase Inputs
  const inputUppercaseStyle = {
    borderRadius: 4,
    height: 32,
    textTransform: "uppercase" as const,
  };

  // Helper function to force value to UPPERCASE in Form store
  const handleUppercase = (e: React.ChangeEvent<HTMLInputElement>) =>
    e.target.value.toUpperCase();

  return (
    <div style={{ width: "100%" }}>
      <Card
        title={
          <span style={{ fontSize: 13, fontWeight: 700, color: "#102a63" }}>
            📦 Trips Management
          </span>
        }
        variant="borderless"
        styles={{
          body: { padding: "12px 14px" },
          header: {
            minHeight: 38,
            padding: "0 14px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
          },
        }}
        style={{
          marginBottom: 12,
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        }}
      >
        <Form.List
          name="trips"
          initialValue={[{ dispatchPercent: 0, totalCharges: 0 }]}
        >
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => {
                const trip = trips?.[index] || ({} as TripForm);
                const totalCharges = Number(trip?.totalCharges || 0);
                const dispatchPercent = Number(trip?.dispatchPercent || 0);
                const dispatchAmount = (totalCharges * dispatchPercent) / 100;

                // Checking condition if VRID starts with 'T' or 't'
                const vridValue = String(trip?.vrid || "").trim();
                const startsWithT = vridValue.toLowerCase().startsWith("t");

                return (
                  <Card
                    key={key}
                    size="small"
                    variant="borderless"
                    style={{
                      marginBottom: index === fields.length - 1 ? 0 : 12,
                      background: "#ffffff",
                      borderRadius: 6,
                      border: "1px solid #e2e8f0",
                    }}
                    styles={{
                      body: { padding: "12px" },
                      header: {
                        minHeight: 32,
                        padding: "0 12px",
                        background: "#f8fafc",
                        borderBottom: "1px solid #e2e8f0",
                      },
                    }}
                    title={
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#475569",
                        }}
                      >
                        📋 Trip Row #{index + 1}
                      </span>
                    }
                    extra={
                      fields.length > 1 && (
                        <Button
                          danger
                          type="text"
                          size="small"
                          icon={<DeleteOutlined />}
                          style={{
                            fontSize: 11,
                            height: 22,
                            padding: "0 6px",
                            borderRadius: 4,
                          }}
                          onClick={() => remove(name)}
                        >
                          Remove
                        </Button>
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {/* Top Core Info Row */}
                      <Row gutter={[12, 10]}>
                        {/* Trip Date */}
                        <Col xs={24} sm={12} md={4}>
                          <span style={labelStyle}>Trip Date</span>
                          <Form.Item
                            {...restField}
                            name={[name, "tripDate"]}
                            rules={[{ required: true, message: "Required" }]}
                            style={{ marginBottom: 0 }}
                          >
                            <DatePicker
                              style={{
                                width: "100%",
                                borderRadius: 4,
                                height: 32,
                              }}
                              format="YYYY-MM-DD"
                              placeholder="YYYY-MM-DD"
                            />
                          </Form.Item>
                        </Col>

                        {/* VRID */}
                        <Col xs={24} sm={12} md={4}>
                          <span style={labelStyle}>TRIPID / VRID</span>
                          <Form.Item
                            {...restField}
                            name={[name, "vrid"]}
                            getValueFromEvent={handleUppercase}
                            rules={[
                              { required: true, message: "Required" },
                              {
                                validator: async (_, value) => {
                                  if (!value || !value.trim()) {
                                    return Promise.resolve();
                                  }

                                  const normalizedVrid = value.trim().toLowerCase();
                                  const isDuplicatedInForm = trips.some(
                                    (currentTrip: { vrid: any; }, currentIndex: number) =>
                                      currentIndex !== index &&
                                      String(currentTrip?.vrid || "").trim().toLowerCase() === normalizedVrid,
                                  );
                                  if (isDuplicatedInForm) {
                                    return Promise.reject(new Error("VRID is duplicated in this invoice"));
                                  }

                                  try {
                                    const response = await checkVridExists(value.trim(), invoiceId);
                                    if (response.success && response.exists) {
                                      return Promise.reject(new Error("VRID is existing"));
                                    }
                                    return Promise.resolve();
                                  } catch (error) {
                                    return Promise.resolve();
                                  }
                                },
                              },
                            ]}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="e.g. T-115Z"
                              style={inputUppercaseStyle}
                            />
                          </Form.Item>
                        </Col>

                        {/* Route */}
                        <Col xs={24} sm={12} md={4}>
                          <span style={labelStyle}>Route</span>
                          <Form.Item
                            {...restField}
                            name={[name, "route"]}
                            getValueFromEvent={handleUppercase}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="e.g. ROUNDER"
                              style={inputUppercaseStyle}
                            />
                          </Form.Item>
                        </Col>

                        {/* Pickup Location */}
                        <Col xs={24} sm={12} md={6}>
                          <span style={labelStyle}>Pickup Location</span>
                          <Form.Item
                            {...restField}
                            name={[name, "pickup"]}
                            getValueFromEvent={handleUppercase}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Pickup Location"
                              style={inputUppercaseStyle}
                            />
                          </Form.Item>
                        </Col>

                        {/* Drop Location */}
                        <Col xs={24} sm={12} md={6}>
                          <span style={labelStyle}>Drop Location</span>
                          <Form.Item
                            {...restField}
                            name={[name, "drop"]}
                            getValueFromEvent={handleUppercase}
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Drop Location"
                              style={inputUppercaseStyle}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      {/* Driver Info Section */}
                      <div
                        style={{
                          background: "#f8fafc",
                          border: "1px dashed #cbd5e1",
                          borderRadius: 6,
                          padding: "10px 12px",
                          marginTop: 2,
                        }}
                      >
                        <Row gutter={[12, 12]}>
                          <Col xs={24} sm={12} md={startsWithT ? 8 : 24}>
                            <span style={{ ...labelStyle, color: "#1e293b" }}>
                              👤 Driver Name
                            </span>
                            <Form.Item
                              {...restField}
                              name={[name, "driverName"]}
                              getValueFromEvent={handleUppercase}
                              rules={[
                                {
                                  required: true,
                                  message: "Driver name is required",
                                },
                              ]}
                              style={{ marginBottom: 0 }}
                            >
                              <Input
                                placeholder="Enter driver name"
                                style={inputUppercaseStyle}
                              />
                            </Form.Item>
                          </Col>

                          {startsWithT && (
                            <>
                              <Col xs={24} sm={12} md={8}>
                                <span
                                  style={{ ...labelStyle, color: "#1e293b" }}
                                >
                                  🆔 Load ID 1
                                </span>
                                <Form.Item
                                  {...restField}
                                  name={[name, "loadId1"]}
                                  getValueFromEvent={handleUppercase}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input
                                    placeholder="Enter Load ID 1"
                                    style={inputUppercaseStyle}
                                  />
                                </Form.Item>
                              </Col>

                              <Col xs={24} sm={12} md={8}>
                                <span
                                  style={{ ...labelStyle, color: "#1e293b" }}
                                >
                                  🆔 Load ID 2
                                </span>
                                <Form.Item
                                  {...restField}
                                  name={[name, "loadId2"]}
                                  getValueFromEvent={handleUppercase}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Input
                                    placeholder="Enter Load ID 2"
                                    style={inputUppercaseStyle}
                                  />
                                </Form.Item>
                              </Col>
                            </>
                          )}
                        </Row>
                      </div>

                      {/* Calculations Values Sub-Row */}
                      <Row
                        gutter={[12, 10]}
                        style={{
                          borderTop: "1px dashed #e2e8f0",
                          paddingTop: "10px",
                          marginTop: 2,
                        }}
                      >
                        <Col xs={24} sm={8} md={8}>
                          <span style={labelStyle}>Total Charges</span>
                          <Form.Item
                            {...restField}
                            name={[name, "totalCharges"]}
                            initialValue={0}
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              style={{
                                width: "100%",
                                borderRadius: 4,
                                height: 32,
                              }}
                              min={0}
                              precision={2}
                              formatter={(value) =>
                                `$ ${value}`.replace(
                                  /\B(?=(\d{3})+(?!\d))/g,
                                  ",",
                                )
                              }
                              // @ts-expect-error Ant Design InputNumber parser type mismatch
                              parser={(value) =>
                                parseFloat(
                                  value!.replace(/\$\s?|(,*)/g, "") || "0",
                                )
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={8} md={8}>
                          <span style={labelStyle}>Dispatch %</span>
                          <Form.Item
                            {...restField}
                            name={[name, "dispatchPercent"]}
                            initialValue={0} // Forcefully default 0
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              style={{
                                width: "100%",
                                borderRadius: 4,
                                height: 32,
                              }}
                              min={0}
                              max={100}
                              formatter={(value) => `${value}%`}
                              // @ts-expect-error Ant Design InputNumber parser type mismatch
                              parser={(value) =>
                                parseFloat(value!.replace("%", "") || "0")
                              }
                            />
                          </Form.Item>
                        </Col>

                        <Col xs={24} sm={8} md={8}>
                          <span style={labelStyle}>Dispatch Pay</span>
                          <Form.Item style={{ marginBottom: 0 }}>
                            <InputNumber
                              disabled
                              style={{
                                width: "100%",
                                background: "#fef2f2",
                                color: "#dc2626",
                                fontWeight: "700",
                                borderRadius: 4,
                                height: 32,
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
                  marginTop: 12,
                }}
              >
                <Button
                  icon={<PlusOutlined />}
                  type="dashed"
                  onClick={() => add({ dispatchPercent: 0, totalCharges: 0 })}
                  style={{
                    borderRadius: 4,
                    fontWeight: 600,
                    color: "#2563eb",
                    borderColor: "#bfdbfe",
                    height: 34,
                  }}
                >
                  Add Another Trip
                </Button>

                <div
                  style={{
                    textAlign: "right",
                    padding: "4px 12px",
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span
                    style={{ fontSize: 11, color: "#16a34a", fontWeight: 600 }}
                  >
                    Total:
                  </span>
                  <strong
                    style={{
                      fontSize: 13,
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
