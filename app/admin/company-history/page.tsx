"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  Spin,
  message,
  Space,
  Typography,
  Button,
} from "antd";
import {
  FileTextOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { getInvoices } from "@/src/services/admin/invoice";
import type { CompanyHistoryInvoice } from "./types";
import CompanyHistoryFilters from "./components/CompanyHistoryFilters";
import CompanyHistoryExpandedRow from "./components/CompanyHistoryExpandedRow";
import CompanyHistoryExportModals from "./components/CompanyHistoryExportModals";
import { getPayeeSerialNumbers } from "@/src/utils/invoiceSerial";

const { Title, Text } = Typography;

export default function CompanyHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<CompanyHistoryInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<
    CompanyHistoryInvoice[]
  >([]);
  const [companies, setCompanies] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState<readonly React.Key[]>(
    [],
  );
  const mountedRef = useRef(true);
  const payeeSerialNumbers = useMemo(
    () => getPayeeSerialNumbers(invoices),
    [invoices],
  );

  const applyFilters = useCallback(() => {
    let filtered = [...invoices];

    if (selectedCompany) {
      filtered = filtered.filter(
        (inv) => inv.customer?.companyName === selectedCompany,
      );
    }

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((inv) => {
        const companyMatch = inv.customer?.companyName
          ?.toLowerCase()
          .includes(searchLower);

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
    searchText,
  ]);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getInvoices();
      const invoiceData = response.data || [];

      setInvoices(invoiceData);
      setFilteredInvoices(invoiceData);

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

  const handleClearFilters = () => {
    setSelectedCompany(null);
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

  const columns = [
    {
      title: "Invoice #",
      key: "invoiceNumber",
      render: (_: unknown, record: CompanyHistoryInvoice) => (
        <Text strong>#{payeeSerialNumbers.get(record._id) || 1}</Text>
      ),
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

      {/* Search and Actions */}
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          marginBottom: 16,
          border: "1px solid #f1f5f9",
        }}
      >
        <CompanyHistoryFilters
          companies={companies}
          selectedCompany={selectedCompany}
          setSelectedCompany={setSelectedCompany}
          searchText={searchText}
          setSearchText={setSearchText}
          onClearFilters={handleClearFilters}
          isMobile={isMobile}
        />
      </Card>

      {/* Active Filters Summary */}
      {(selectedCompany || searchText) && (
        <Row
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid #f1f5f9",
            marginBottom: 16,
          }}
        >
          <Col span={24}>
            <Space size="small" wrap>
              <Text
                strong
                style={{ color: "#64748b", marginRight: 4, fontSize: "12px" }}
              >
                Active filters:
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

      {/* Results Count Summary */}
      <Row style={{ marginBottom: 16 }}>
        <Col span={24}>
          <Text type="secondary">
            Showing <Text strong>{filteredInvoices.length}</Text> of{" "}
            <Text strong>{invoices.length}</Text> invoices
          </Text>
        </Col>
      </Row>

      {/* Export Buttons */}
      <CompanyHistoryExportModals
        filteredInvoices={filteredInvoices}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        isMobile={isMobile}
        selectedCompany={selectedCompany}
        payeeSerialNumbers={payeeSerialNumbers}
      />

      {/* Invoices Table Card */}
      <Card
        style={{
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginTop: 16,
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
        ) : isMobile ? (
          <div style={{ display: "grid", gap: 12 }}>
            {filteredInvoices.map((invoice) => {
              const expanded = expandedRowKeys.includes(invoice._id);
              return <div key={invoice._id} style={{ display: "grid", gap: 12, padding: 14, border: "1px solid #e2e8f0", borderRadius: 12, background: "#fff" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto minmax(0, 1fr)", gap: 10, alignItems: "center" }}>
                  <span style={{ fontWeight: 700, color: "#fff", background: "#10b981", padding: "4px 9px", borderRadius: 6 }}>#{payeeSerialNumbers.get(invoice._id) || 1}</span>
                  <span style={{ fontWeight: 700, color: "#1e293b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{formatDate(invoice.createdAt)}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Amount</div><div style={{ fontWeight: 700, color: "#16a34a" }}>{formatCurrency(invoice.grandTotal)}</div></div>
                  <div><div style={{ fontSize: 11, color: "#64748b", marginBottom: 3 }}>Status</div><Tag color={getStatusColor(invoice.invoiceStatus)} style={{ margin: 0, fontWeight: 600 }}>{invoice.invoiceStatus.toUpperCase()}</Tag></div>
                </div>
                <Button type="primary" size="small" onClick={() => handleExpandRow(invoice)}>{expanded ? "Hide Details" : "View Details"}</Button>
                {expanded && <CompanyHistoryExpandedRow record={invoice} isMobile formatCurrency={formatCurrency} formatDate={formatDate} getStatusColor={getStatusColor} />}
              </div>;
            })}
          </div>
        ) : (
          <Table
            dataSource={filteredInvoices}
            columns={columns}
            rowKey="_id"
            expandable={{
              expandedRowRender: (record) => (
                <CompanyHistoryExpandedRow
                  record={record}
                  isMobile={isMobile}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              ),
              expandedRowKeys: expandedRowKeys,
              onExpandedRowsChange: handleExpandedRowsChange,
              expandIcon: ({ expanded, record }) => {
                return (
                  <Button
                    type="link"
                    icon={expanded ? <UpOutlined /> : <DownOutlined />}
                    onClick={() => handleExpandRow(record)}
                    style={{ color: "#1890ff", padding: 0 }}
                  >
                    {expanded ? "Hide Details" : "View Details"}
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
            style={{ borderRadius: "8px", overflow: "hidden" }}
          />
        )}
      </Card>
    </div>
  );
}
