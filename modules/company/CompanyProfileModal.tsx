"use client";

import { Form, Modal, Button, message, Input, Select } from "antd";
import { useState } from "react";

const { Option } = Select;

export default function CompanyProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      setSubmitting(true);
      
   
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
      title={<span style={{ fontSize: 15, fontWeight: 700 }}>🏢 Company Profile</span>}
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      width={800}
      style={{ top: 20 }}
      styles={{ body: { padding: "8px 16px" } }}
    >
      <Form
        form={form}
        layout="vertical"
        size="small"
        onFinish={handleSubmit}
        requiredMark={false}
        style={{ maxHeight: "65vh", overflowY: "auto" }}
      >
        {/* Company Information Section */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ 
            fontSize: 13, 
            fontWeight: 600, 
            marginBottom: 10, 
            color: "#1e3a8a",
            paddingBottom: 6,
            borderBottom: "1px solid #e5e7eb"
          }}>
            Company Information
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Form.Item
              name="companyName"
              label="Company Name"
              rules={[{ required: true, message: "Please enter company name" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>

            <Form.Item
              name="carrierIdentifier"
              label="Carrier Identifier"
              rules={[{ required: true, message: "Please enter carrier identifier" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter carrier identifier" />
            </Form.Item>

            <Form.Item
              name="province"
              label="Province/Territory"
              rules={[{ required: true, message: "Please select province" }]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Select province">
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

            <Form.Item
              name="nsc"
              label="NSC"
              rules={[{ required: true, message: "Please enter NSC" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter NSC number" />
            </Form.Item>

            <Form.Item
              name="gstHst"
              label="GST/HST"
              rules={[{ required: true, message: "Please enter GST/HST" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter GST/HST number" />
            </Form.Item>

            <Form.Item
              name="qst"
              label="QST"
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter QST number (if applicable)" />
            </Form.Item>

            <Form.Item
              name="ifta"
              label="IFTA"
              rules={[{ required: true, message: "Please enter IFTA" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter IFTA number" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" }
              ]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item
              name="countryCode"
              label="Country Code"
              rules={[{ required: true, message: "Please enter country code" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="e.g., +1" />
            </Form.Item>
          </div>
        </div>

        {/* Address Section */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ 
            fontSize: 13, 
            fontWeight: 600, 
            marginBottom: 10, 
            color: "#1e3a8a",
            paddingBottom: 6,
            borderBottom: "1px solid #e5e7eb"
          }}>
            Address Information
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Form.Item
              name="addressLine1"
              label="Address Line 1"
              rules={[{ required: true, message: "Please enter address line 1" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Street address" />
            </Form.Item>

            <Form.Item
              name="addressLine2"
              label="Address Line 2"
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Apartment, suite, etc. (optional)" />
            </Form.Item>

            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: "Please enter city" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter city" />
            </Form.Item>

            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: "Please enter state" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter state/province" />
            </Form.Item>

            <Form.Item
              name="postCode"
              label="Post Code"
              rules={[{ required: true, message: "Please enter postal code" }]}
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Enter postal code" />
            </Form.Item>

            <Form.Item
              name="country"
              label="Country"
              rules={[{ required: true, message: "Please select country" }]}
              style={{ marginBottom: 10 }}
            >
              <Select placeholder="Select country">
                <Option value="CA">Canada</Option>
                <Option value="US">United States</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          display: "flex", 
          justifyContent: "flex-end", 
          gap: 8, 
          marginTop: 12, 
          paddingTop: 10,
          borderTop: "1px solid #e5e7eb"
        }}>
          <Button size="middle" onClick={() => { form.resetFields(); onClose(); }}>
            Cancel
          </Button>
          <Button 
            size="middle" 
            type="primary" 
            htmlType="submit" 
            style={{ fontWeight: 600 }} 
            loading={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}