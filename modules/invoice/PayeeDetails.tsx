"use client";

import { Card, Col, Form, Input, Row, Select, Divider } from "antd";
import { FormInstance } from "antd";

interface PayeeProps {
  formInstance: FormInstance;
  companiesList: any[];
}

export default function PayeeDetails({
  formInstance,
  companiesList,
}: PayeeProps) {
  const selectedPayeeCompany = Form.useWatch(
    ["payee", "payeeSelectKey"],
    formInstance,
  );
  const manualCompanyName = Form.useWatch(
    ["payee", "companyName"],
    formInstance,
  );
  const shouldShowFields = !!selectedPayeeCompany || !!manualCompanyName;

  const handleCompanySelect = (companyId: string) => {
    const targetCompany = companiesList.find(
      (c) => c._id === companyId || c.companyName === companyId,
    );
    if (targetCompany) {
      formInstance.setFieldsValue({
        payee: {
          payeeSelectKey: companyId,
          companyName: targetCompany.companyName,
          contactPerson: targetCompany.carrierIdentifier || "",
          address1: `${targetCompany.addressLine1 || ""}, ${targetCompany.city || ""}, ${targetCompany.province || ""}, ${targetCompany.postCode || ""}`,
          phone: targetCompany.phone || "",
          email: targetCompany.email || "",
          gstNumber: targetCompany.gstHst || "",
          eTransferAddress: targetCompany.eTransfer || "",
        },
      });
    }
  };

  const handleClear = () => {
    formInstance.setFieldsValue({
      payee: {
        payeeSelectKey: undefined,
        companyName: undefined,
        contactPerson: undefined,
        address1: undefined,
        phone: undefined,
        email: undefined,
        gstNumber: undefined,
        eTransferAddress: undefined,
      },
    });
  };

  // Shared Label Style - Matches Customer Card perfectly
  const labelStyle = {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
    marginBottom: "6px",
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
            gap: "12px",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#1e3a8a",
              whiteSpace: "nowrap",
            }}
          >
            🏢 Payee Information (Issuer)
          </span>

          <div style={{ width: "220px" }}>
            <Form.Item
              name={["payee", "payeeSelectKey"]}
              style={{ marginBottom: 0 }}
            >
              <Select
                placeholder="Select Profile..."
                size="middle"
                onChange={handleCompanySelect}
                onClear={handleClear}
                allowClear
                showSearch
                optionFilterProp="label"
                style={{ width: "100%" }}
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
        body: { padding: "16px 14px", flex: 1 },
        header: {
          minHeight: 42,
          padding: "0 14px",
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
        },
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #e2e8f0",
        borderRadius: 6,
      }}
    >
      {shouldShowFields && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Row 1: 3 Columns (Company, Contact, Phone) */}
          <Row gutter={12}>
            <Col span={8}>
              <span style={labelStyle}>Company Name</span>
              <Form.Item
                name={["payee", "companyName"]}
                rules={[{ required: true, message: "Required" }]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  size="middle"
                  placeholder="Company Name"
                  style={{ borderRadius: 4 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <span style={labelStyle}>Contact Person / Carrier</span>
              <Form.Item
                name={["payee", "contactPerson"]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  size="middle"
                  placeholder="Driver / Carrier Name"
                  style={{ borderRadius: 4 }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <span style={labelStyle}>Phone</span>
              <Form.Item name={["payee", "phone"]} style={{ marginBottom: 0 }}>
                <Input
                  size="middle"
                  placeholder="+1 647 XXX XXXX"
                  style={{ borderRadius: 4 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 2: 2 Columns (Email, GST/HST) */}
          <Row gutter={12}>
            <Col span={12}>
              <span style={labelStyle}>Email</span>
              <Form.Item name={["payee", "email"]} style={{ marginBottom: 0 }}>
                <Input
                  size="middle"
                  placeholder="email@company.com"
                  style={{ borderRadius: 4 }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <span style={labelStyle}>GST/HST</span>
              <Form.Item
                name={["payee", "gstNumber"]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  size="middle"
                  placeholder="123456789RT0001"
                  style={{ borderRadius: 4 }}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row 3: 1 Full-Width Address Column (Matches Right Card Structure) */}
          <Row>
            <Col span={24}>
              <span style={labelStyle}>Address</span>
              <Form.Item
                name={["payee", "address1"]}
                style={{ marginBottom: 0 }}
              >
                <Input
                  size="middle"
                  placeholder="Street Address, City, Province, Postal Code"
                  style={{ borderRadius: 4 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
}
