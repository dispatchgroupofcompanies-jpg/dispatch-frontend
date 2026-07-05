"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Spin,
  message,
  Space,
  Typography,
} from "antd";
import {
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { getInvoices } from "../../../modules/invoice/route";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  grandTotal: number;
  customer: {
    companyName: string;
  };
  createdAt: string;
  invoiceDate?: string;
}

export default function CompanyHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );
  const [presetFilter, setPresetFilter] = useState<string | null>(null);

  // 🎯 Pipeline Status Filter State Hook
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<string | null>(
    null,
  );

  const applyFilters = useCallback(() => {
    let filtered = [...invoices];

    // 1. Filter by company
    if (selectedCompany) {
      filtered = filtered.filter(
        (inv) => inv.customer?.companyName === selectedCompany,
      );
    }

    // 2. Filter by Invoice Status (Draft / Paid)
    if (invoiceStatusFilter) {
      filtered = filtered.filter(
        (inv) =>
          inv.invoiceStatus?.toLowerCase() ===
          invoiceStatusFilter.toLowerCase(),
      );
    }

    // 3. Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");
      filtered = filtered.filter((inv) => {
        const invDate = dayjs(inv.createdAt);
        return (
          (invDate.isAfter(startDate) || invDate.isSame(startDate, "day")) &&
          (invDate.isBefore(endDate) || invDate.isSame(endDate, "day"))
        );
      });
    }

    // 4. Apply preset filters
    if (presetFilter) {
      const now = dayjs();
      let startDate: dayjs.Dayjs;

      switch (presetFilter) {
        case "week":
          startDate = now.subtract(7, "days");
          break;
        case "month":
          startDate = now.subtract(1, "month");
          break;
        case "quarter":
          startDate = now.subtract(3, "months");
          break;
        case "year":
          startDate = now.subtract(1, "year");
          break;
        default:
          startDate = now.subtract(7, "days");
      }

      filtered = filtered.filter((inv) => {
        const invDate = dayjs(inv.createdAt);
        return invDate.isAfter(startDate) || invDate.isSame(startDate, "day");
      });
    }

    setFilteredInvoices(filtered);
  }, [invoices, selectedCompany, invoiceStatusFilter, dateRange, presetFilter]);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getInvoices();
      const invoiceData = response.data.data || [];
      setInvoices(invoiceData);
      setFilteredInvoices(invoiceData);

      // Extract unique company names
      const uniqueCompanies = Array.from(
        new Set(
          invoiceData
            .map((inv: Invoice) => inv.customer?.companyName)
            .filter(Boolean),
        ),
      ) as string[];
      setCompanies(uniqueCompanies.sort());
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      message.error("Failed to load invoice history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handlePresetFilter = (preset: string) => {
    setPresetFilter(preset);
    const now = dayjs();
    let startDate: dayjs.Dayjs;

    switch (preset) {
      case "week":
        startDate = now.subtract(7, "days");
        break;
      case "month":
        startDate = now.subtract(1, "month");
        break;
      case "quarter":
        startDate = now.subtract(3, "months");
        break;
      case "year":
        startDate = now.subtract(1, "year");
        break;
      default:
        startDate = now.subtract(7, "days");
    }

    setDateRange([startDate, now]);
  };

  const handleClearFilters = () => {
    setSelectedCompany(null);
    setInvoiceStatusFilter(null);
    setDateRange(null);
    setPresetFilter(null);
    setFilteredInvoices(invoices);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      paid: "green",
      sent: "blue",
      draft: "default",
      cancelled: "red",
      pending: "orange",
    };
    return colors[status.toLowerCase()] || "default";
  };

  const columns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Company Name",
      dataIndex: ["customer", "companyName"],
      key: "companyName",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (amount: number) => (
        <Text strong style={{ color: "#52c41a" }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} style={{ fontWeight: 600 }}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
    },
  ];

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Loading History Logs..." />
      </div>
    );
  }

  return (
    <div>
      {/* Page Title Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
          Company History
        </Title>
        <Text type="secondary">
          View and filter all invoice history by company, status, and timeline
          dates
        </Text>
      </div>

      {/* Modern Card Filters Section */}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          marginBottom: 24,
          border: "1px solid #f1f5f9",
        }}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 700,
              color: "#1e3a8a",
            }}
          >
            <FilterOutlined style={{ color: "#2563eb" }} />
            Filter Ledger Analytics
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {/* Company Filter */}
          <Col xs={24} sm={12} md={8} lg={5}>
            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Company Name
              </Text>
              <Select
                placeholder="Select company"
                value={selectedCompany}
                onChange={setSelectedCompany}
                style={{ width: "100%" }}
                allowClear
                showSearch
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={companies.map((company) => ({
                  value: company,
                  label: company,
                }))}
              />
            </div>
          </Col>

          {/* 🎯 Invoice Status Filter (Draft / Paid) */}
          <Col xs={24} sm={12} md={8} lg={4}>
            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Invoice Status
              </Text>
              <Select
                placeholder="All Statuses"
                value={invoiceStatusFilter}
                onChange={setInvoiceStatusFilter}
                style={{ width: "100%" }}
                allowClear
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "paid", label: "Paid" },
                ]}
              />
            </div>
          </Col>

          {/* Date Range Filter */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Date Range
              </Text>
              <RangePicker
                value={dateRange}
                onChange={(dates) =>
                  setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)
                }
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </div>
          </Col>

          {/* Preset Filters */}
          <Col xs={24} sm={12} md={8} lg={4}>
            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Quick Period
              </Text>
              <Select
                placeholder="Select period"
                value={presetFilter}
                onChange={handlePresetFilter}
                style={{ width: "100%" }}
                allowClear
                options={[
                  { value: "week", label: "Last 7 Days" },
                  { value: "month", label: "Last 1 Month" },
                  { value: "quarter", label: "Last 3 Months" },
                  { value: "year", label: "Last 1 Year" },
                ]}
              />
            </div>
          </Col>

          {/* Action Buttons */}
          <Col xs={24} sm={24} md={8} lg={5}>
            <div>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 6,
                  color: "#475569",
                  fontSize: "13px",
                }}
              >
                Actions
              </Text>
              <Space style={{ width: "100%" }}>
                <Button
                  type="primary"
                  icon={<ReloadOutlined />}
                  onClick={fetchInvoices}
                  loading={loading}
                  style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}
                >
                  Refresh
                </Button>
                <Button icon={<FilterOutlined />} onClick={handleClearFilters}>
                  Clear
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Active Filters Summary Logs */}
        {(selectedCompany ||
          dateRange ||
          presetFilter ||
          invoiceStatusFilter) && (
          <Row
            style={{
              marginTop: 16,
              paddingTop: 14,
              borderTop: "1px solid #f1f5f9",
            }}
          >
            <Col span={24}>
              <Space size="small" wrap>
                <Text
                  strong
                  style={{ color: "#64748b", marginRight: 4, fontSize: "12px" }}
                >
                  Active Pipelines:
                </Text>

                {selectedCompany && (
                  <Tag
                    color="blue"
                    bordered={false}
                    style={{ fontWeight: 600, borderRadius: "4px" }}
                  >
                    Company: {selectedCompany}
                  </Tag>
                )}

                {invoiceStatusFilter && (
                  <Tag
                    color={
                      invoiceStatusFilter === "paid" ? "success" : "warning"
                    }
                    bordered={false}
                    style={{
                      fontWeight: 700,
                      borderRadius: "4px",
                      textTransform: "uppercase",
                    }}
                  >
                    Status: {invoiceStatusFilter}
                  </Tag>
                )}

                {dateRange && dateRange[0] && dateRange[1] && (
                  <Tag
                    color="green"
                    bordered={false}
                    style={{ fontWeight: 600, borderRadius: "4px" }}
                  >
                    Timeline: {dateRange[0].format("YYYY-MM-DD")} -{" "}
                    {dateRange[1].format("YYYY-MM-DD")}
                  </Tag>
                )}

                {presetFilter && (
                  <Tag
                    color="purple"
                    bordered={false}
                    style={{ fontWeight: 600, borderRadius: "4px" }}
                  >
                    Period:{" "}
                    {presetFilter === "week"
                      ? "Last 7 Days"
                      : presetFilter === "month"
                        ? "Last 1 Month"
                        : presetFilter === "quarter"
                          ? "Last 3 Months"
                          : "Last 1 Year"}
                  </Tag>
                )}
              </Space>
            </Col>
          </Row>
        )}
      </Card>

      {/* Results Count Summary */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Text type="secondary">
            Showing <Text strong>{filteredInvoices.length}</Text> of{" "}
            <Text strong>{invoices.length}</Text> invoices
          </Text>
        </Col>
      </Row>

      {/* Invoices Table Card */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
        title={
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              fontWeight: 600,
              color: "#1e3a8a",
            }}
          >
            <FileTextOutlined />
            Invoice History Ledger Logs
          </div>
        }
      >
        <Table
          dataSource={filteredInvoices}
          columns={columns}
          rowKey="_id" // Stable primary unique key mapping configuration
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} invoices`,
          }}
          size="middle"
          scroll={{ x: 800 }}
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      </Card>
    </div>
  );
}
