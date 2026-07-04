"use client";

import { Form, Modal, Button, message, Input, Select, Row, Col } from "antd";
import { useState, useEffect } from "react";
import { saveCompanyProfile } from "./route";

const { Option } = Select;

import type { CompanyProfile } from "../../src/types/company";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: CompanyProfile | null;
}

export default function CompanyProfileModal({
  open,
  onClose,
  initialData,
}: ModalProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [open, initialData, form]);

  const handleSubmit = async (values: CompanyProfile) => {
    try {
      setSubmitting(true);
      // Include _id when editing to ensure update instead of create
      const submitData = initialData?._id
        ? { ...values, _id: initialData._id }
        : values;

      const result = await saveCompanyProfile(submitData);

      if (result.success) {
        message.success("Company Profile Saved Successfully");
        onClose();
      } else {
        throw new Error(result.error || "Failed to save profile configs");
      }
    } catch (error: unknown) {
      console.error(error);
      const errMsg =
        error && typeof error === "object" && "message" in error
          ? (error as { message?: unknown }).message
          : String(error ?? "An error occurred while saving profile");
      message.error(String(errMsg));
    } finally {
      setSubmitting(false);
    }
  };

  // Ant Design standard responsive breakpoints mapping for 3 items per row layout
  const gridResponsiveProps = {
    xs: 24, // Mobile (Single column layout)
    sm: 24, // Large mobile screen
    md: 12, // Tablets (Two columns layout)
    lg: 8, // Desktop viewports (Exactly 3 columns layout: 24 / 8 = 3)
  };

  return (
    <Modal
      title={
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#0f172a",
            letterSpacing: "0.3px",
          }}
        >
          🏢 Company Profile Configurations
        </span>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={900} // Expanded from 800 to 900 to comfortably fit 3 inputs side-by-side
      centered
      destroyOnHidden={true}
      forceRender={true}
      styles={{ body: { padding: "12px 24px" } }}
    >
      <Form
        form={form}
        layout="vertical"
        size="middle"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{
          maxHeight: "75vh",
          overflowY: "auto",
          overflowX: "hidden",
          paddingRight: "6px",
        }}
      >
        {/* ================= SECTION 1: COMPANY INFORMATION ================= */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              color: "#1e3a8a",
              paddingBottom: 6,
              borderBottom: "2px solid #eff6ff",
              letterSpacing: "0.4px",
            }}
          >
            Company Information
          </div>

          <Row gutter={[16, 0]}>
            <Col {...gridResponsiveProps}>
              <Form.Item
                name="companyName"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Company Name
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter company name"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="carrierIdentifier"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Carrier Identifier
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter identifier"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="email"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Official Email
                  </span>
                }
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Valid email required",
                  },
                ]}
              >
                <Input
                  placeholder="Enter email address"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <span
                style={{
                  display: "block",
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: "8px",
                }}
              >
                Phone Contact
              </span>
              <Row gutter={8}>
                <Col span={6}>
                  <Form.Item
                    name="countryCode"
                    rules={[{ required: true, message: "" }]}
                  >
                    <Input
                      placeholder="+1"
                      style={{ borderRadius: "6px", textAlign: "center" }}
                    />
                  </Form.Item>
                </Col>
                <Col span={18}>
                  <Form.Item
                    name="phone"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input
                      placeholder="Phone number"
                      style={{ borderRadius: "6px" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="province"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Province/Territory
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter province/territory"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="nsc"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    NSC Number
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter NSC number"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="gstHst"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    GST/HST
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter GST/HST number"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* ================= SECTION 2: ADDRESS INFORMATION ================= */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              color: "#1e3a8a",
              paddingBottom: 6,
              borderBottom: "2px solid #eff6ff",
              letterSpacing: "0.4px",
            }}
          >
            Address Information
          </div>

          <Row gutter={[16, 0]}>
            <Col {...gridResponsiveProps}>
              <Form.Item
                name="addressLine1"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Address Line 1
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Street address"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="addressLine2"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Address Line 2 (Optional)
                  </span>
                }
              >
                <Input
                  placeholder="Apartment, suite, unit, etc."
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="city"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    City
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter city"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="state"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    State/Province
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter state"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="postCode"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Postal / ZIP Code
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Input
                  placeholder="Enter postal code"
                  style={{ borderRadius: "6px" }}
                />
              </Form.Item>
            </Col>

            <Col {...gridResponsiveProps}>
              <Form.Item
                name="country"
                label={
                  <span style={{ fontWeight: 600, color: "#475569" }}>
                    Country
                  </span>
                }
                rules={[{ required: true, message: "Required" }]}
              >
                <Select
                  placeholder="Select country"
                  style={{ borderRadius: "6px" }}
                >
                  <Option value="CA">Canada</Option>
                  <Option value="US">United States</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* Form CTA Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
            marginTop: 16,
            paddingTop: 16,
            borderTop: "1px solid #f1f5f9",
          }}
        >
          <Button
            size="large"
            style={{ borderRadius: "6px", minWidth: 100 }}
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            size="large"
            type="primary"
            htmlType="submit"
            style={{
              fontWeight: 600,
              borderRadius: "6px",
              minWidth: 120,
              backgroundColor: "#1e3a8a",
              borderColor: "#1e3a8a",
            }}
            loading={submitting}
          >
            {submitting ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
