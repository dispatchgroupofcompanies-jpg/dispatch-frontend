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
  Avatar,
} from "antd";
import {
  FileTextOutlined,
  PlusOutlined,
  MinusOutlined,
  UserOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { getInvoices } from "@/src/services/admin/invoice";
import type { CompanyHistoryInvoice } from "./types";
import CompanyHistoryFilters from "./components/CompanyHistoryFilters";
import CompanyHistoryExpandedRow from "./components/CompanyHistoryExpandedRow";
import CompanyHistoryExportModals from "./components/CompanyHistoryExportModals";
import { getPayeeSerialNumbers } from "@/src/utils/invoiceSerial";

const { Title, Text } = Typography;

const getPayeeName = (invoice: CompanyHistoryInvoice) =>
  invoice.payee?.companyName || invoice.payeeName;

const getPayToName = (invoice: CompanyHistoryInvoice) =>
  invoice.customer?.companyName ||
  invoice.customer?.customerName ||
  invoice.payToName ||
  invoice.vendorName ||
  invoice.payToAccountName;

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
    []
  );
  const mountedRef = useRef(true);
  const payeeSerialNumbers = useMemo(
    () => getPayeeSerialNumbers(invoices),
    [invoices]
  );

  const applyFilters = useCallback(() => {
    let filtered = [...invoices];

    if (selectedCompany) {
      filtered = filtered.filter(
        (inv) =>
          getPayeeName(inv) === selectedCompany ||
          getPayToName(inv) === selectedCompany
      );
    }

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter((inv) => {
        const companyMatch = getPayToName(inv)
          ?.toLowerCase()
          .includes(searchLower);

        const payeeMatch =
          getPayeeName(inv)?.toLowerCase().includes(searchLower) ||
          inv.payeeName?.toLowerCase().includes(searchLower) ||
          inv.payeeEmail?.toLowerCase().includes(searchLower) ||
          inv.payee?.email?.toLowerCase().includes(searchLower);

        const payToMatch =
          getPayToName(inv)?.toLowerCase().includes(searchLower) ||
          inv.payToName?.toLowerCase().includes(searchLower) ||
          inv.vendorName?.toLowerCase().includes(searchLower) ||
          inv.customer?.email?.toLowerCase().includes(searchLower);

        const tripMatch = inv.trips?.some(
          (trip) =>
            trip.vrid?.toLowerCase().includes(searchLower) ||
            trip.loadId1?.toLowerCase().includes(searchLower) ||
            trip.loadId2?.toLowerCase().includes(searchLower)
        );

        return companyMatch || payeeMatch || payToMatch || tripMatch;
      });
    }

    setFilteredInvoices(filtered);
  }, [invoices, selectedCompany, searchText]);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getInvoices();
      const invoiceData = response.data || [];

      setInvoices(invoiceData);
      setFilteredInvoices(invoiceData);

      const uniqueCompanies = Array.from(
        new Set(
          invoiceData.flatMap((inv: CompanyHistoryInvoice) =>
            [getPayeeName(inv), getPayToName(inv)].filter(
              (name): name is string => Boolean(name)
            )
          )
        )
      );
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
    return colors[status?.toLowerCase()] || "default";
  };

  const [isMobile, setIsMobile] = useState(false);
  const headerPadding = isMobile ? "16px 12px" : "24px 20px";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Columns using fixed pixel widths to guarantee alignment on row expansion
  const columns = [
    {
      title: "Payee Details",
      key: "payeeDetails",
      width: 260,
      render: (_: unknown, record: CompanyHistoryInvoice) => {
        const payeeName = getPayeeName(record);
        const payeeEmail = record.payee?.email || record.payeeEmail;

        return (
          <Space size="small">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: "#e0e7ff", color: "#1e3a8a", flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text strong style={{ fontSize: "13px" }}>
                {payeeName || "N/A"}
              </Text>
              {payeeEmail && (
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  {payeeEmail}
                </Text>
              )}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Pay-to Details",
      key: "payToDetails",
      width: 240,
      render: (_: unknown, record: CompanyHistoryInvoice) => {
        const payToName = getPayToName(record);

        return (
          <Space size="small">
            <Avatar
              size="small"
              icon={<BankOutlined />}
              style={{ backgroundColor: "#fef3c7", color: "#d97706", flexShrink: 0 }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Text strong style={{ fontSize: "13px" }}>
                {payToName || "N/A"}
              </Text>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      width: 120,
      align: "right" as const,
      render: (amount: number) => (
        <Text strong style={{ color: "#16a34a", fontSize: "14px" }}>
          {formatCurrency(amount || 0)}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      width: 110,
      align: "center" as const,
      render: (status: string) => (
        <Tag
          color={getStatusColor(status)}
          style={{
            borderRadius: "12px",
            fontWeight: 600,
            fontSize: "11px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {status ? status.toUpperCase() : "N/A"}
        </Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      align: "right" as const,
      render: (date: string) => (
        <Text type="secondary" style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
          {date ? formatDate(date) : "N/A"}
        </Text>
      ),
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
              marginTop: 4,
              display: "block",
            }}
          >
            View and filter all invoices across the system
          </Text>
        </div>
      </div>

      {/* Search and Filters */}
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
          exportControl={
            <CompanyHistoryExportModals
              filteredInvoices={filteredInvoices}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              isMobile={isMobile}
              selectedCompany={selectedCompany}
              payeeSerialNumbers={payeeSerialNumbers}
            />
          }
        />
      </Card>

      {/* Active Filters Summary */}
      {(selectedCompany || searchText) && (
        <Row
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid #f1f5f9",
            marginBottom: 12,
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
          <Text type="secondary" style={{ fontSize: 14 }}>
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
          marginTop: 0,
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
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
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
          <div style={{ display: "grid", gap: 5 }}>
            {filteredInvoices.map((invoice) => {
              const expanded = expandedRowKeys.includes(invoice._id);
              const payeeName = getPayeeName(invoice);
              const payToName = getPayToName(invoice);

              return (
                <div
                  key={invoice._id}
                  style={{
                    display: "grid",
                    gap: 10,
                    padding: 12,
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatDate(invoice.createdAt)}
                    </Text>
                    <Button
                      type="text"
                      shape="circle"
                      size="small"
                      icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
                      onClick={() => handleExpandRow(invoice)}
                    />
                  </div>

                  <div style={{ display: "grid", gap: 4, fontSize: 13 }}>
                    <div>
                      <Text type="secondary">Payee: </Text>
                      <Text strong>{payeeName || "N/A"}</Text>
                    </div>
                    <div>
                      <Text type="secondary">Pay-to: </Text>
                      <Text strong>{payToName || "N/A"}</Text>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 8,
                      borderTop: "1px dashed #e2e8f0",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>Amount</div>
                      <div style={{ fontWeight: 700, color: "#16a34a", fontSize: 14 }}>
                        {formatCurrency(invoice.grandTotal)}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 11, color: "#64748b", marginBottom: 2 }}>Status</div>
                      <Tag
                        color={getStatusColor(invoice.invoiceStatus)}
                        style={{ margin: 0, fontWeight: 600, fontSize: 10 }}
                      >
                        {invoice.invoiceStatus?.toUpperCase() || "N/A"}
                      </Tag>
                    </div>
                  </div>

                  {expanded && (
                    <CompanyHistoryExpandedRow
                      record={invoice}
                      isMobile
                      formatCurrency={formatCurrency}
                      formatDate={formatDate}
                      getStatusColor={getStatusColor}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <Table
            dataSource={filteredInvoices}
            columns={columns}
            rowKey="_id"
            scroll={{ x: "max-content" }}
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
              expandIcon: ({ expanded, onExpand, record }) => (
                <Button
                  type="text"
                  shape="circle"
                  size="small"
                  icon={expanded ? <MinusOutlined /> : <PlusOutlined />}
                  onClick={(e) => onExpand(record, e)}
                />
              ),
            }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} invoices`,
            }}
            size="middle"
            style={{ borderRadius: "8px" }}
          />
        )}
      </Card>
    </div>
  );
}
