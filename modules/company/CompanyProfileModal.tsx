"use client";

import { Form, Modal, Button, message, Input, Select, Row, Col } from "antd";
import { useState } from "react";

const { Option } = Select;

export default function CompanyProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      
      // API call simulation loop tracking block
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Company Profile Data:", values);
      message.success("Company Profile Saved Successfully");
      
      form.resetFields();
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to save company profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", letterSpacing: "0.3px" }}>
          🏢 Company Profile Configurations
        </span>
      }
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={800}
      centered
      styles={{ body: { padding: "12px 24px" } }}
    >
      <Form
        form={form}
        layout="vertical"
        size="middle"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ maxHeight: "70vh", overflowY: "auto", overflowX: "hidden", paddingRight: "4px" }}
      >
        
        {/* 🏢 SECTION 1: COMPANY INFORMATION */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            marginBottom: 16, 
            color: "#1e3a8a",
            paddingBottom: 6,
            borderBottom: "2px solid #eff6ff",
            letterSpacing: "0.4px"
          }}>
            Company Information
          </div>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="companyName"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Company Name</span>}
                rules={[{ required: true, message: "Please enter company name" }]}
              >
                <Input placeholder="Enter company name" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="carrierIdentifier"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Carrier Identifier</span>}
                rules={[{ required: true, message: "Please enter carrier identifier" }]}
              >
                <Input placeholder="Enter carrier identifier" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="eTransfer"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>E-Transfer Email</span>}
                rules={[
                  { required: true, message: "Please enter E-Transfer email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input placeholder="Enter E-Transfer Email" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="province"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Province/Territory</span>}
                rules={[{ required: true, message: "Please select province" }]}
              >
                <Select placeholder="Select province" style={{ borderRadius: "6px" }}>
                  <Option value="AB">Alberta</Option>
                  <Option value="BC">British Columbia</Option>
                  <Option value="MB">Manitoba</Option>
                  <Option value="NB">New Brunswick</Option>
                  <Option value="NL">Newfoundland and Labrador</Option>
                  <Option value="NS">Nova Scotia</Option>
                  <Option value="NT">Northwest Territories</Option>
                  <Option value="NU">Nunavut</Option>
                  <Option value="ON">Ontario</Option>
                  <Option value="PE">Prince Edward Island</Option>
                  <Option value="QC">Quebec</Option>
                  <Option value="SK">Saskatchewan</Option>
                  <Option value="YT">Yukon</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="nsc"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>NSC Number</span>}
                rules={[{ required: true, message: "Please enter NSC" }]}
              >
                <Input placeholder="Enter NSC number" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="gstHst"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>GST/HST</span>}
                rules={[{ required: true, message: "Please enter GST/HST" }]}
              >
                <Input placeholder="Enter GST/HST number" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="qst"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>QST (Optional)</span>}
              >
                <Input placeholder="Enter QST number" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="ifta"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>IFTA</span>}
                rules={[{ required: true, message: "Please enter IFTA" }]}
              >
                <Input placeholder="Enter IFTA number" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="email"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Official Email</span>}
                rules={[
                  { required: true, message: "Please enter email" },
                  { type: "email", message: "Please enter a valid email" }
                ]}
              >
                <Input placeholder="Enter email address" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="phone"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Phone Number</span>}
                rules={[{ required: true, message: "Please enter phone number" }]}
              >
                <Input placeholder="Enter phone number" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="countryCode"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Country Code</span>}
                rules={[{ required: true, message: "Please enter country code" }]}
              >
                <Input placeholder="e.g., +1" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* 📍 SECTION 2: ADDRESS INFORMATION */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ 
            fontSize: 14, 
            fontWeight: 700, 
            marginBottom: 16, 
            color: "#1e3a8a",
            paddingBottom: 6,
            borderBottom: "2px solid #eff6ff",
            letterSpacing: "0.4px"
          }}>
            Address Information
          </div>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="addressLine1"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Address Line 1</span>}
                rules={[{ required: true, message: "Please enter address line 1" }]}
              >
                <Input placeholder="Street address" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="addressLine2"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Address Line 2 (Optional)</span>}
              >
                <Input placeholder="Apartment, suite, unit, etc." style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="city"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>City</span>}
                rules={[{ required: true, message: "Please enter city" }]}
              >
                <Input placeholder="Enter city" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="state"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>State/Province</span>}
                rules={[{ required: true, message: "Please enter state/province" }]}
              >
                <Input placeholder="Enter state or region" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="postCode"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Postal / ZIP Code</span>}
                rules={[{ required: true, message: "Please enter postal code" }]}
              >
                <Input placeholder="Enter postal code" style={{ borderRadius: "6px" }} />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                name="country"
                label={<span style={{ fontWeight: 600, color: "#475569" }}>Country</span>}
                rules={[{ required: true, message: "Please select country" }]}
              >
                <Select placeholder="Select country" style={{ borderRadius: "6px" }}>
                  <Option value="CA">Canada</Option>
                  <Option value="US">United States</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </div>

        {/* 🛠️ ACTION BUTTONS FOOTER WRAPPER */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: 12, 
          marginTop: 16, 
          paddingTop: 16,
          borderTop: "1px solid #f1f5f9"
        }}>
          <Button 
            size="large" 
            style={{ borderRadius: "6px", minWidth: 100 }} 
            onClick={() => { form.resetFields(); onClose(); }}
          >
            Cancel
          </Button>
          <Button 
            size="large" 
            type="primary" 
            htmlType="submit" 
            style={{ fontWeight: 600, borderRadius: "6px", minWidth: 120, backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }} 
            loading={submitting}
          >
            {submitting ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}