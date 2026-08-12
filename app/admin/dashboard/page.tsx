"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Card,
  Statistic,
  Row,
  Col,
  Table,
  Tag,
  message,
  Spin,
  Typography,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { getAdminDashboardStats } from "@/src/services/admin/dashboard";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const { Title, Text } = Typography;

interface Invoice {
  _id: string;
  invoiceNumber: string;
  grandTotal: number;
  invoiceStatus: string;
  createdAt: string;
  currency?: string;
  payee?: {
    companyName: string;
  };
}

interface DashboardStats {
  totalInvoices: number;
  pendingInvoices: number;
  approvedInvoices: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalInvoices: 0,
    pendingInvoices: 0,
    approvedInvoices: 0,
    totalRevenue: 0,
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const mountedRef = useRef(false);

  // const fetchDashboardData = useCallback(async () => {
  //   if (!mountedRef.current) return;

  //   try {
  //     setLoading(true);
  //     const response = await getAdminDashboardStats();

  //     if (response.success) {
  //       setStats(
  //         response.data.stats || {
  //           totalInvoices: 0,
  //           pendingInvoices: 0,
  //           approvedInvoices: 0,
  //           totalRevenue: 0,
  //         },
  //       );
  //       setRecentInvoices(response.data.recentInvoices || []);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching dashboard data:", error);
  //     message.error("Failed to load real-time dashboard data");
  //   } finally {
  //     if (mountedRef.current) {
  //       setLoading(false);
  //     }
  //   }
  // }, []);

