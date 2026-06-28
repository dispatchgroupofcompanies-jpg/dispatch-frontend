"use client";

import { Avatar, Button, Card, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { UserOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export default function ProfilePage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}
    >
      <Card
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 24,
          padding: "32px",
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", gap: 18, alignItems: "center", marginBottom: 24 }}>
          <Avatar size={72} icon={<UserOutlined />} style={{ background: "#667eea", color: "#ffffff" }} />
          <div>
            <Title level={3} style={{ margin: 0 }}>
              Your Profile
            </Title>
            <Text type="secondary">Simple profile page placeholder</Text>
          </div>
        </div>

        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Text style={{ fontSize: 16, lineHeight: 1.7, color: "#344054" }}>
            This page is for your profile view. The header avatar on the dashboard now opens a real profile page instead of 404.
          </Text>
          <Button type="primary" size="large" onClick={() => router.push("/dashbaord")}> 
            Back to Dashboard
          </Button>
        </Space>
      </Card>
    </div>
  );
}
