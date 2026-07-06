"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  Input,
} from "antd";
import {
  FileTextOutlined,
  FilterOutlined,
  ReloadOutlined,
  ExportOutlined,
  SearchOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Modal } from "antd";
import { getInvoices } from "@/src/services/admin/invoice";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface CompanyHistoryInvoice {
  carrierNeedToPay?: number;
  carrierNeedsToReceive?: number;
  _id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  grandTotal: number;
  customer?: {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  createdAt: string;
  invoiceDate?: string;
  trips?: Array<{
    driverName?: string;
    vrid?: string;
    loadId1?: string;
    loadId2?: string;
    totalCharges?: number;
    dispatchPercentage?: number;
    dispatchAmount?: number;
  }>;
}

export default function CompanyHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<CompanyHistoryInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<
    CompanyHistoryInvoice[]
  >([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(
    null,
  );
  const [presetFilter, setPresetFilter] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportDays, setExportDays] = useState(7);
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    [],
  );
  const mountedRef = useRef(true);

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

    // 5. Search by company name, vrid, or load ID
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((inv) => {
        // Search in company name
        const companyMatch = inv.customer?.companyName
          ?.toLowerCase()
          .includes(searchLower);

        // Search in trips for vrid or load IDs
        const tripMatch = inv.trips?.some(
          (trip) =>
            trip.vrid?.toLowerCase().includes(searchLower) ||
            trip.loadId1?.toLowerCase().includes(searchLower) ||
            trip.loadId2?.toLowerCase().includes(searchLower),
        );

        return companyMatch || tripMatch;
      });
    }

    setFilteredInvoices(filtered);
  }, [
    invoices,
    selectedCompany,
    invoiceStatusFilter,
    dateRange,
    presetFilter,
    searchText,
  ]);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getInvoices();
      console.log("🔍 API Response:", response);

      const invoiceData = response.data || [];
      console.log("🔍 Invoice Data:", invoiceData);
      console.log("🔍 Total invoices found:", invoiceData.length);

      setInvoices(invoiceData);
      setFilteredInvoices(invoiceData);

      // Extract unique company names
      const uniqueCompanies = Array.from(
        new Set(
          invoiceData
            .map((inv: CompanyHistoryInvoice) => inv.customer?.companyName)
            .filter(Boolean),
        ),
      ) as string[];
      setCompanies(uniqueCompanies.sort());

      if (invoiceData.length === 0) {
        message.info("No invoices found in the system");
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
      message.error("Failed to load invoice history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const loadData = async () => {
      await fetchInvoices();
    };
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchInvoices]);

  useEffect(() => {
    if (mountedRef.current) {
      applyFilters();
    }
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

  const handleExpandRow = (record: CompanyHistoryInvoice) => {
    const key = record._id;
    setExpandedRowKeys((prev) => {
      const newKeys = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      return newKeys as readonly React.Key[];
    });
  };

  const handleExpandedRowsChange = (keys: readonly React.Key[]) => {
    setExpandedRowKeys(keys);
  };

  const handleClearFilters = () => {
    setSelectedCompany(null);
    setInvoiceStatusFilter(null);
    setDateRange(null);
    setPresetFilter(null);
    setSearchText("");
    setFilteredInvoices(invoices);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
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

  const showExportModal = () => {
    setExportModalOpen(true);
  };

  const handleExportConfirm = () => {
    setExportModalOpen(false);

    // Filter invoices based on selected days
    const now = dayjs();
    const startDate = now.subtract(exportDays, "days").startOf("day");
    const endDate = now.endOf("day");

    const invoicesToExport = filteredInvoices.filter((inv) => {
      const invDate = dayjs(inv.createdAt);
      return (
        (invDate.isAfter(startDate) || invDate.isSame(startDate, "day")) &&
        (invDate.isBefore(endDate) || invDate.isSame(endDate, "day"))
      );
    });

    if (invoicesToExport.length === 0) {
      message.warning(`No invoices found in the last ${exportDays} days`);
      return;
    }

    const excelData = invoicesToExport.map((invoice, index) => {
      // Calculate carrier need to pay and receive
      let carrierNeedToPay = 0;
      let carrierNeedsToReceive = 0;

      if (invoice.trips && invoice.trips.length > 0) {
        invoice.trips.forEach((trip) => {
          const totalCharges = Number(trip.totalCharges || 0);
          const dispatchPercentage = Number(trip.dispatchPercentage || 10);
          const dispatchAmount = (totalCharges * dispatchPercentage) / 100;

          carrierNeedToPay += dispatchAmount;
          carrierNeedsToReceive += totalCharges - dispatchAmount;
        });
      }

      // Agar trips array hai to values nikalne ke liye
      const driverNames =
        invoice.trips
          ?.map((t) => t.driverName)
          .filter(Boolean)
          .join(", ") || "-";
      const vrids =
        invoice.trips
          ?.map((t) => t.vrid)
          .filter(Boolean)
          .join(", ") || "-";

      return {
        "S.NO": index + 1,
        "INVOICE NUMBER": invoice.invoiceNumber || "-",
        "COMPANY NAME": invoice.customer?.companyName || "-",
        "INVOICE DATE": invoice.invoiceDate
          ? formatDate(invoice.invoiceDate)
          : "-",
        "CARRIER NEED TO PAY":
          carrierNeedToPay > 0 ? formatCurrency(carrierNeedToPay) : "-",
        "DRIVER NAME": driverNames,
        VRID: vrids,
        AMOUNT: formatCurrency(invoice.grandTotal),
        "CARRIER NEED TO RECEIVE":
          carrierNeedsToReceive > 0
            ? formatCurrency(carrierNeedsToReceive)
            : "-",
        STATUS: invoice.invoiceStatus
          ? invoice.invoiceStatus.toUpperCase()
          : "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);

    const objectMaxLength: { width: number }[] = [];
    excelData.forEach((row) => {
      Object.keys(row).forEach((key, ind) => {
        const val = row[key as keyof typeof row];
        const valueLength = val ? val.toString().length : 10;
        const headerLength = key.length;

        // Jo bada ho (Header ya Value), uske hisaab se space set hoga
        const maxLen = Math.max(valueLength, headerLength) + 3; // +3 extra padding space ke liye

        if (!objectMaxLength[ind]) {
          objectMaxLength[ind] = { width: maxLen };
        } else {
          if (maxLen > objectMaxLength[ind].width) {
            objectMaxLength[ind].width = maxLen;
          }
        }
      });
    });
    ws["!cols"] = objectMaxLength; // Worksheet mein widths apply ki

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    // Generate filename with date range
    const filename = `Invoices_${startDate.format("YYYY-MM-DD")}_to_${endDate.format("YYYY-MM-DD")}`;

    // Save file
    XLSX.writeFile(wb, `${filename}.xlsx`);
    message.success(
      `Exported ${invoicesToExport.length} invoices successfully!`,
    );
  };

  const handleExportCancel = () => {
    setExportModalOpen(false);
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

  // Expanded row render to show all invoice details
  const expandedRowRender = (record: CompanyHistoryInvoice) => {
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
                  <Text strong>Invoice Number:</Text>
                  <br />
                  <Text>{record.invoiceNumber}</Text>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Text strong>Invoice Date:</Text>
                  <br />
                  <Text>
                    {record.invoiceDate
                      ? formatDate(record.invoiceDate)
                      : "N/A"}
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
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Text strong>Carrier Need to Pay:</Text>
                  <br />
                  <Text strong style={{ color: "#f5222d" }}>
                    {formatCurrency(record.carrierNeedToPay || 0)}
                  </Text>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Text strong>Carrier Need to Receive:</Text>
                  <br />
                  <Text strong style={{ color: "#52c41a" }}>
                    {formatCurrency(record.carrierNeedsToReceive || 0)}
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
                    <Text strong>Contact Person:</Text>
                    <br />
                    <Text>{record.customer.contactPerson || "N/A"}</Text>
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
                  dataSource={record.trips.map((trip, index) => ({
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
  };

  const [isMobile, setIsMobile] = useState(false);
  const headerPadding = isMobile ? "20px 16px" : "24px 20px";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: isMobile ? "12px" : "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
          padding: headerPadding,
          marginBottom: isMobile ? 16 : 24,
          borderRadius: isMobile ? 12 : 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <Title
            level={3}
            style={{
              margin: 0,
              color: "#fff",
              fontSize: isMobile ? 20 : 24,
              fontWeight: 700,
            }}
          >
            Invoice History
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: isMobile ? 12 : 14,
              marginTop: 6,
              display: "block",
            }}
          >
            View and filter all invoices across the system
          </Text>
        </div>
      </div>

      {/* Search Bar */}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          marginBottom: 16,
          border: "1px solid #f1f5f9",
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={12} lg={8}>
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
                Search
              </Text>
              <Input
                placeholder="Search by company, VRID, or Load ID..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                prefix={<SearchOutlined />}
                size="large"
                allowClear
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={12} lg={16}>
            <div
              style={{ display: "flex", gap: 8, marginTop: isMobile ? 8 : 24 }}
            >
              <Button
                type="primary"
                icon={<ExportOutlined />}
                onClick={showExportModal}
                size="large"
                style={{
                  background: "#10b981",
                  borderColor: "#10b981",
                  fontWeight: 600,
                }}
              >
                Export to Excel
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={fetchInvoices}
                loading={loading}
                size="large"
              >
                Refresh
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

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
            Filter Invoices
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
          invoiceStatusFilter ||
          searchText) && (
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

                {searchText && (
                  <Tag
                    color="orange"
                    bordered={false}
                    style={{ fontWeight: 600, borderRadius: "4px" }}
                  >
                    Search: {searchText}
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

      {/* Export Modal */}
      <Modal
        title="Export to Excel"
        open={exportModalOpen}
        onOk={handleExportConfirm}
        onCancel={handleExportCancel}
        okText="Export"
        cancelText="Cancel"
        centered
      >
        <div style={{ padding: "20px 0" }}>
          <p style={{ marginBottom: 16, fontSize: 14, color: "#475569" }}>
            Select the number of days to export:
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[7, 15, 30, 90, 180, 365].map((days) => (
              <Button
                key={days}
                type={exportDays === days ? "primary" : "default"}
                onClick={() => setExportDays(days)}
                style={{ minWidth: 80 }}
              >
                {days === 365
                  ? "1 Year"
                  : days === 90
                    ? "3 Months"
                    : days === 30
                      ? "1 Month"
                      : days === 15
                        ? "15 Days"
                        : `${days} Days`}
              </Button>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: "#94a3b8" }}>
            This will export all invoices from the last {exportDays} days based
            on current filters.
          </p>
        </div>
      </Modal>

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
            All Invoices
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" tip="Loading invoices..." />
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div
            style={{
              padding: "60px 24px",
              textAlign: "center",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              border: "2px dashed #cbd5e1",
              borderRadius: "16px",
            }}
          >
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>📋</div>
            <Title
              level={4}
              style={{
                margin: "0 0 8px 0",
                color: "#1e293b",
                fontWeight: 700,
              }}
            >
              No Invoices Found
            </Title>
            <Text
              style={{
                fontSize: "14px",
                color: "#64748b",
                margin: "0 auto 24px",
                maxWidth: "480px",
                display: "block",
                lineHeight: "1.6",
              }}
            >
              {searchText
                ? "Try adjusting your search criteria or filters"
                : "Invoices created by users will appear here"}
            </Text>
          </div>
        ) : (
          <Table
            dataSource={filteredInvoices}
            columns={columns}
            rowKey="_id"
            expandable={{
              expandedRowRender,
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: handleExpandedRowsChange,
              expandIcon: ({ expanded, record }) => {
                const isExpanded = expandedRowKeys.includes(record._id);
                return (
                  <Button
                    type="link"
                    icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => handleExpandRow(record)}
                    style={{ color: "#1890ff", padding: 0 }}
                  >
                    {isExpanded ? "Hide Details" : "View Details"}
                  </Button>
                );
              },
            }}
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
        )}
      </Card>
    </div>
  );
}
