"use client";

import { useMemo } from "react";
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

interface Props {
  form: any;
  allowMultiple?: boolean;
}

export default function TripSection({ form }: Props) {
  const trips = Form.useWatch("trips", form) || [];
  const invoiceTypeRaw = Form.useWatch("invoiceType", form) || "single";
  
  const isMultipleMode = useMemo(() => {
    return String(invoiceTypeRaw).toLowerCase() === "multiple";
  }, [invoiceTypeRaw]);

  const totalChargesSum = useMemo(() => {
    if (!trips || !Array.isArray(trips)) return 0;
    return trips.reduce((sum: number, trip: any) => sum + Number(trip?.totalCharges || 0), 0);
  }, [trips]);

  return (
    <div style={{ width: "100%" }}>
      <Form.List name="trips" initialValue={[{ dispatchPercent: 10, totalCharges: 0 }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }, index) => {
              const trip = trips?.[index] || {};
              const totalCharges = Number(trip?.totalCharges || 0);
              const dispatchPercent = Number(trip?.dispatchPercent || 0);
              const dispatchAmount = (totalCharges * dispatchPercent) / 100;

              return (
                <Card
                  key={key}
                  size="small"
                  variant="borderless"
                  style={{ 
                    marginBottom: 8, 
                    background: "#ffffff", 
                    borderRadius: 6, 
                    border: "1px solid #e2e8f0" 
                  }}
                  styles={{ 
                    body: { padding: "8px 12px" }, 
                    header: { minHeight: 28, padding: "0 12px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" } 
                  }}
                  title={<span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Trip Row #{index + 1}</span>}
                  extra={
                    isMultipleMode && fields.length > 1 && (
                      <Button 
                        danger 
                        type="text"
                        size="small"
                        icon={<DeleteOutlined />} 
                        style={{ fontSize: 11, height: 22, padding: "0 4px" }}
                        onClick={() => remove(name)}
                      >
                        Remove
                      </Button>
                    )
                  }
                >
                  {/* Top Fields Row */}
                  <Row gutter={8}>
                    <Col xs={24} md={4}>
                      <Form.Item
                        {...restField}
                        label="Trip Date"
                        name={[name, "tripDate"]}
                        rules={[{ required: true, message: "Required" }]}
                        style={{ marginBottom: 4 }}
                      >
                        <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" size="small" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <Form.Item
                        {...restField}
                        label="VRID"
                        name={[name, "vrid"]}
                        rules={[{ required: true, message: "Required" }]}
                        style={{ marginBottom: 4 }}
                      >
                        <Input placeholder="11658LQ8N" style={{ textTransform: "uppercase" }} size="small" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={4}>
                      <Form.Item {...restField} label="Route" name={[name, "route"]} style={{ marginBottom: 4 }}>
                        <Input placeholder="YHM1 → YYZ1" size="small" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item {...restField} label="Pickup Location" name={[name, "pickup"]} style={{ marginBottom: 4 }}>
                        <Input placeholder="Pickup Hub" size="small" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={6}>
                      <Form.Item {...restField} label="Drop Location" name={[name, "drop"]} style={{ marginBottom: 4 }}>
                        <Input placeholder="Drop Yard" size="small" />
                      </Form.Item>
                    </Col>
                  </Row>

                  {/* Calculations Values Sub-Row */}
                  <Row gutter={8} style={{ marginTop: 4, paddingTop: 4, borderTop: "1px dashed #f1f5f9" }}>
                    <Col xs={24} md={8}>
                      <Form.Item {...restField} label="Total Charges" name={[name, "totalCharges"]} style={{ marginBottom: 0 }}>
                        <InputNumber 
                          style={{ width: "100%" }} 
                          min={0} 
                          size="small"
                          precision={2} 
                          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          parser={(value) => parseFloat(value!.replace(/\$\s?|(,*)/g, "") || "0") as any}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item {...restField} label="Dispatch %" name={[name, "dispatchPercent"]} style={{ marginBottom: 0 }}>
                        <InputNumber 
                          style={{ width: "100%" }} 
                          min={0} 
                          max={100} 
                          size="small"
                          formatter={(value) => `${value}%`}
                          parser={(value) => parseFloat(value!.replace("%", "") || "0") as any}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={8}>
                      <Form.Item label="Calculated Dispatch Pay" style={{ marginBottom: 0 }}>
                        <InputNumber 
                          disabled 
                          size="small"
                          style={{ width: "100%", background: "#fef2f2", color: "#dc2626", fontWeight: "700" }} 
                          precision={2} 
                          value={dispatchAmount}
                          formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              );
            })}

            {/* Bottom Actions Splitter Bar */}
            <Space style={{ width: "100%", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              {isMultipleMode ? (
                <Button
                  icon={<PlusOutlined />}
                  type="dashed"
                  size="small"
                  onClick={() => add({ dispatchPercent: 10, totalCharges: 0 })}
                  style={{ borderRadius: 6, fontWeight: 500, color: "#2563eb", borderColor: "#bfdbfe" }}
                >
                  Add Another Trip Row
                </Button>
              ) : (
                <div />
              )}

              <div style={{ 
                textAlign: "right", 
                padding: "4px 12px", 
                background: "#f0fdf4", 
                border: "1px solid #bbf7d0", 
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                gap: 12
              }}>
                <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>Combined Trips Net Value:</span>
                <strong style={{ fontSize: 13, color: "#166534", fontVariantNumeric: "tabular-nums" }}>
                  ${totalChargesSum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
            </Space>
          </>
        )}
      </Form.List>
    </div>
  );
}