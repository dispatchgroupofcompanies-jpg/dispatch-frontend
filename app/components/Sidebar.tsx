"use client";

import { Layout, Menu } from "antd";
import {
  BankOutlined,
  DashboardOutlined,
  FileAddOutlined,
  HistoryOutlined,
  LogoutOutlined,
  TruckOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getSelectedKey = () => {
    switch (pathname) {
      case "/user/dashboard":
        return "1";
      case "/user/createInvoice":
        return "2";
      case "/user/company-record":
        return "6";
      case "/user/company-history":
        return "7";
      default:
        return "1";
    }
  };

  return (
    <Sider
      width={260}
      breakpoint="lg"
      collapsedWidth={80}
      style={{
        background: "#0F172A",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "4px 0 20px rgba(0,0,0,.15)",
        zIndex: 1000,
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
          padding: "22px 16px",
          borderBottom: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#1677ff 0%,#69b1ff 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 10px 20px rgba(22,119,255,.35)",
          }}
        >
          <TruckOutlined
            style={{
              color: "#fff",
              fontSize: 26,
            }}
          />
        </div>

        <div>
          <div
            style={{
              color: "#fff",
              fontSize: 19,
              fontWeight: 700,
            }}
          >
            Extreme Dispatch
          </div>

          <div
            style={{
              color: "#94A3B8",
              fontSize: 12,
              marginTop: 2,
            }}
          >
            Dispatch Management
          </div>
        </div>
      </div>

      {/* Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{
          background: "#0F172A",
          borderRight: 0,
          padding: "14px 10px",
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.2) transparent",
        }}
        items={[
          {
            key: "1",
            icon: <DashboardOutlined />,
            label: "Dashboard",
            onClick: () => router.push("/user/dashboard"),
          },
          {
            key: "2",
            icon: <FileAddOutlined />,
            label: "Create Invoice",
            onClick: () => router.push("/user/createInvoice"),
          },
          {
            key: "6",
            icon: <BankOutlined />,
            label: "Company Record",
            onClick: () => router.push("/user/company-record"),
          },
          {
            key: "7",
            icon: <HistoryOutlined />,
            label: "Company History",
            onClick: () => router.push("/user/company-history"),
          },
        ]}
      />

      {/* Logout */}
      <div
        style={{
          padding: 12,
          borderTop: "1px solid rgba(255,255,255,.08)",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectable={false}
          style={{
            background: "#0F172A",
            border: 0,
          }}
          items={[
            {
              key: "logout",
              danger: true,
              icon: <LogoutOutlined />,
              label: "Logout",
              onClick: logout,
            },
          ]}
        />
      </div>
    </Sider>
  );
}