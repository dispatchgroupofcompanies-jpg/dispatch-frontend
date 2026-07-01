"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Select, DatePicker, Button, Table, Tag, Spin, message, Space, Typography } from "antd";
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
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [presetFilter, setPresetFilter] = useState<string | null>(null);

  const applyFilters = useCallback(() => {
    let filtered = [...invoices];

    // Filter by company
    if (selectedCompany) {
      filtered = filtered.filter(
        (inv) => inv.customer?.companyName === selectedCompany
      );
    }

    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf("day");
      const endDate = dateRange[1].endOf("day");
      filtered = filtered.filter((inv) => {
        const invDate = dayjs(inv.createdAt);
        return invDate.isAfter(startDate) && invDate.isBefore(endDate);
      });
    }

    // Apply preset filters
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
        return invDate.isAfter(startDate);
      });
    }

    setFilteredInvoices(filtered);
  }, [invoices, selectedCompany, dateRange, presetFilter]);

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
            .filter(Boolean)
        )
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
    const loadData = async () => {
      await fetchInvoices();
    };
    loadData();
  }, [fetchInvoices]);

  useEffect(() => {
    const filterData = async () => {
      await applyFilters();
    };
    filterData();
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
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
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
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: "0 0 24px 0" }}>
      {/* Page Title */}
      <div style={{ marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
          Company History
        </Title>
        <Text type="secondary">
          View and filter all invoice history by company and date
        </Text>
      </div>

      {/* Filters Section */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginBottom: 24,
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
            <FilterOutlined />
            Filters
          </div>
        }
      >
        <Row gutter={[16, 16]}>
          {/* Company Filter */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8, color: "#374151" }}>
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

          {/* Date Range Filter */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8, color: "#374151" }}>
                Date Range
              </Text>
              <RangePicker
                value={dateRange}
                onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs] | null)}
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
              />
            </div>
          </Col>

          {/* Preset Filters */}
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8, color: "#374151" }}>
                Quick Filters
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
          <Col xs={24} sm={12} md={8} lg={6}>
            <div>
              <Text strong style={{ display: "block", marginBottom: 8, color: "#374151" }}>
                Actions
              </Text>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchInvoices}
                  loading={loading}
                >
                  Refresh
                </Button>
                <Button
                  icon={<FilterOutlined />}
                  onClick={handleClearFilters}
                >
                  Clear
                </Button>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Active Filters Summary */}
        {(selectedCompany || dateRange || presetFilter) && (
          <Row style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0f0f0" }}>
            <Col span={24}>
              <Space size="middle">
                <Text strong>Active Filters:</Text>
                {selectedCompany && (
                  <Tag color="blue">Company: {selectedCompany}</Tag>
                )}
                {dateRange && dateRange[0] && dateRange[1] && (
                  <Tag color="green">
                    {dateRange[0].format("YYYY-MM-DD")} to {dateRange[1].format("YYYY-MM-DD")}
                  </Tag>
                )}
                {presetFilter && (
                  <Tag color="purple">
                    Period: {presetFilter === "week" ? "Last 7 Days" : 
                             presetFilter === "month" ? "Last 1 Month" :
                             presetFilter === "quarter" ? "Last 3 Months" : "Last 1 Year"}
                  </Tag>
                )}
              </Space>
            </Col>
          </Row>
        )}
      </Card>

      {/* Results Summary */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Text type="secondary">
            Showing <Text strong>{filteredInvoices.length}</Text> of{" "}
            <Text strong>{invoices.length}</Text> invoices
          </Text>
        </Col>
      </Row>

      {/* Invoices Table */}
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
            Invoice History
          </div>
        }
      >
        <Table
          dataSource={filteredInvoices}
          columns={columns}
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