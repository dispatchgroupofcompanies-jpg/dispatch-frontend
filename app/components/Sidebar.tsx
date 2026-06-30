"use client";

import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  FileAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Dynamic route tracker to ensure the correct tab stays active on page refresh/navigation
  const getSelectedKey = () => {
    if (pathname === "/dashboard") return "1";
    if (pathname === "/dashboard/createInvoice") return "2";
    return "1";
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="md"
      style={{
        background: "#0f172a",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar Header Logo */}
      <div
        style={{
          color: "white",
          padding: "16px",
          fontSize: "18px",
          textAlign: "center",
          fontWeight: "bold",
          borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
          marginBottom: "8px",
        }}
      >
        {collapsed ? "DA" : "Dispatch App"}
      </div>

      {/* Main Navigation Menu Container with Integrated Logout */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{ background: "#0f172a", borderRight: 0 }}
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: "Dashboard",
            onClick: () => router.push("/dashboard"),
          },
          {
            key: "2",
            icon: <FileAddOutlined />,
            label: "Create Invoice",
            onClick: () => router.push("/dashboard/createInvoice"),
          },
          {
            key: "3",
            icon: <LogoutOutlined />,
            label: "Logout",
            danger: true, // Auto styling apply karega Ant Design red alert ke liye
            onClick: logout,
          },
        ]}
      />
    </Sider>
  );
}