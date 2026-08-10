"use client";

import { Row, Col, Card, Table, Tag, Typography } from "antd";
import type { CompanyHistoryInvoice } from "../types";

const { Text } = Typography;

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
  return (
    <div
      style={{
        padding: "20px",
        background: "#fafafa",
        borderRadius: "8px",
      }}
    >
      <Row gutter={[16, 16]}>
        {/* Invoice Details */}
        <Col span={24}>
          <Card
            size="small"
            title={
              <Text strong style={{ color: "#1e3a8a" }}>
                Invoice Details
              </Text>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Text strong>Invoice Date:</Text>
                <br />
                <Text>
                  {record.invoiceDate ? formatDate(record.invoiceDate) : "N/A"}
                </Text>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Text strong>Status:</Text>
                <br />
                <Tag color={getStatusColor(record.invoiceStatus)}>
                  {record.invoiceStatus?.toUpperCase()}
                </Tag>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <Text strong>Grand Total:</Text>
                <br />
                <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                  {formatCurrency(record.grandTotal)}
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Customer Details */}
        {record.customer && (
          <Col span={24}>
            <Card
              size="small"
              title={
                <Text strong style={{ color: "#1e3a8a" }}>
                  Customer Information
                </Text>
              }
              style={{ marginBottom: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Text strong>Company Name:</Text>
                  <br />
                  <Text>{record.customer.companyName || "N/A"}</Text>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Text strong>Phone:</Text>
                  <br />
                  <Text>{record.customer.phone || "N/A"}</Text>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Text strong>Email:</Text>
                  <br />
                  <Text>{record.customer.email || "N/A"}</Text>
                </Col>
              </Row>
            </Card>
          </Col>
        )}

        {/* Trips Details */}
        {record.trips && record.trips.length > 0 && (
          <Col span={24}>
            <Card
              size="small"
              title={
                <Text strong style={{ color: "#1e3a8a" }}>
                  Trip Details ({record.trips.length} trips)
                </Text>
              }
            >
              <Table
                dataSource={record.trips?.map((trip, index: number) => ({
                  ...trip,
                  key: index,
                }))}
                pagination={false}
                size="small"
                scroll={{ x: 800 }}
                columns={[
                  {
                    title: "VRID",
                    dataIndex: "vrid",
                    key: "vrid",
                    render: (text: string) => <Text strong>{text}</Text>,
                  },
                  {
                    title: "Driver Name",
                    dataIndex: "driverName",
                    key: "driverName",
                  },
                  {
                    title: "Load ID 1",
                    dataIndex: "loadId1",
                    key: "loadId1",
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
                    render: (amount: number) => (
                      <Text strong>{formatCurrency(amount || 0)}</Text>
                    ),
                  },
                  {
                    title: "Dispatch %",
                    dataIndex: "dispatchPercentage",
                    key: "dispatchPercentage",
                    render: (value: number) => `${value || 10}%`,
                  },
                  {
                    title: "Dispatch Amount",
                    dataIndex: "dispatchAmount",
                    key: "dispatchAmount",
                    render: (amount: number) => (
                      <Text strong style={{ color: "#f5222d" }}>
                        {formatCurrency(amount || 0)}
                      </Text>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
}