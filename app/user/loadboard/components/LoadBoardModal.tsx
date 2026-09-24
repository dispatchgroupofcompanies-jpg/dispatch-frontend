"use client";

import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Modal, Row, Col, Button, Upload, Image, Grid, Collapse, Checkbox } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadFile } from "antd";
import type { LoadBoardRecord } from "../types";
import { toLoadDateInput } from "@/utils/loadboardDate";
import { getCompanyProfile } from "../../../../modules/company/route";

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

  // Checkbox states
  const [useAvailAddr, setUseAvailAddr] = useState(false);
  const [useAvailPostal, setUseAvailPostal] = useState(false);
  const [availableAddress, setAvailableAddress] = useState("");
  const [availablePostalCode, setAvailablePostalCode] = useState("");

  useEffect(() => {
    if (!open) return;

    let active = true;
    getCompanyProfile()
      .then((response) => {
        if (!active || !response?.success) return;

        const profile = Array.isArray(response.data) ? response.data[0] : response.data;
        if (!profile) return;

        const profileAddress = [
          profile.addressLine1,
          profile.addressLine2,
          profile.city,
          profile.province,
        ]
          .filter((part): part is string => typeof part === "string" && part.trim() !== "")
          .join(", ");

        setAvailableAddress(profileAddress);
        setAvailablePostalCode(typeof profile.postCode === "string" ? profile.postCode : "");
      })
      .catch(() => {
        if (active) {
          setAvailableAddress("");
          setAvailablePostalCode("");
        }
      });

    return () => {
      active = false;
    };
  }, [open]);

  useEffect(() => {
    if (useAvailAddr && availableAddress && !form.getFieldValue("address")) {
      form.setFieldValue("address", availableAddress);
    }
    if (useAvailPostal && availablePostalCode && !form.getFieldValue("postalCode")) {
      form.setFieldValue("postalCode", availablePostalCode);
    }
  }, [availableAddress, availablePostalCode, form, useAvailAddr, useAvailPostal]);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => {
      setUseAvailAddr(false);
      setUseAvailPostal(false);

      form.setFieldsValue({
        companyName: record?.companyName ?? record?.carrierName ?? "",
        carrierName: record?.carrierName ?? record?.companyName ?? "",
        address: record?.address ?? "",
        driverName: record?.driverName ?? "",
        postalCode: record?.postalCode ?? "",
        eTransfer: record?.eTransfer ?? "",
        loadDate: toLoadDateInput(record?.loadDate || record?.date),
        tripCharges: record?.tripCharges ?? 0,
        dispatcher: record?.dispatcher ?? "",
      });

      setFileList(
        record?.screenshotUrl
          ? [{ uid: "existing", name: "Current screenshot", status: "done", url: record.screenshotUrl }]
          : []
      );
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, record, form]);

  // Handle Address Checkbox Change
  const handleAddrCheckbox = (checked: boolean) => {
    setUseAvailAddr(checked);
    if (checked) {
      const value = record?.address || availableAddress || form.getFieldValue("address") || "";
      form.setFieldValue("address", value);
    } else {
      form.setFieldValue("address", "");
    }
  };

  // Handle Postal Code Checkbox Change
  const handlePostalCheckbox = (checked: boolean) => {
    setUseAvailPostal(checked);
    if (checked) {
      const value = record?.postalCode || availablePostalCode || form.getFieldValue("postalCode") || "";
      form.setFieldValue("postalCode", value);
    } else {
      form.setFieldValue("postalCode", "");
    }
  };

  const submit = async (values: Record<string, unknown>) => {
    const companyName =
      typeof values.companyName === "string"
        ? values.companyName
        : typeof values.carrierName === "string"
          ? values.carrierName
          : record?.companyName ?? record?.carrierName ?? "";
    const driverName =
      typeof values.driverName === "string" ? values.driverName : record?.driverName ?? "";
    const loadDate =
      typeof values.loadDate === "string"
        ? values.loadDate
        : typeof record?.loadDate === "string"
          ? record.loadDate
          : typeof record?.date === "string"
            ? record.date
            : new Date().toISOString();
    const postalCode =
      typeof values.postalCode === "string" ? values.postalCode : record?.postalCode ?? "";
    const address = typeof values.address === "string" ? values.address : record?.address ?? "";

    setSaving(true);
    try {
      await onSave(
        {
          ...record,
          ...values,
          companyName,
          carrierName: typeof values.carrierName === "string" ? values.carrierName : companyName,
          address,
          driverName,
          postalCode,
          loadDate,
          date: loadDate,
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
      <Form form={form} layout="vertical" onFinish={submit} autoComplete="off" style={{ marginTop: 8 }}>
        <Row gutter={[16, 10]}>
          {/* Left Side: Payee */}
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 12, fontWeight: 700, color: "#1f2937", fontSize: 14 }}>
              Payee
            </div>

            <Form.Item
              label="Company Name"
              name="companyName"
              rules={[{ required: true, message: "Company name is required" }]}
              style={{ marginBottom: 8 }}
            >
              <Input placeholder="Enter company name" autoComplete="off" spellCheck={false} />
            </Form.Item>

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

          {/* Right Side: Pay To */}
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 4, fontWeight: 700, color: "#1f2937", fontSize: 14 }}>
              Pay To
            </div>
            <div style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, marginBottom: 12, lineHeight: "1.3" }}>
              MANDATORY FOR NEW / THIRD-PARTY CARRIERS (FIRST-TIME LOAD) - ALL FIELDS COMPULSORY
            </div>

            <Collapse
              defaultActiveKey={[]}
              items={[
                {
                  key: "payToSection",
                  label: <span style={{ fontWeight: 600, color: "#374151" }}>Click to open dispatch fields</span>,
                  children: (
                    <>
                      <Form.Item
                        label="Company Name"
                        name="carrierName"
                        rules={[{ required: true, message: "Company name is required" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="Enter company name" autoComplete="off" spellCheck={false} />
                      </Form.Item>

                      <Form.Item
                        label="Driver Name"
                        name="driverName"
                        rules={[{ required: true, message: "Driver name is required" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="Enter driver name" autoComplete="off" spellCheck={false} />
                      </Form.Item>

                      <Form.Item
                        label="CAD Amount"
                        name="tripCharges"
                        rules={[{ required: true, message: "CAD amount is required" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <InputNumber min={0} precision={2} prefix="CAD $" style={{ width: "100%" }} />
                      </Form.Item>

                      {/* Address Field with Checkbox */}
                      <div style={{ marginBottom: 10 }}>
                        <Checkbox
                          checked={useAvailAddr}
                          onChange={(e) => handleAddrCheckbox(e.target.checked)}
                          style={{ marginBottom: 4, fontSize: 12, fontWeight: 500 }}
                        >
                          Use Available Address
                        </Checkbox>
                        <Form.Item
                          label="Address"
                          name="address"
                          rules={[{ required: !useAvailAddr, message: "Address is required" }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input
                            placeholder={useAvailAddr ? "Using available address" : "Type address manually"}
                            disabled={useAvailAddr} // Checkbox checked par disabled ho jaega
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </Form.Item>
                      </div>

                      {/* Postal Code Field with Checkbox */}
                      <div style={{ marginBottom: 10 }}>
                        <Checkbox
                          checked={useAvailPostal}
                          onChange={(e) => handlePostalCheckbox(e.target.checked)}
                          style={{ marginBottom: 4, fontSize: 12, fontWeight: 500 }}
                        >
                          Use Available Postal Code
                        </Checkbox>
                        <Form.Item
                          label="Postal Code"
                          name="postalCode"
                          rules={[{ required: !useAvailPostal, message: "Postal code is required" }]}
                          style={{ marginBottom: 0 }}
                        >
                          <Input
                            placeholder={useAvailPostal ? "Using available postal code" : "Type postal code manually"}
                            disabled={useAvailPostal} // Checkbox checked par disabled ho jaega
                            autoComplete="off"
                            spellCheck={false}
                          />
                        </Form.Item>
                      </div>

                      <Form.Item
                        label="E-Transfer Email"
                        name="eTransfer"
                        rules={[{ type: "email", message: "Enter a valid e-transfer email" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input
                          type="email"
                          placeholder="Enter e-transfer email"
                          autoComplete="email"
                          spellCheck={false}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Load Date"
                        name="loadDate"
                        rules={[{ required: true, message: "Load date is required" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input type="date" />
                      </Form.Item>

                      <Form.Item
                        label="Dispatcher"
                        name="dispatcher"
                        rules={[{ required: true, message: "Dispatcher name is required" }]}
                        style={{ marginBottom: 8 }}
                      >
                        <Input placeholder="Enter dispatcher name" autoComplete="off" spellCheck={false} />
                      </Form.Item>
                    </>
                  ),
                },
              ]}
            />
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 16 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={saving}>
            Save Dispatch
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
