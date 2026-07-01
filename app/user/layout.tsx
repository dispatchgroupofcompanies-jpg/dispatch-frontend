"use client";

import { Layout, Avatar, Badge, Dropdown, Button, Space } from "antd";
import { 
  BellOutlined, 
  UserOutlined,
  LogoutOutlined,
  SettingOutlined
} from "@ant-design/icons";
import Sidebar from "../components/Sidebar";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import AuthGuard from "./auth-guard";

const { Content, Header } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const getResponsivePadding = (): number => {
    if (typeof window === "undefined") return 24;
    const paddingMap = { xs: 12, sm: 16, md: 20, lg: 24 };
    const key = window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : window.innerWidth < 1024 ? 'md' : 'lg';
    return paddingMap[key] || 24;
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AuthGuard>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />

        <Layout style={{ background: "#f8fafc", marginLeft: 260 }}>
          <Header style={{ 
          background: "rgb(15, 23, 42)",
          padding: "0 24px",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
          position: "sticky",
          top: 0,
          zIndex: 99,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#ffffff" }}>
            {/* Dashboard Title Removed */}
          </div>

          <Space size={16}>
            <Badge count={3} size="small">
              <Button 
                type="text" 
                icon={<BellOutlined style={{ fontSize: 18, color: "#ffffff" }} />} 
                style={{ 
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              />
            </Badge>

            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Avatar 
                style={{ 
                  backgroundColor: "#667eea", 
                  cursor: "pointer",
                  fontWeight: 600
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ 
          padding: getResponsivePadding(), 
          background: "#f8fafc",
          overflow: "auto"
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  </AuthGuard>
  );
}
