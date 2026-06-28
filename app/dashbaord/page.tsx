"use client";

import {
  Avatar,
  Button,
  Card,
  Divider,
  Table,
  Tag,
  Typography,
  Alert,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutOutlined, UserOutlined, FileAddOutlined, UnorderedListOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("list");
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("userData");
    const token = localStorage.getItem("authToken");

    if (!token) {
      message.error("Please login first");
      router.push("/login");
      return;
    }

    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
    message.success("Logged out successfully");
    router.push("/login");
  };

  const handleSidebarClick = (page) => {
    setActivePage(page);
  };

  const columns = [
    {
      title: "Invoice",
      dataIndex: "invoice",
    },
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => (
        <Tag color={status === "Paid" ? "green" : status === "Pending" ? "gold" : "default"}>
          {status}
        </Tag>
      ),
    },
  ];

  const invoiceData = [
    {
      key: "1",
      invoice: "INV-1001",
      company: "Acme Logistics",
      amount: "$2,350",
      status: "Paid",
    },
    {
      key: "2",
      invoice: "INV-1002",
      company: "Raven Transport",
      amount: "$4,760",
      status: "Pending",
    },
    {
      key: "3",
      invoice: "INV-1003",
      company: "Orion Supply",
      amount: "$1,120",
      status: "Draft",
    },
  ];

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 0, display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', background: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(18px)', padding: '32px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <Avatar size={56} icon={<UserOutlined />} style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff' }} />
            <div>
              <Text style={{ color: 'rgba(255,255,255,0.85)', display: 'block', fontSize: 16, fontWeight: 600 }}>Hello,</Text>
              <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: 700 }}>{userData?.name || 'User'}</Text>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <Button
              type={activePage === 'create' ? 'primary' : 'default'}
              icon={<FileAddOutlined />}
              style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, fontWeight: 600 }}
              block
              onClick={() => handleSidebarClick('create')}
            >
              Create Invoice
            </Button>
            <Button
              type={activePage === 'list' ? 'primary' : 'default'}
              icon={<UnorderedListOutlined />}
              style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, fontWeight: 600 }}
              block
              onClick={() => handleSidebarClick('list')}
            >
              Invoice List
            </Button>
          </div>
        </div>

        <div>
          <Divider style={{ borderColor: 'rgba(255,255,255,0.15)' }} />
          <Button
            type="default"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 8, fontWeight: 700 }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>
                {activePage === 'create' ? '📝 Create Invoice' : '📄 Invoice List'}
              </Title>
              {userData && (
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Welcome, <strong>{userData.name}</strong>
                </Text>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: 24, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* Welcome Alert */}
          {userData && (
            <Alert
              title={`🎉 Welcome back, ${userData.name}!`}
              description={`You're logged in as ${userData.email}. Let's manage your dispatch operations efficiently.`}
              type="success"
              showIcon
              style={{ marginBottom: 24, background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: '12px' }}
            />
          )}

          {activePage === 'list' ? (
            <Card
              title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Invoice List</span>}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}
            >
              <Table
                columns={columns}
                dataSource={invoiceData}
                pagination={false}
                responsive
              />
            </Card>
          ) : (
            <Card
              title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>Create Invoice</span>}
              style={{
                background: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start', padding: '24px 0' }}>
                <Text style={{ fontSize: 16, color: '#344054' }}>
                  Click below to open the invoice creation page placeholder.
                </Text>
                <Button type="primary" icon={<FileAddOutlined />} size="large" style={{ width: '220px', fontWeight: 700 }}>
                  Create Invoice
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}