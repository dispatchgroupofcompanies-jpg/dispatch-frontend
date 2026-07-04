"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, Row, Col, Typography, Tag, Spin, message } from "antd";
import ResponsiveTable from "../../../modules/common/ResponsiveTable";
import {
  DollarOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { getDashboardStats } from "../../../modules/invoice/route";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title, Text } = Typography;

interface DashboardData {
  totalInvoices: number;
  cancelledInvoices: number;
  totalEarnings: number;
  totalSubtotal: number;
  totalTax: number;
  statusBreakdown: Array<{
    _id: string;
    count: number;
    totalAmount: number;
  }>;
  topCompanies: Array<{
    _id: string;
    invoiceCount: number;
    totalAmount: number;
  }>;
  recentInvoices: Array<{
    _id: string;
    invoiceNumber: string;
    invoiceStatus: string;
    grandTotal: number;
    customer: {
      companyName: string;
    };
    createdAt: string;
  }>;
  monthlyStats: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
    earnings: number;
  }>;
}

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1"];

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    totalInvoices: 0,
    cancelledInvoices: 0,
    totalEarnings: 0,
    totalSubtotal: 0,
    totalTax: 0,
    statusBreakdown: [],
    topCompanies: [],
    recentInvoices: [],
    monthlyStats: [],
  });
  const [paddingValue, setPaddingValue] = useState("24px");

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      if (response.data?.success) {
        setData(response.data.data);
      } else {
        message.error(
          response.data?.message || "Failed to load dashboard data",
        );
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (axiosError.response?.status === 401) {
        message.error("Please login to view dashboard");
      } else if (axiosError.response?.data?.message) {
        message.error(axiosError.response.data.message);
      } else if (axiosError.message) {
        message.error(axiosError.message);
      } else {
        message.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardStats();
    };
    loadData();
  }, [fetchDashboardStats]);

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

  const getStatusIcon = (status: string) => {
    const icons: Record<string, React.ReactNode> = {
      paid: <CheckCircleOutlined />,
      sent: <ClockCircleOutlined />,
      draft: <FileTextOutlined />,
      cancelled: <CloseCircleOutlined />,
      pending: <ClockCircleOutlined />,
    };
    return icons[status.toLowerCase()] || <FileTextOutlined />;
  };

  const recentInvoiceColumns = [
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      key: "invoiceNumber",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Customer",
      dataIndex: ["customer", "companyName"],
      key: "customer",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Amount",
      dataIndex: "grandTotal",
      key: "grandTotal",
      render: (amount: number) => <Text strong>{formatCurrency(amount)}</Text>,
    },
    {
      title: "Status",
      dataIndex: "invoiceStatus",
      key: "invoiceStatus",
      render: (status: string) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
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

  const monthlyChartData =
    data?.monthlyStats.map((stat) => ({
      month: `${stat._id.month}/${stat._id.year}`,
      earnings: stat.earnings,
      count: stat.count,
    })) || [];

  const statusChartData =
    data?.statusBreakdown.map((stat) => ({
      name: stat._id.toUpperCase(),
      value: stat.count,
    })) || [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPaddingValue("12px");
      } else if (window.innerWidth < 1024) {
        setPaddingValue("20px");
      } else {
        setPaddingValue("24px");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
    <div style={{ padding: `${paddingValue} 0 24px 0` }}>
      {/* Page Title */}
      <div style={{ marginBottom: 24, padding: `0 ${paddingValue}` }}>
        <Title level={3} style={{ margin: 0, color: "#0f172a" }}>
          Dashboard Overview
        </Title>
        <Text type="secondary">
          Real-time insights into your business performance
        </Text>
      </div>

      {/* Stats Cards */}
      <Row
        gutter={[12, 12]}
        style={{
          marginBottom: 24,
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          padding: `0 ${paddingValue}`,
        }}
      >
        {[
          {
            title: "Total Invoices",
            value: data?.totalInvoices || 0,
            icon: <FileTextOutlined />,
            bg: "#6366f1",
          },
          {
            title: "Total Earnings",
            value: formatCurrency(data?.totalEarnings || 0),
            icon: <DollarOutlined />,
            bg: "#ec4899",
          },
          {
            title: "Subtotal",
            value: formatCurrency(data?.totalSubtotal || 0),
            icon: <ShoppingCartOutlined />,
            bg: "#3b82f6",
          },
          {
            title: "Total Dispatch",
            value: formatCurrency(data?.totalTax || 0),
            icon: <DollarOutlined />,
            bg: "#f59e0b",
          },
          {
            title: "Cancelled",
            value: data?.cancelledInvoices || 0,
            icon: <CloseCircleOutlined />,
            bg: "#ef4444",
          },
        ].map((item, index) => (
          <Col
            key={index}
            xs={24}
            sm={12}
            md={8}
            style={{
              flex: "1 0 18%",
              minWidth: "140px",
            }}
          >
            <Card
              style={{
                background: item.bg,
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                height: "100%",
              }}
              styles={{ body: { padding: "12px 8px" } }} // Padding kam kar di taaki box zyada bada na lage
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    color: "#ffffff",
                    fontSize: "24px",
                    marginBottom: "4px",
                    opacity: 0.95,
                  }}
                >
                  {item.icon}
                </div>
                <div
                  style={{
                    color: "rgba(255, 255, 255, 0.85)",
                    fontSize: "11px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.3px",
                    marginBottom: "2px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                  }}
                >
                  {item.value}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts Row */}
      <Row
        gutter={[16, 16]}
        style={{ marginBottom: 24, padding: `0 ${paddingValue}` }}
      >
        <Col xs={24} lg={16}>
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
                📈 Earnings Overview (Last 6 Months)
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: "#000", fontWeight: 600 }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#667eea"
                  strokeWidth={3}
                  name="Earnings"
                  dot={{ fill: "#667eea", r: 4 }}
                  activeDot={{ r: 6, fill: "#764ba2" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
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
                📊 Invoice Status
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top Companies and Recent Invoices */}
      <Row gutter={[16, 16]} style={{ padding: `0 ${paddingValue}` }}>
        <Col xs={24} lg={12}>
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
                🏆 Top Companies by Revenue
              </div>
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data?.topCompanies || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="_id"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  interval={0}
                  tick={{ fill: "#666", fontSize: 11 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <YAxis
                  tick={{ fill: "#666", fontSize: 12 }}
                  axisLine={{ stroke: "#e0e0e0" }}
                />
                <Tooltip
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: "#000", fontWeight: 600 }}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="totalAmount"
                  fill="#667eea"
                  name="Revenue"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <ResponsiveTable
            cardTitle={
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
                📋 Recent Invoices
              </div>
            }
            cardProps={{
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
            minScrollWidth={600}
            dataSource={data?.recentInvoices || []}
            columns={recentInvoiceColumns}
            rowKey="_id"
            pagination={{
              pageSize: 5,
              style: { marginTop: 12 },
            }}
            size="small"
            scroll={{ x: 600 }}
          />
        </Col>
      </Row>
    </div>
  );
}