  useEffect(() => {
    mountedRef.current = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const response = await getAdminDashboardStats();

        if (response.success) {
          setStats(
            response.data.stats || {
              totalInvoices: 0,
              pendingInvoices: 0,
              approvedInvoices: 0,
              totalRevenue: 0,
            },
          );
          setRecentInvoices(response.data.recentInvoices || []);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        message.error("Failed to load real-time dashboard data");
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  const donutChartOptions = {
    labels: ["Pending Invoices", "Approved Invoices"],
    colors: ["#f59e0b", "#10b981"],
    legend: { position: "bottom" as const },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Flow",
              formatter: () => `${stats.totalInvoices}`,
            },
          },
        },
      },
    },
  };

  const donutChartSeries = [stats.pendingInvoices, stats.approvedInvoices];

  const barChartOptions = {
    chart: { id: "revenue-bar", toolbar: { show: false } },
    colors: ["#2563eb"],
    xaxis: {
      categories: recentInvoices.map((inv) => inv.invoiceNumber).reverse(),
      labels: { style: { colors: "#64748b", fontWeight: 500 } },
    },
    plotOptions: {
      bar: { borderRadius: 5, horizontal: false, columnWidth: "35%" },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light" as const,
      y: {
        formatter: function (val: number) {
          return `$${val.toFixed(2)} CAD`; // Real Value with format on hover
        },
      },
    },
  };

  const barChartSeries = [
    {
      name: "Invoice Total Weight",
      data: recentInvoices.map((inv) => inv.grandTotal).reverse(),
    },
  ];

  const invoiceColumns: ColumnsType<Invoice> = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text: string) => (
        <Text strong style={{ color: "#1e293b" }}>
          {text}
        </Text>
      ),
    },
    {
      title: "Payee (Vendor)",
      dataIndex: ["payee", "companyName"],
      key: "payeeCompany",
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (amount: number, record: Invoice) => (
        <Text strong style={{ color: "#0f172a" }}>
          ${amount?.toFixed(2)} {record.currency || "CAD"}
        </Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: "default",
          pending: "warning",
          approved: "success",
          paid: "processing",
          rejected: "error",
        };
        return (
          <Tag
            color={colorMap[status] || "default"}
            style={{ borderRadius: "4px", fontWeight: 600 }}
          >
            {status?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Generated At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("en-CA") : "N/A",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const headerPadding = isMobile ? "20px 16px" : "24px 20px";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setIsCompact(window.innerWidth < 1024);
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
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Title
            level={2}
            style={{
              color: "#fff",
              margin: 0,
              fontWeight: 700,
              fontSize: isMobile ? 20 : 24,
            }}
          >
            Dashboard Overview
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: isMobile ? 12 : 13,
              marginTop: 6,
              display: "block",
            }}
          >
            Real-time core parameters analytics and data metric feed
          </Text>
        </div>
      </div>

      {/* Content Container */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: `0 ${isMobile ? "12px" : "20px"} ${isMobile ? "12px" : "20px"}`,
        }}
      >
        <Spin spinning={loading}>
          {/* 🎴 SECTION 1: COUNTER CARDS */}
          <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <Statistic
                  title={
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      Total System Invoices
                    </Text>
                  }
                  value={stats.totalInvoices}
                  prefix={
                    <FileTextOutlined
                      style={{ color: "#2563eb", marginRight: 8 }}
                    />
                  }
                  valueStyle={{
                    color: "#0f172a",
                    fontWeight: 800,
                    fontSize: 26,
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <Statistic
                  title={
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      Pending Verification
                    </Text>
                  }
                  value={stats.pendingInvoices}
                  prefix={
                    <ClockCircleOutlined
                      style={{ color: "#f59e0b", marginRight: 8 }}
                    />
                  }
                  valueStyle={{
                    color: "#f59e0b",
                    fontWeight: 800,
                    fontSize: 26,
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <Statistic
                  title={
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      Approved Pipelines
                    </Text>
                  }
                  value={stats.approvedInvoices}
                  prefix={
                    <CheckCircleOutlined
                      style={{ color: "#10b981", marginRight: 8 }}
                    />
                  }
                  valueStyle={{
                    color: "#10b981",
                    fontWeight: 800,
                    fontSize: 26,
                  }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                style={{
                  borderRadius: 12,
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                }}
              >
                <Statistic
                  title={
                    <Text
                      type="secondary"
                      style={{ fontSize: 13, fontWeight: 500 }}
                    >
                      Gross Volume Settlement
                    </Text>
                  }
                  value={stats.totalRevenue}
                  prefix={
                    <DollarCircleOutlined
                      style={{ color: "#0f172a", marginRight: 8 }}
                    />
                  }
                  suffix={
                    <ArrowUpOutlined
                      style={{ color: "#10b981", fontSize: 14 }}
                    />
                  }
                  precision={2}
                  valueStyle={{
                    color: "#0f172a",
                    fontWeight: 800,
                    fontSize: 26,
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* 📊 SECTION 2: GRAPHICAL INTELLIGENCE PLOTS */}
          <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
            <Col xs={24} lg={14}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    Invoice Volume Scaling (CAD)
                  </span>
                }
                style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              >
                {recentInvoices.length > 0 ? (
                  <Chart
                    options={barChartOptions}
                    series={barChartSeries}
                    type="bar"
                    height={260}
                    width="100%"
                  />
                ) : (
                  <div
                    style={{
                      height: 260,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Dynamic Log Recorded
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={10}>
              <Card
                title={
                  <span style={{ fontWeight: 600 }}>
                    Audit Status Distribution
                  </span>
                }
                style={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              >
                {stats.totalInvoices > 0 ? (
                  <Chart
                    options={donutChartOptions}
                    series={donutChartSeries}
                    type="donut"
                    height={260}
                    width="100%"
                  />
                ) : (
                  <div
                    style={{
                      height: 260,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    No Active Flow Spread
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          <Card
            title={
              <span style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
                Recent Processing Invoices Stream
              </span>
            }
            style={{
              borderRadius: 12,
              border: "1px solid #e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.01)",
            }}
          >
            {isCompact ? (
              <div style={{ display: "grid", gap: 10 }}>
                {recentInvoices.map((invoice) => {
                  const status = invoice.invoiceStatus || "draft";
                  const colors: Record<string, string> = { draft: "default", pending: "warning", approved: "success", paid: "processing", rejected: "error" };
                  return <div key={invoice._id} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: 10, padding: 12, border: "1px solid #e2e8f0", borderRadius: 10 }}>
                    <div style={{ minWidth: 0 }}><div style={{ fontWeight: 700, color: "#1e293b", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{invoice.payee?.companyName || "Unassigned company"}</div><div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>{invoice.invoiceNumber || "Invoice"}</div></div>
                    <div style={{ textAlign: "right" }}><div style={{ fontWeight: 700, color: "#0f172a" }}>${Number(invoice.grandTotal || 0).toFixed(2)} {invoice.currency || "CAD"}</div><Tag color={colors[status] || "default"} style={{ margin: "4px 0 0" }}>{status.toUpperCase()}</Tag></div>
                  </div>;
                })}
              </div>
            ) : <Table columns={invoiceColumns} dataSource={recentInvoices} rowKey="_id" pagination={false} />}
          </Card>
        </Spin>
      </div>
    </div>
  );
}
