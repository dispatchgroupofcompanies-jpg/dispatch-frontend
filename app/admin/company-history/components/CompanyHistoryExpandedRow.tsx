"use client";

import { Row, Col, Card, Table, Tag, Typography, Descriptions, Space } from "antd";
import {
  FileTextOutlined,
  UserOutlined,
  BankOutlined,
  CarOutlined,
  DollarOutlined
} from "@ant-design/icons";
import type { CompanyHistoryInvoice, CompanyHistoryInvoiceTrip } from "../types";

const { Text, Title } = Typography;

interface ExpandedRowProps {
  record: CompanyHistoryInvoice;
  isMobile: boolean;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string | undefined) => string;
  getStatusColor: (status: string) => string;
}

export default function CompanyHistoryExpandedRow({
  record,
  isMobile,
  formatCurrency,
  formatDate,
  getStatusColor,
}: ExpandedRowProps) {

  const tripColumns = [
    {
      title: "VRID",
      dataIndex: "vrid",
      key: "vrid",
      render: (text: string) => <Text strong style={{ color: "#1e3a8a" }}>{text || "-"}</Text>,
    },
    {
      title: "Driver Name",
      dataIndex: "driverName",
      key: "driverName",
      render: (text: string) => text || "-",
    },
    {
      title: "Load ID 1",
      dataIndex: "loadId1",
      key: "loadId1",
      render: (text: string) => text || "-",
    },
    {
      title: "Load ID 2",
      dataIndex: "loadId2",
      key: "loadId2",
      render: (text: string) => text || "-",
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      render: (text: string) => text || "-",
    },
    {
      title: "Pickup",
      dataIndex: "pickup",
      key: "pickup",
      render: (text: string) => text || "-",
    },
    {
      title: "Drop",
      dataIndex: "drop",
      key: "drop",
      render: (text: string) => text || "-",
    },
    {
      title: "Total Charges",
      dataIndex: "totalCharges",
      key: "totalCharges",
      align: "right" as const,
      render: (amount: number) => (
        <Text strong style={{ color: "#0f766e" }}>
          {formatCurrency(amount || 0)}
        </Text>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: isMobile ? "12px" : "16px",
        background: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
      }}
    >
      <Row gutter={[12, 12]}>
        {/* Invoice Summary Header Section */}
        <Col span={24}>
          <Card
            bordered={false}
            style={{
              borderRadius: "10px",
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
            }}
            styles={{ body: { padding: "16px 18px" } }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <Space size="small">
                <FileTextOutlined style={{ fontSize: 20, color: "#1e3a8a" }} />
                <Title level={5} style={{ margin: 0, color: "#1e3a8a" }}>
                  Invoice Details
                </Title>
              </Space>
              <Tag
                color={getStatusColor(record.invoiceStatus)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontWeight: 600,
                  fontSize: "12px",
                  textTransform: "uppercase",
                }}
              >
                {record.invoiceStatus || "UNKNOWN"}
              </Tag>
            </div>

            <Descriptions
              bordered={false}
              column={{ xs: 1, sm: 2, md: 3 }}
              size="small"
              layout="vertical"
            >
              <Descriptions.Item label={<Text type="secondary">Invoice Date</Text>}>
                <Text strong>
                  {record.invoiceDate ? formatDate(record.invoiceDate) : "N/A"}
                </Text>
              </Descriptions.Item>

              <Descriptions.Item label={<Text type="secondary">Grand Total</Text>}>
                <Space size={4}>
                  <DollarOutlined style={{ color: "#16a34a" }} />
                  <Text strong style={{ color: "#16a34a", fontSize: 18 }}>
                    {formatCurrency(record.grandTotal)}
                  </Text>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {record.payee && (
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{ borderRadius: "10px", boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)" }}
              styles={{ body: { padding: "16px 18px" } }}
            >
              <Space size="small" style={{ marginBottom: 10 }}>
                <UserOutlined style={{ fontSize: 17, color: "#2563eb" }} />
                <Tag color="blue" bordered={false} style={{ margin: 0 }}>PAYEE</Tag>
                <Title level={5} style={{ margin: 0, color: "#1e3a8a" }}>Payee Information</Title>
              </Space>
              <Descriptions bordered={false} column={1} size="small" layout="vertical">
                <Descriptions.Item label={<Text type="secondary">Company</Text>}>
                  <Text strong>{record.payee.companyName || "N/A"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text type="secondary">Contact</Text>}>
                  <Text>{record.payee.contactPerson || record.payee.email || "N/A"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* The invoice customer is the party the invoice is paid to. */}
        {record.customer && (
          <Col xs={24} md={12}>
            <Card
              bordered={false}
              style={{
                borderRadius: "10px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              }}
              styles={{ body: { padding: "16px 18px" } }}
            >
              <Space size="small" style={{ marginBottom: 10 }}>
                <BankOutlined style={{ fontSize: 17, color: "#d97706" }} />
                <Tag color="orange" bordered={false} style={{ margin: 0 }}>PAY TO</Tag>
                <Title level={5} style={{ margin: 0, color: "#1e3a8a" }}>
                  Pay-to Information
                </Title>
              </Space>

              <Descriptions
                bordered={false}
                column={1}
                size="small"
                layout="vertical"
              >
                <Descriptions.Item label={<Text type="secondary">Company</Text>}>
                  <Text strong>{record.customer.companyName || record.customer.customerName || "N/A"}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text type="secondary">Contact</Text>}>
                  <Text>{record.customer.phone || record.customer.email || "N/A"}</Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        )}

        {/* Trips Section */}
        {record.trips && record.trips.length > 0 && (
          <Col span={24}>
            <Card
              bordered={false}
              style={{
                borderRadius: "10px",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.05)",
              }}
              title={
                <Space size="small">
                  <CarOutlined style={{ color: "#1e3a8a" }} />
                  <Text strong style={{ color: "#1e3a8a" }}>
                    Trip Details
                  </Text>
                  <Tag color="blue" style={{ borderRadius: 12 }}>
                    {record.trips.length} {record.trips.length === 1 ? "trip" : "trips"}
                  </Tag>
                </Space>
              }
            >
              {isMobile ? (
                /* Mobile Layout: Responsive Cards */
                <Row gutter={[12, 12]}>
                  {record.trips.map((trip: CompanyHistoryInvoiceTrip, index: number) => (
                    <Col span={24} key={trip.vrid || index}>
                      <Card
                        type="inner"
                        size="small"
                        style={{ background: "#f8fafc", borderRadius: 8 }}
                      >
                        <Descriptions column={2} size="small" layout="vertical">
                          <Descriptions.Item label={<Text type="secondary">VRID</Text>}>
                            <Text strong>{trip.vrid || "-"}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Driver</Text>}>
                            <Text>{trip.driverName || "-"}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Route</Text>}>
                            <Text>{trip.route || "-"}</Text>
                          </Descriptions.Item>
                          <Descriptions.Item label={<Text type="secondary">Charges</Text>}>
                            <Text strong style={{ color: "#0f766e" }}>
                              {formatCurrency(trip.totalCharges || 0)}
                            </Text>
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                /* Desktop Layout: Data Table */
                <Table
                  dataSource={record.trips.map((trip, index: number) => ({
                    ...trip,
                    key: trip.vrid || index,
                  }))}
                  columns={tripColumns}
                  pagination={false}
                  size="small"
                  style={{ borderRadius: "8px" }}
                />
              )}
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}
