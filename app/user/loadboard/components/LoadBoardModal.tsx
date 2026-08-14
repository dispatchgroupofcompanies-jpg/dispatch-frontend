"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal, Row, Col, Button, Upload, Image, Grid } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import type { LoadBoardRecord } from "../types";

const { useBreakpoint } = Grid;

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (record: LoadBoardRecord, screenshot?: File) => Promise<void>;
  record: LoadBoardRecord | null;
}

export default function LoadBoardModal({ open, onClose, onSave, record }: Props) {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const isMobile = !useBreakpoint().md;

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      form.setFieldsValue({
        carrierName: record?.carrierName ?? "",
        thirdPartyCarrierName: record?.thirdPartyCarrierName ?? "",
        tripCharges: record?.tripCharges ?? 0,
        dispatcher: record?.dispatcher ?? "",
        driverName: record?.driverName ?? "",
      });
      setFileList(
        record?.screenshotUrl
          ? [{ uid: "existing", name: "Current screenshot", status: "done", url: record.screenshotUrl }]
          : []
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, record, form]);

  const submit = async (
    values: Pick<LoadBoardRecord, "carrierName" | "thirdPartyCarrierName" | "tripCharges" | "dispatcher" | "driverName">
  ) => {
    setSaving(true);
    try {
      await onSave(
        {
          ...record,
          ...values,
          date: record?.date ?? new Date().toISOString(),
          vrid: record?.vrid ?? "",
          mgCharges: record?.mgCharges ?? 0,
          legs: record?.legs ?? 1,
          load1Id: record?.load1Id ?? "",
          pickupTime: record?.pickupTime ?? "",
          deliveryTime: record?.deliveryTime ?? "",
          dispatchCharges: record?.dispatchCharges ?? 0,
          tonu: record?.tonu ?? false,
          status: record?.status ?? "active",
        } as LoadBoardRecord,
        fileList[0]?.originFileObj
      );
      form.resetFields();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={isMobile ? "94vw" : 680}
      title={record ? "Edit 3P Dispatch" : "Add 3P Dispatch"}
    >
      <Form form={form} layout="vertical" onFinish={submit} style={{ marginTop: 8 }}>
        <Row gutter={[14, 6]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Company Name / Payee"
              name="carrierName"
              rules={[{ required: true, message: "Company name / payee is required" }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter company name / payee" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Pay To / Company Driver"
              name="thirdPartyCarrierName"
              rules={[{ required: true, message: "Pay To / Company Driver is required" }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter Pay To / Company Driver" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="CAD Amount"
              name="tripCharges"
              rules={[{ required: true, message: "CAD amount is required" }]}
              style={{ marginBottom: 8 }}
            >
              <InputNumber min={0} precision={2} prefix="CAD $" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Dispatcher"
              name="dispatcher"
              rules={[{ required: true, message: "Dispatcher name is required" }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter dispatcher name" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Payment ID"
              name="driverName"
              rules={[
                { required: true, message: "Payment ID (email) is required" },
                { type: "email", message: "Please enter a valid email address" },
              ]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item label="Upload Image / Load Screenshot" style={{ marginBottom: 8 }}>
              <Upload
                accept="image/png,image/jpeg,image/webp"
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList: next }) => setFileList(next)}
              >
                <Button icon={<UploadOutlined />}>Choose screenshot</Button>
              </Upload>
              {record?.screenshotUrl && !fileList[0]?.originFileObj && (
                <Image
                  width={120}
                  height={80}
                  style={{ objectFit: "cover", marginTop: 10 }}
                  src={record.screenshotUrl}
                  alt="Load screenshot"
                />
              )}
            </Form.Item>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save Dispatch
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
