"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  DashboardOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  GlobalOutlined,
  LockOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

interface AdminSidebarProps {
  collapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
  onLogout?: () => void;
}

export default function AdminSidebar({
  collapsed,
  isMobile,
  onClose,
  onLogout,
}: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      icon: <DashboardOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      icon: <CalendarOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Appointment Records",
      path: "/admin/apointments",
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Invoice Approval",
      path: "/admin/invoices",
    },
    {
      icon: <UserOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Add Users",
      path: "/admin/users",
    },
    {
      icon: <GlobalOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Company Records",
      path: "/admin/company-record",
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Invoice History",
      path: "/admin/company-history",
    },
    {
      icon: <LockOutlined style={{ fontSize: 18, color: "#fff" }} />,
      label: "Reset Password",
      path: "/admin/reset-password",
    },
  ];

  const handleClick = (path: string) => {
    if (isMobile && onClose) {
      onClose();
    }
    router.push(path);
  };

  const handleLogoutClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div
      style={{
        width: isMobile ? 260 : collapsed ? 80 : 260,
        background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
        color: "white",
        height: "100vh",
        position: isMobile ? "absolute" : "fixed",
        top: 0,
        left: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        zIndex: 1000,
        boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 64,
        }}
      >
        {(!collapsed || isMobile) && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                background: "rgba(255,255,255,0.2)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              ⚡
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.3px",
              }}
            >
              Dispatch Admin
            </h2>
          </div>
        )}
        {collapsed && !isMobile && (
          <div
            style={{
              width: 36,
              height: 36,
              background: "rgba(255,255,255,0.2)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              margin: "0 auto",
            }}
          >
            ⚡
          </div>
        )}
      </div>

      {/* Navigation Links including Logout */}
      <div
        style={{
          padding: "16px 12px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => handleClick(item.path)}
            style={{
              padding: "14px 16px",
              cursor: "pointer",
              backgroundColor: isActive(item.path)
                ? "rgba(255,255,255,0.15)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderRadius: 8,
              marginBottom: 6,
              transition: "all 0.2s",
              borderLeft: isActive(item.path)
                ? "3px solid #60a5fa"
                : "3px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {item.icon}
            {(!collapsed || isMobile) && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fff",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            )}
          </div>
        ))}

        {/* Integrated Logout Item */}
        {onLogout && (
          <div
            onClick={handleLogoutClick}
            style={{
              padding: "14px 16px",
              cursor: "pointer",
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderRadius: 8,
              marginBottom: 6,
              marginTop: 12,
              transition: "all 0.2s",
              borderLeft: "3px solid #ef4444",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.15)";
            }}
          >
            <LogoutOutlined style={{ fontSize: 18, color: "#fca5a5" }} />
            {(!collapsed || isMobile) && (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#fca5a5",
                  whiteSpace: "nowrap",
                }}
              >
                Logout
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
