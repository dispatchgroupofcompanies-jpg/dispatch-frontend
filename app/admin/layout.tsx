"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer, Button } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
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
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 992 : true,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
    const check = () =>
      setIsMobile(
        typeof window !== "undefined" ? window.innerWidth < 992 : false,
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [router, pathname]);

  // Close drawer when route changes
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      setDrawerOpen(false);
      previousPathnameRef.current = pathname;
    }
  }, [pathname]);

  const getResponsivePadding = (): number => {
    if (typeof window === "undefined") return 12;
    if (window.innerWidth < 640) return 12;
    if (window.innerWidth < 768) return 16;
    if (window.innerWidth < 1024) return 20;
    return 24;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    message.success("Logged out successfully");
    router.push("/login");
  };

  const isActive = (path: string) => pathname === path;

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
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          style={{
            width: sidebarCollapsed ? 80 : 260,
            background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
            color: "white",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "fixed",
            height: "100vh",
            zIndex: 1000,
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              padding: "24px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 80,
            }}
          >
            {!sidebarCollapsed && (
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
                  Admin Panel
                </h2>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "white",
                cursor: "pointer",
                fontSize: 16,
                width: 32,
                height: 32,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
          </div>

          {/* Navigation Links */}
          <div style={{ padding: "16px 12px", flex: 1 }}>
            <div
              onClick={() => router.push("/admin/dashboard")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/dashboard")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/dashboard")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/dashboard")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/dashboard")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <DashboardOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Dashboard
                </span>
              )}
            </div>

            <div
              onClick={() => router.push("/admin/invoices")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/invoices")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/invoices")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/invoices")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/invoices")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <FileTextOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Invoice Approval
                </span>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <div
            style={{
              padding: "16px 12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              onClick={handleLogout}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LogoutOutlined style={{ fontSize: 18, color: "#fca5a5" }} />
              {!sidebarCollapsed && (
                <span
                  style={{ fontSize: 14, fontWeight: 500, color: "#fca5a5" }}
                >
                  Logout
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      {isMobile && (
        <Button
          type="text"
          onClick={() => setDrawerOpen(true)}
          style={{
            position: "fixed",
            left: 12,
            top: 12,
            zIndex: 1500,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={<MenuOutlined style={{ fontSize: 20, color: "#1e293b" }} />}
        />
      )}

      {/* Main Content Area */}
      <div
        style={{
          marginLeft:
            typeof window === "undefined"
              ? 0
              : isMobile
                ? 0
                : sidebarCollapsed
                  ? 80
                  : 260,
          flex: 1,
          transition: "margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          padding: getResponsivePadding(),
          overflow: "auto",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{
          body: { padding: 0 },
          mask: { backgroundColor: "rgba(0,0,0,0.5)" },
        }}
        size={280}
        maskClosable
        style={{ zIndex: 1600 }}
      >
        <div
          style={{
            width: 260,
            background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
            height: "100vh",
            color: "white",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: 24,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                Admin Panel
              </h2>
            </div>
            <button
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                fontSize: 18,
                cursor: "pointer",
                padding: 6,
                borderRadius: 6,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CloseOutlined />
            </button>
          </div>

          {/* Drawer Navigation */}
          <div style={{ padding: "16px 12px", flex: 1 }}>
            <div
              onClick={() => {
                setDrawerOpen(false);
                router.push("/admin/dashboard");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/dashboard")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/dashboard")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <DashboardOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Dashboard</span>
            </div>

            <div
              onClick={() => {
                setDrawerOpen(false);
                router.push("/admin/invoices");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/invoices")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/invoices")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <FileTextOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Invoice Approval
              </span>
            </div>
          </div>

          {/* Drawer Logout */}
          <div
            style={{
              padding: "16px 12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              onClick={() => {
                setDrawerOpen(false);
                handleLogout();
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.25)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <LogoutOutlined style={{ fontSize: 18, color: "#fca5a5" }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: "#fca5a5" }}>
                Logout
              </span>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
