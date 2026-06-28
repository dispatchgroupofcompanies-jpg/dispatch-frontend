"use client";

import {
  Avatar,
  Button,
  Card,
  Divider,
  Form,
  Input,
  message,
  Select,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LogoutOutlined, UserOutlined, UnorderedListOutlined, FileAddOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

export default function CreateInvoicePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const activePage = pathname?.includes("/dashbaord/create") ? "create" : "list";

  useEffect(() => {
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

  const goToCreate = () => router.push("/dashbaord/create");
  const goToList = () => router.push("/dashbaord");

  const onFinish = (values: any) => {
    message.success("Invoice draft saved successfully");
    console.log("Invoice data", values);
  };

  if (loading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 0, display: 'flex' }}>
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
              onClick={goToCreate}
            >
              Create Invoice
            </Button>
            <Button
              type={activePage === 'list' ? 'default' : 'default'}
              icon={<UnorderedListOutlined />}
              style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, fontWeight: 600 }}
              block
              onClick={goToList}
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
        <div style={{ background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div>
              <Title level={3} style={{ margin: 0, color: 'white' }}>
                📝 Create Invoice
              </Title>
              {userData && (
                <Text style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Welcome, <strong>{userData.name}</strong>
                </Text>
              )}
            </div>
          </div>
        </div>

        <div style={{ padding: 24, maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
          <Card
            title={<span style={{ fontSize: '18px', fontWeight: 'bold' }}>New Invoice</span>}
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}
          >
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item name="invoiceNumber" label="Invoice Number" rules={[{ required: true, message: 'Enter invoice number' }]}>
                <Input placeholder="INV-1004" />
              </Form.Item>

              <Form.Item name="company" label="Customer / Company" rules={[{ required: true, message: 'Enter company name' }]}>
                <Input placeholder="Fleet Forwarding" />
              </Form.Item>

              <Form.Item name="amount" label="Amount" rules={[{ required: true, message: 'Enter total amount' }]}>
                <Input placeholder="$1,500" />
              </Form.Item>

              <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Select invoice status' }]}>
                <Select placeholder="Select status">
                  <Option value="Draft">Draft</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Paid">Paid</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" size="large" style={{ minWidth: 180, fontWeight: 700 }}>
                  Save Invoice
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
