"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
  Spin,
  Typography,
  Row,
  Col,
  Statistic,
  Input,
  Popconfirm,
  Select,
  List,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import {
  getAllDeviceRequests,
  getDeviceRequestStats,
  approveDeviceRequest,
  rejectDeviceRequest,
} from "@/src/services/admin/deviceRequestService";
import type {
  DeviceRequest,
  DeviceRequestStats,
} from "@/src/services/admin/deviceRequestService";

const { Title, Text } = Typography;

export default function DeviceRequestsPage() {
  const [loading, setLoading] = useState(true);
  const [deviceRequests, setDeviceRequests] = useState<DeviceRequest[]>([]);
  const [stats, setStats] = useState<DeviceRequestStats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    recentPending: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchDeviceRequests = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllDeviceRequests(
        currentPage,
        20,
        search,
        statusFilter,
      );

      if (response.success) {
        setDeviceRequests(response.deviceRequests);
        setTotal(response.total);
      }
    } catch (error) {
      console.error("Error fetching device requests:", error);
      message.error("Failed to load device requests");
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await getDeviceRequestStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    fetchStats();
    fetchDeviceRequests();
  }, [fetchDeviceRequests, fetchStats]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const response = await approveDeviceRequest(id);
      if (response.success) {
        message.success("Device request approved successfully");
        fetchDeviceRequests();
        fetchStats();
      } else {
        message.error(response.message || "Failed to approve device request");
      }
    } catch (error) {
      message.error("Error approving device request");
    }
  };

  const handleReject = async (id: string) => {
    try {
      const response = await rejectDeviceRequest(id);
      if (response.success) {
        message.success("Device request rejected successfully");
        fetchDeviceRequests();
        fetchStats();
      } else {
        message.error(response.message || "Failed to reject device request");
      }
    } catch (error) {
      message.error("Error rejecting device request");
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const getStatusTag = (status: string) => {
    const colorMap: Record<string, { color: string; bg: string }> = {
      pending: { color: "#d97706", bg: "#fef3c7" },
      approved: { color: "#059669", bg: "#d1fae5" },
      rejected: { color: "#dc2626", bg: "#fee2e2" },
    };
    const iconMap: Record<string, React.ReactNode> = {
      pending: <ClockCircleOutlined />,
      approved: <CheckCircleOutlined />,
      rejected: <CloseCircleOutlined />,
    };
    const colors = colorMap[status] || { color: "#4b5563", bg: "#f3f4f6" };

    return (
      <Tag
        style={{
          color: colors.color,
          backgroundColor: colors.bg,
          border: `1px solid ${colors.color}25`,
          borderRadius: 6,
          padding: "6px 12px",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
        icon={iconMap[status]}
      >
        {status || "N/A"}
      </Tag>
    );
  };

  const formatDateTime = (date: string) => {
    if (!date)
      return (
        <Text type="secondary" style={{ fontSize: 13 }}>
          N/A
        </Text>
      );
    const dateObj = new Date(date);
    return (
      <div style={{ lineHeight: "1.4" }}>
        <Text style={{ fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
          {dateObj.toLocaleDateString("en-CA")}
        </Text>
        <br />
        <Text style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
          {dateObj.toLocaleTimeString("en-CA", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </div>
    );
  };

  const columns: ColumnsType<DeviceRequest> = [
    {
      title: "User",
      key: "user",
      width: 180,
      render: (_, record) => (
        <div style={{ padding: "4px 0" }}>
          <Text
            strong
            style={{ color: "#0f172a", fontSize: 16, fontWeight: 700 }}
          >
            {record.userId?.name || "N/A"}
          </Text>
          <br />
          <Text style={{ fontSize: 13, color: "#475569", fontWeight: 500 }}>
            {record.userId?.email || "N/A"}
          </Text>
        </div>
      ),
    },
    {
      title: "Device ID",
      dataIndex: "deviceId",
      key: "deviceId",
      width: 240,
      render: (deviceId: string) => (
        <div style={{ maxWidth: 220, padding: "4px 0" }}>
          <Text
            code
            copyable
            ellipsis={{ tooltip: deviceId }}
            style={{
              fontSize: 13,
              fontFamily: "monospace",
              backgroundColor: "#f1f5f9",
              padding: "6px 10px",
              borderRadius: 6,
              color: "#0f172a",
              display: "inline-block",
              width: "100%",
              border: "1px solid #e2e8f0",
            }}
          >
            {deviceId}
          </Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => getStatusTag(status),
    },
    {
      title: "Requested At",
      dataIndex: "requestedAt",
      key: "requestedAt",
      width: 180,
      render: (date: string) => formatDateTime(date),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => {
        if (record.status === "pending") {
          return (
            <Space size="middle">
              <Popconfirm
                title="Approve Device"
                description="Are you sure you want to approve this device?"
                onConfirm={() => handleApprove(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  size="middle"
                  icon={<CheckCircleOutlined />}
                  style={{ borderRadius: 6, fontWeight: 600, fontSize: 13 }}
                >
                  Approve
                </Button>
              </Popconfirm>
              <Popconfirm
                title="Reject Device"
                description="Are you sure you want to reject this device?"
                onConfirm={() => handleReject(record._id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  size="middle"
                  icon={<CloseCircleOutlined />}
                  style={{ borderRadius: 6, fontWeight: 600, fontSize: 13 }}
                >
                  Reject
                </Button>
              </Popconfirm>
            </Space>
          );
        }
        return (
          <Text
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: record.status === "approved" ? "#059669" : "#dc2626",
            }}
          >
            {record.status === "approved" ? "Approved" : "Rejected"}
          </Text>
        );
      },
    },
  ];

  if (!mounted) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: isMobile ? "16px 12px" : "32px 24px",
      }}
    >
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>
        {/* Header Section */}
        <div
          style={{
            background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
            padding: isMobile ? "24px 16px" : "28px 36px",
            marginBottom: 24,
            borderRadius: 12,
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Title
            level={2}
            style={{
              color: "#fff",
              margin: 0,
              fontWeight: 800,
              fontSize: isMobile ? 24 : 30,
              letterSpacing: "-0.5px",
            }}
          >
            Device Approvals
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: isMobile ? 14 : 16,
              marginTop: 6,
              display: "block",
            }}
          >
            Review and manage device access requests securely.
          </Text>
        </div>

        {/* Statistics Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} sm={12} lg={6}>
            <Card
              styles={{ body: { padding: "24px" } }}
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <Statistic
                title={
                  <Text
                    style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}
                  >
                    Total Requests
                  </Text>
                }
                value={stats.total}
                prefix={
                  <SafetyCertificateOutlined
                    style={{ color: "#2563eb", fontSize: 20 }}
                  />
                }
                valueStyle={{ color: "#0f172a", fontWeight: 800, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card
              styles={{ body: { padding: "24px" } }}
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <Statistic
                title={
                  <Text
                    style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}
                  >
                    Pending
                  </Text>
                }
                value={stats.pending}
                prefix={
                  <ClockCircleOutlined
                    style={{ color: "#f59e0b", fontSize: 20 }}
                  />
                }
                valueStyle={{ color: "#f59e0b", fontWeight: 800, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card
              styles={{ body: { padding: "24px" } }}
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <Statistic
                title={
                  <Text
                    style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}
                  >
                    Approved
                  </Text>
                }
                value={stats.approved}
                prefix={
                  <CheckCircleOutlined
                    style={{ color: "#10b981", fontSize: 20 }}
                  />
                }
                valueStyle={{ color: "#10b981", fontWeight: 800, fontSize: 28 }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card
              styles={{ body: { padding: "24px" } }}
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
              }}
            >
              <Statistic
                title={
                  <Text
                    style={{ fontSize: 14, fontWeight: 600, color: "#64748b" }}
                  >
                    Rejected
                  </Text>
                }
                value={stats.rejected}
                prefix={
                  <CloseCircleOutlined
                    style={{ color: "#ef4444", fontSize: 20 }}
                  />
                }
                valueStyle={{ color: "#ef4444", fontWeight: 800, fontSize: 28 }}
              />
            </Card>
          </Col>
        </Row>

        {/* Device Requests Table Card */}
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
          }}
          styles={{ body: { padding: 0 } }}
        >
          {/* Action and Filters Header */}
          <div style={{ padding: "24px", borderBottom: "1px solid #f0f0f0" }}>
            <Row gutter={[16, 16]} align="middle" justify="space-between">
              <Col xs={24} md={8}>
                <Space size="middle">
                  <span
                    style={{ fontSize: 18, fontWeight: 800, color: "#0f172a" }}
                  >
                    {statusFilter === "all"
                      ? "All Requests"
                      : `${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Requests`}
                  </span>
                  <Tag
                    color="blue"
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: 13,
                      padding: "2px 8px",
                    }}
                  >
                    {total} Total
                  </Tag>
                </Space>
              </Col>

              <Col xs={24} md={16}>
                <Row
                  gutter={[12, 12]}
                  justify={isMobile ? "start" : "end"}
                  align="middle"
                >
                  <Col xs={12} sm={8} md={6}>
                    <Select
                      value={statusFilter}
                      onChange={(value) => {
                        setStatusFilter(value);
                        setCurrentPage(1);
                      }}
                      style={{ width: "100%", height: 40 }}
                      options={[
                        { value: "all", label: "All Statuses" },
                        { value: "pending", label: "Pending" },
                        { value: "approved", label: "Approved" },
                        { value: "rejected", label: "Rejected" },
                      ]}
                    />
                  </Col>
                  <Col xs={12} sm={10} md={10}>
                    <Input
                      placeholder="Search users..."
                      prefix={<SearchOutlined style={{ color: "#cbd5e1" }} />}
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      style={{ width: "100%", height: 40 }}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={6} md={4}>
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        fetchDeviceRequests();
                        fetchStats();
                      }}
                      style={{
                        borderRadius: 6,
                        width: "100%",
                        height: 40,
                        fontWeight: 600,
                      }}
                    >
                      Refresh
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>

          {/* Table Container - Conditional rendering for Responsive Experience */}
          <div style={{ padding: isMobile ? "12px" : "0px" }}>
            <Spin spinning={loading}>
              {isMobile ? (
                /* Mobile Card List View instead of a tightly breaking table */
                <List
                  itemLayout="vertical"
                  dataSource={deviceRequests}
                  pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: 20,
                    onChange: (page) => setCurrentPage(page),
                    simple: true,
                    style: { textAlign: "center", marginTop: 16 },
                  }}
                  renderItem={(item) => (
                    <Card
                      style={{
                        marginBottom: 12,
                        borderRadius: 10,
                        border: "1px solid #e2e8f0",
                      }}
                      styles={{ body: { padding: 20 } }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 16,
                        }}
                      >
                        <div>
                          <Text
                            strong
                            style={{
                              fontSize: 17,
                              color: "#0f172a",
                              fontWeight: 800,
                            }}
                          >
                            {item.userId?.name || "N/A"}
                          </Text>
                          <br />
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#475569",
                              fontWeight: 500,
                            }}
                          >
                            {item.userId?.email || "N/A"}
                          </Text>
                        </div>
                        {getStatusTag(item.status)}
                      </div>

                      <div
                        style={{
                          backgroundColor: "#f8fafc",
                          padding: "12px 16px",
                          borderRadius: 8,
                          marginBottom: 16,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#64748b",
                            letterSpacing: "0.5px",
                          }}
                        >
                          DEVICE ID
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          <Text
                            code
                            copyable
                            ellipsis
                            style={{
                              width: "100%",
                              display: "block",
                              fontSize: 13,
                              fontFamily: "monospace",
                              color: "#0f172a",
                            }}
                          >
                            {item.deviceId}
                          </Text>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "#64748b",
                              letterSpacing: "0.5px",
                            }}
                          >
                            REQUESTED AT
                          </Text>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: "#0f172a",
                              marginTop: 2,
                            }}
                          >
                            {new Date(item.requestedAt).toLocaleDateString(
                              "en-CA",
                            )}{" "}
                            at{" "}
                            {new Date(item.requestedAt).toLocaleTimeString(
                              "en-CA",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </div>
                        </div>

                        {item.status === "pending" && (
                          <Space size="middle">
                            <Popconfirm
                              title="Approve Device"
                              onConfirm={() => handleApprove(item._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                type="primary"
                                size="middle"
                                icon={<CheckCircleOutlined />}
                                style={{ fontWeight: 600, borderRadius: 6 }}
                              >
                                Approve
                              </Button>
                            </Popconfirm>
                            <Popconfirm
                              title="Reject Device"
                              onConfirm={() => handleReject(item._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button
                                danger
                                size="middle"
                                icon={<CloseCircleOutlined />}
                                style={{ fontWeight: 600, borderRadius: 6 }}
                              >
                                Reject
                              </Button>
                            </Popconfirm>
                          </Space>
                        )}
                      </div>
                    </Card>
                  )}
                />
              ) : (
                <Table
                  columns={columns}
                  dataSource={deviceRequests}
                  rowKey="_id"
                  pagination={{
                    current: currentPage,
                    total: total,
                    pageSize: 20,
                    onChange: (page) => setCurrentPage(page),
                    showSizeChanger: false,
                    showTotal: (totalCount, range) =>
                      `${range[0]}-${range[1]} of ${totalCount} requests`,
                  }}
                  size="large"
                />
              )}
            </Spin>
          </div>
        </Card>
      </div>
    </div>
  );
}
