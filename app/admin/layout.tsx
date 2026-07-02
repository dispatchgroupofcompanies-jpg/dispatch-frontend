"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { message } from "antd";
import {
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [router, pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    message.success("Logged out successfully");
    router.push("/admin/login");
  };

  const isActive = (path: string) => pathname === path;

  // Agar admin login page hai, toh bina sidebar ke direct render karein
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* SINGLE SIDEBAR IMPLEMENTATION */}
      <div
        style={{
          width: sidebarCollapsed ? 80 : 260,
          background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
          color: "white",
          transition: "width 0.3s",
          position: "fixed",
          height: "100vh",
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {!sidebarCollapsed && (
            <h2
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: "white",
              }}
            >
              Admin Panel
            </h2>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Links Navigation */}
        <div style={{ padding: "20px 0" }}>
          <div
            onClick={() => router.push("/admin/dashboard")}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              backgroundColor: isActive("/admin/dashboard")
                ? "rgba(255,255,255,0.15)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderLeft: isActive("/admin/dashboard")
                ? "3px solid white"
                : "3px solid transparent",
            }}
          >
            <DashboardOutlined style={{ fontSize: 18 }} />
            {!sidebarCollapsed && <span>Dashboard</span>}
          </div>

          <div
            onClick={() => router.push("/admin/invoices")}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              backgroundColor: isActive("/admin/invoices")
                ? "rgba(255,255,255,0.15)"
                : "transparent",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderLeft: isActive("/admin/invoices")
                ? "3px solid white"
                : "3px solid transparent",
            }}
          >
            <FileTextOutlined style={{ fontSize: 18 }} />
            {!sidebarCollapsed && <span>Invoice Approval</span>}
          </div>
        </div>

        {/* Logout Button */}
        <div
          style={{
            position: "absolute",
            bottom: 20,
            width: "100%",
            padding: "0 20px",
          }}
        >
          <div
            onClick={handleLogout}
            style={{
              padding: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderRadius: 8,
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <LogoutOutlined style={{ fontSize: 18 }} />
            {!sidebarCollapsed && <span>Logout</span>}
          </div>
        </div>
      </div>

      <div
        style={{
          marginLeft: sidebarCollapsed ? 80 : 260,
          flex: 1,
          transition: "margin-left 0.3s",
        }}
      >
        {children}{" "}
        {/* 👈 Yahan aapka bina-sidebar wala cleaner page render hoga */}
      </div>
    </div>
  );
}
