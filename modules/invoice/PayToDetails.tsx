"use client";

import { Card, Col, Form, Input, Row, Select } from "antd";
import { FormInstance } from "antd";
import type { CompanyProfile } from "../../src/types/company";

interface PayToProps {
  formInstance: FormInstance;
  companiesList: CompanyProfile[];
}

export default function PayToDetails({
  formInstance,
  companiesList,
}: PayToProps) {
  const handleCompanySelect = (companyId: string) => {
    const targetCompany = companiesList.find(
      (c) => c._id === companyId || c.companyName === companyId,
    );
    if (targetCompany) {
      formInstance.setFieldsValue({
        customer: {
          companyName: targetCompany.companyName,
          phone: targetCompany.phone || "",
          email: targetCompany.email || "",
          gstNumber: targetCompany.gstHst || "",
          eTransfer: targetCompany.eTransfer || "",
          address1: `${targetCompany.addressLine1 || ""}, ${targetCompany.city || ""}, ${targetCompany.province || ""}, ${targetCompany.postCode || ""}`,
        },
      });
    }
  };

  const handleClear = () => {
    formInstance.setFieldsValue({
      customer: {
        companyName: undefined,
        phone: undefined,
        email: undefined,
        gstNumber: undefined,
        eTransfer: undefined,
        address1: undefined,
      },
    });
  };

  return (
    <Card
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1e3a8a",
              whiteSpace: "nowrap",
              flex: "0 0 auto",
            }}
          >
            💳 PAY TO / Customer Info...
          </span>

          <div
            style={{
              flex: "1 1 280px",
              minWidth: "220px",
              maxWidth: "400px",
              position: "relative",
            }}
          >
            <Form.Item
              name={["customer", "companySelectKey"]}
              style={{
                marginBottom: 0,
                width: "100%",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Select
                placeholder="Select Company..."
                size="middle"
                onChange={handleCompanySelect}
                onClear={handleClear}
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: "100%", position: "relative", zIndex: 9999 }}
                getPopupContainer={() => document.body}
                popupClassName="customer-select-dropdown"
                options={companiesList.map((company) => ({
                  value: company._id || company.companyName,
                  label: `🏢 ${company.companyName}`,
                }))}
              />
            </Form.Item>
          </div>
        </div>
      }
      variant="borderless"
      styles={{
        body: { padding: "16px 14px", flex: 1, overflow: "visible" },
        header: {
          minHeight: 42,
          padding: "0 14px",
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
          overflow: "visible",
        },
      }}
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: 6,
        overflow: "visible",
        position: "relative",
        minHeight: "100px",
        zIndex: 1,
        isolation: "isolate",
      }}
    >
      <div>
        <Row gutter={[12, 8]}>
          {/* Mobile: single column (xs=24), Tablet and up: 2 columns (sm=12) */}
          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Customer/Company Name"
              name={["customer", "companyName"]}
              rules={[{ required: true, message: "Required" }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="Customer Company Name"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Phone"
              name={["customer", "phone"]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="+1 647 XXX XXXX"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Email"
              name={["customer", "email"]}
              rules={[{ type: "email", message: "Invalid email" }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="email@company.com"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="GST/HST"
              name={["customer", "gstNumber"]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="123456789RT0001"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="E-Transfer Email"
              name={["customer", "eTransfer"]}
              rules={[{ type: "email", message: "Invalid email" }]}
              style={{ marginBottom: 4 }}
            >
              <Input
                placeholder="etransfer@company.com"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} lg={12}>
            <Form.Item
              label="Address"
              name={["customer", "address1"]}
              style={{ marginBottom: 0 }}
            >
              <Input
                placeholder="Street Address, City, Province, Postal Code"
                style={{ borderRadius: 4, height: 34 }}
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Card>
  );
}
