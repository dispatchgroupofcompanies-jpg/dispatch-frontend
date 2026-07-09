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
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { LoadBoardRecord } from "../types";

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
  const vridValue = Form.useWatch("vrid", form);
  const currentVrid = vridValue || record?.vrid || "";

  useEffect(() => {
    if (open) {
      if (record) {
        // Format date for display
        const formattedDate = record.date
          ? new Date(record.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];

        form.setFieldsValue({
          ...record,
          date: formattedDate,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          tonu: false,
          status: "active",
          date: new Date().toISOString().split("T")[0],
        });
      }
    }
  }, [open, record, form]);

  const handleSubmit = async (values: {
    carrierName: string;
    thirdPartyCarrierName: string;
    date: string | Dayjs;
    mgCharges: number;
    vrid: string;
    load1Id: string;
    load2Id?: string;
    tripCharges: number;
    dispatcher: string;
    dispatchCharges: number;
    driverName: string;
    tonu: boolean;
  }) => {
    setLoading(true);
    try {
      const hasTwoLoads = values.vrid?.toLowerCase().startsWith("t");

      // Format date - handle both Dayjs object and string
      const formattedDate =
        typeof values.date === "string"
          ? values.date
          : values.date?.format("YYYY-MM-DD") || dayjs().format("YYYY-MM-DD");

      const data: LoadBoardRecord = {
        ...(record?._id && { _id: record._id }),
        carrierName: values.carrierName,
        thirdPartyCarrierName: values.thirdPartyCarrierName,
        date: formattedDate,
        mgCharges: values.mgCharges || 0,
        vrid: values.vrid,
        legs: hasTwoLoads ? 2 : 1,
        load1Id: values.load1Id,
        load2Id: hasTwoLoads ? values.load2Id : "",
        pickupTime: "",
        deliveryTime: "",
        tripCharges: values.tripCharges || 0,
        dispatcher: values.dispatcher,
        dispatchCharges: values.dispatchCharges || 0,
        driverName: values.driverName,
        tonu: values.tonu || false,
        status: values.tonu ? "cancelled" : "active",
        createdAt: record?.createdAt || new Date().toISOString(),
      };

      // Call the onSave callback
      await onSave(data);

      // Close modal and reset form
      form.resetFields();
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
      width={isMobile ? "95vw" : 700}
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
        style={{ marginTop: 20 }}
      >
        <Row gutter={[isMobile ? 12 : 16, 12]}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  Carrier Name
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  3P Carrier Name
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  Date
                </span>
              }
              name="date"
              rules={[{ required: true, message: "Please select date" }]}
              style={{ marginBottom: 0 }}
            >
              <Input type="date" size={isMobile ? "large" : "middle"} />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  VRID
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

          {currentVrid?.toLowerCase().startsWith("t") ? (
            <>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: 14,
                      }}
                    >
                      Load 1 ID
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

              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#1e293b",
                        fontSize: 14,
                      }}
                    >
                      Load 2 ID
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
          ) : (
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span
                    style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                  >
                    Load 1 ID
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  Trip Charges
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  Dispatcher
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  Driver Name
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
                >
                  Dispatch Charges
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

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <span
                  style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}
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

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "flex-end",
            marginTop: 24,
            paddingTop: 16,
            borderTop: "1px solid #e2e8f0",
          }}
        >
          <Button
            size={isMobile ? "middle" : "large"}
            onClick={handleCancel}
            style={{ borderRadius: "6px" }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size={isMobile ? "middle" : "large"}
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
