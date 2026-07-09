"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Space,
  message,
  Checkbox,
  Grid,
  Row,
  Col,
  Card,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { LoadBoardRecord } from "../types";
import { DownOutlined, UpOutlined, PlusOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (record: LoadBoardRecord) => void;
  record: LoadBoardRecord | null;
}

export default function LoadBoardModal({
  open,
  onClose,
  onSave,
  record,
}: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loads, setLoads] = useState<
    Array<{
      vrid: string;
      load1Id: string;
      load2Id?: string;
      tripCharges: number;
      dispatcher: string;
      driverName: string;
      dispatchCharges: number;
      tonu: boolean;
      date: string;
      mgCharges: number;
    }>
  >([]);
  const [loadsCollapsed, setLoadsCollapsed] = useState(false);
  const vridValue = Form.useWatch("vrid", form);
  const currentVrid = vridValue || record?.vrid || "";

  useEffect(() => {
    if (open) {
      // Use setTimeout to avoid cascading renders
      setTimeout(() => {
        if (record) {
          const formattedDate = record.date
            ? new Date(record.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0];

          // Prepare form values from record - match backend structure
          const formValues = {
            carrierName: record.carrierName || "",
            thirdPartyCarrierName: record.thirdPartyCarrierName || "",
            date: formattedDate,
            mgCharges: record.mgCharges || 0,
            vrid: record.vrid || "",
            load1Id: record.load1Id || "",
            load2Id: record.load2Id || "",
            tripCharges: record.tripCharges || 0,
            dispatcher: record.dispatcher || "",
            driverName: record.driverName || "",
            dispatchCharges: record.dispatchCharges || 0,
            tonu: record.tonu || false,
            status: record.status || "active",
          };

          form.setFieldsValue(formValues);

          if (record.loads && record.loads.length > 0) {
            setLoads(record.loads);
          } else {
            // If no loads array, create a single load from the main record fields
            const singleLoad = {
              vrid: record.vrid || "",
              load1Id: record.load1Id || "",
              load2Id: record.load2Id || "",
              tripCharges: record.tripCharges || 0,
              dispatcher: record.dispatcher || "",
              driverName: record.driverName || "",
              dispatchCharges: record.dispatchCharges || 0,
              tonu: record.tonu || false,
              date: formattedDate,
              mgCharges: record.mgCharges || 0,
            };
            setLoads([singleLoad]);
          }
        } else {
          form.resetFields();
          form.setFieldsValue({
            tonu: false,
            status: "active",
            date: new Date().toISOString().split("T")[0],
          });
          setLoads([]);
        }
        // Reset collapse state when modal opens
        setLoadsCollapsed(false);
      }, 0);
    }
  }, [open, record, form]);

  const addLoad = () => {
    const newLoad = {
      vrid: currentVrid || "",
      load1Id: "",
      load2Id: "",
      tripCharges: 0,
      dispatcher: "",
      driverName: "",
      dispatchCharges: 0,
      tonu: false,
      date: new Date().toISOString().split("T")[0],
      mgCharges: 0,
    };
    setLoads([...loads, newLoad]);
  };

  const removeLoad = (index: number) => {
    setLoads(loads.filter((_, i) => i !== index));
  };

  const updateLoad = (
    index: number,
    field: string,
    value: string | number | boolean,
  ) => {
    const updatedLoads = [...loads];
    updatedLoads[index] = { ...updatedLoads[index], [field]: value };
    setLoads(updatedLoads);
  };

  const handleSubmit = async (values: {
    carrierName: string;
    thirdPartyCarrierName: string;
    date: string | Dayjs;
    mgCharges: number;
    tonu: boolean;
    vrid: string;
    load1Id: string;
    tripCharges: number;
    dispatcher: string;
    dispatchCharges: number;
    driverName: string;
  }) => {
    setLoading(true);
    try {
      const formattedDate =
        typeof values.date === "string"
          ? values.date
          : values.date?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD");

      const loadsData = loads.map((load) => ({
        vrid: load.vrid,
        load1Id: load.load1Id,
        load2Id: load.load2Id || "",
        tripCharges: load.tripCharges || 0,
        dispatcher: load.dispatcher,
        driverName: load.driverName,
        dispatchCharges: load.dispatchCharges || 0,
        tonu: load.tonu || false,
        date: load.date,
        mgCharges: load.mgCharges || 0,
      }));

      const data: LoadBoardRecord = {
        ...(record?._id && { _id: record._id }),
        carrierName: values.carrierName,
        thirdPartyCarrierName: values.thirdPartyCarrierName,
        date: formattedDate,
        mgCharges: values.mgCharges || 0,
        loads: loadsData,
        legs: Math.max(loadsData.length, 1),
        pickupTime: "",
        deliveryTime: "",
        vrid: values.vrid || "",
        load1Id: values.load1Id || "",
        tripCharges: values.tripCharges || 0,
        dispatcher: loadsData[0]?.dispatcher || values.dispatcher || "",
        dispatchCharges:
          loadsData[0]?.dispatchCharges || values.dispatchCharges || 0,
        driverName: loadsData[0]?.driverName || values.driverName || "",
        tonu: values.tonu || false,
        status: values.tonu ? "cancelled" : "active",
        createdAt: record?.createdAt || new Date().toISOString(),
      };

      await onSave(data);

      form.resetFields();
      setLoads([]);
      onClose();
    } catch (error) {
      message.error("Failed to save record");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setLoads([]);
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
          {record ? "Edit 3P Work" : "Add New 3P Work"}
        </div>
      }
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={isMobile ? "95vw" : 900}
      centered
      style={{ maxWidth: "95vw" }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          tonu: false,
          status: "active",
          date: new Date().toISOString().split("T")[0],
        }}
        style={{ marginTop: 16 }}
      >
        {/* Main Form Fields - 3 columns on desktop */}
        <Row gutter={[isMobile ? 12 : 16, isMobile ? 8 : 12]}>
          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  Carrier Name <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="carrierName"
              rules={[{ required: true, message: "Please enter carrier name" }]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter carrier name"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  3P Carrier Name <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="thirdPartyCarrierName"
              rules={[
                { required: true, message: "Please enter 3P carrier name" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter 3P carrier name"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  Date <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="date"
              rules={[{ required: true, message: "Please select date" }]}
              style={{ marginBottom: 0 }}
            >
              <Input type="date" size={isMobile ? "large" : "middle"} />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  MG Charges
                </span>
              }
              name="mgCharges"
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                placeholder="0.00"
                min={0}
                precision={2}
                style={{ width: "100%" }}
                size={isMobile ? "large" : "middle"}
                prefix="$"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  VRID <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="vrid"
              rules={[{ required: true, message: "Please enter VRID" }]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter VRID (starts with T = 2 loads)"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>

          {currentVrid?.toLowerCase().startsWith("t") && (
            <>
              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: 13,
                      }}
                    >
                      Load 1 ID <span style={{ color: "#ef4444" }}>*</span>
                    </span>
                  }
                  name="load1Id"
                  rules={[
                    { required: true, message: "Please enter Load 1 ID" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="Enter Load 1 ID"
                    size={isMobile ? "large" : "middle"}
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8}>
                <Form.Item
                  label={
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: 13,
                      }}
                    >
                      Load 2 ID <span style={{ color: "#ef4444" }}>*</span>
                    </span>
                  }
                  name="load2Id"
                  rules={[
                    { required: true, message: "Please enter Load 2 ID" },
                  ]}
                  style={{ marginBottom: 0 }}
                >
                  <Input
                    placeholder="Enter Load 2 ID"
                    size={isMobile ? "large" : "middle"}
                  />
                </Form.Item>
              </Col>
            </>
          )}

          {!currentVrid?.toLowerCase().startsWith("t") && (
            <Col xs={24} md={8}>
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                  >
                    Load 1 ID <span style={{ color: "#ef4444" }}>*</span>
                  </span>
                }
                name="load1Id"
                rules={[{ required: true, message: "Please enter Load 1 ID" }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  placeholder="Enter Load 1 ID"
                  size={isMobile ? "large" : "middle"}
                />
              </Form.Item>
            </Col>
          )}

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  Trip Charges <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="tripCharges"
              rules={[{ required: true, message: "Please enter trip charges" }]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                placeholder="0.00"
                min={0}
                precision={2}
                style={{ width: "100%" }}
                size={isMobile ? "large" : "middle"}
                prefix="$"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  Dispatcher <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="dispatcher"
              rules={[
                { required: true, message: "Please enter dispatcher name" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter dispatcher name"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  Driver Name <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="driverName"
              rules={[{ required: true, message: "Please enter driver name" }]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Enter driver name"
                size={isMobile ? "large" : "middle"}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  Dispatch Charges <span style={{ color: "#ef4444" }}>*</span>
                </span>
              }
              name="dispatchCharges"
              rules={[
                { required: true, message: "Please enter dispatch charges" },
              ]}
              style={{ marginBottom: 0 }}
            >
              <InputNumber
                placeholder="0.00"
                min={0}
                precision={2}
                style={{ width: "100%" }}
                size={isMobile ? "large" : "middle"}
                prefix="$"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 13 }}
                >
                  TONU
                </span>
              }
              name="tonu"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox>TONU (Truck Ordered Not Used)</Checkbox>
            </Form.Item>
          </Col>
        </Row>

        {/* Dynamic Loads Section with Collapse */}
        <div style={{ marginTop: 20 }}>
          {loads.length > 0 && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: loadsCollapsed ? 0 : 12,
                }}
              >
                <h4
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  Loads ({loads.length})
                </h4>
                <div style={{ display: "flex", gap: 8 }}>
                  <Button
                    size="small"
                    onClick={() => setLoadsCollapsed(!loadsCollapsed)}
                    style={{ color: "#10b981", borderColor: "#10b981" }}
                  >
                    {loadsCollapsed ? (
                      <>
                        <DownOutlined /> Show All Loads
                      </>
                    ) : (
                      <>
                        <UpOutlined /> Hide Loads
                      </>
                    )}
                  </Button>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={addLoad}
                    size="small"
                    style={{
                      color: "#10b981",
                      borderColor: "#10b981",
                    }}
                  >
                    Add Load
                  </Button>
                </div>
              </div>

              {!loadsCollapsed && (
                <>
                  {loads.map((load, index) => (
                    <Card
                      key={index}
                      size="small"
                      style={{
                        marginBottom: 12,
                        border: "1px solid #e2e8f0",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      }}
                    >
                      <Row gutter={[isMobile ? 8 : 12, isMobile ? 8 : 12]}>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                Date <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              type="date"
                              size={isMobile ? "large" : "middle"}
                              value={load.date}
                              onChange={(e) =>
                                updateLoad(index, "date", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                MG Charges
                              </span>
                            }
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              placeholder="0.00"
                              min={0}
                              precision={2}
                              style={{ width: "100%" }}
                              size={isMobile ? "large" : "middle"}
                              prefix="$"
                              value={load.mgCharges}
                              onChange={(value) =>
                                updateLoad(index, "mgCharges", value || 0)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                VRID <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Enter VRID"
                              size={isMobile ? "large" : "middle"}
                              value={load.vrid}
                              onChange={(e) =>
                                updateLoad(index, "vrid", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                Load 1 ID{" "}
                                <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Enter Load 1 ID"
                              size={isMobile ? "large" : "middle"}
                              value={load.load1Id}
                              onChange={(e) =>
                                updateLoad(index, "load1Id", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        {load.vrid?.toLowerCase().startsWith("t") && (
                          <Col xs={24} md={8}>
                            <Form.Item
                              label={
                                <span style={{ fontSize: 12, fontWeight: 600 }}>
                                  Load 2 ID{" "}
                                  <span style={{ color: "#ef4444" }}>*</span>
                                </span>
                              }
                              required
                              style={{ marginBottom: 0 }}
                            >
                              <Input
                                placeholder="Enter Load 2 ID"
                                size={isMobile ? "large" : "middle"}
                                value={load.load2Id}
                                onChange={(e) =>
                                  updateLoad(index, "load2Id", e.target.value)
                                }
                              />
                            </Form.Item>
                          </Col>
                        )}
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                Trip Charges{" "}
                                <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              placeholder="0.00"
                              min={0}
                              precision={2}
                              style={{ width: "100%" }}
                              size={isMobile ? "large" : "middle"}
                              prefix="$"
                              value={load.tripCharges}
                              onChange={(value) =>
                                updateLoad(index, "tripCharges", value || 0)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                Dispatcher{" "}
                                <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Enter dispatcher name"
                              size={isMobile ? "large" : "middle"}
                              value={load.dispatcher}
                              onChange={(e) =>
                                updateLoad(index, "dispatcher", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                Driver Name{" "}
                                <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <Input
                              placeholder="Enter driver name"
                              size={isMobile ? "large" : "middle"}
                              value={load.driverName}
                              onChange={(e) =>
                                updateLoad(index, "driverName", e.target.value)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                Dispatch Charges{" "}
                                <span style={{ color: "#ef4444" }}>*</span>
                              </span>
                            }
                            required
                            style={{ marginBottom: 0 }}
                          >
                            <InputNumber
                              placeholder="0.00"
                              min={0}
                              precision={2}
                              style={{ width: "100%" }}
                              size={isMobile ? "large" : "middle"}
                              prefix="$"
                              value={load.dispatchCharges}
                              onChange={(value) =>
                                updateLoad(index, "dispatchCharges", value || 0)
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                          <Form.Item
                            label={
                              <span style={{ fontSize: 12, fontWeight: 600 }}>
                                TONU
                              </span>
                            }
                            valuePropName="checked"
                            style={{ marginBottom: 0 }}
                          >
                            <Checkbox
                              checked={load.tonu}
                              onChange={(e) =>
                                updateLoad(index, "tonu", e.target.checked)
                              }
                            >
                              TONU (Truck Ordered Not Used)
                            </Checkbox>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </>
          )}
        </div>

        {loads.length === 0 && (
          <div style={{ marginTop: 12 }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={addLoad}
              size="large"
              style={{
                width: "100%",
                borderStyle: "dashed",
                color: "#10b981",
                borderColor: "#10b981",
              }}
            >
              Add Load
            </Button>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginTop: 20,
            paddingTop: 16,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            size={isMobile ? "middle" : "middle"}
            onClick={handleCancel}
            style={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size={isMobile ? "middle" : "middle"}
            loading={loading}
            style={{
              background: "#10b981",
              borderRadius: "6px",
              fontWeight: 600,
            }}
          >
            {record ? "Update" : "Save"} Record
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
