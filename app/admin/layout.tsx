"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { useRouter, usePathname } from "next/navigation";
import {
  MenuOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  GlobalOutlined,
  LockOutlined,
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
    if (!token && pathname !== "/login") {
      router.push("/login");
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
        overflow: "hidden",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar,
        .ant-drawer-body::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .no-scrollbar,
        .ant-drawer-body {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
      `,
        }}
      />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          style={{
            width: sidebarCollapsed ? 80 : 260,
            background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
            color: "white",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1000,
            boxShadow: "2px 0 8px rgba(0,0,0,0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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
              flexShrink: 0,
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
                  Dispatch Admin
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
                marginLeft: sidebarCollapsed ? "auto" : "0px",
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

          {/* Navigation Links - Scrollable container */}
          <div
            className="no-scrollbar"
            style={{
              padding: "16px 12px",
              flex: 1,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
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
              onClick={() => router.push("/admin/apointments")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/apointments")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/apointments")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/apointments")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/apointments")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <CalendarOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Appointment Records
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

            <div
              onClick={() => router.push("/admin/users")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/users")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/users")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/users")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/users")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <UserOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Add Users
                </span>
              )}
            </div>

            <div
              onClick={() => router.push("/admin/company-record")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/company-record")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/company-record")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/company-record")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/company-record")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <GlobalOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Company Records
                </span>
              )}
            </div>

            <div
              onClick={() => router.push("/admin/company-history")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/company-history")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/company-history")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/company-history")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/company-history")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <FileTextOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Invoice History
                </span>
              )}
            </div>

            <div
              onClick={() => router.push("/admin/reset-password")}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/reset-password")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/reset-password")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isActive("/admin/reset-password")) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive("/admin/reset-password")) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <LockOutlined style={{ fontSize: 18, color: "#fff" }} />
              {!sidebarCollapsed && (
                <span style={{ fontSize: 14, fontWeight: 500, color: "#fff" }}>
                  Reset Password
                </span>
              )}
            </div>
          </div>

          {/* Logout Button - Permanently fixed at footer */}
          <div
            style={{
              padding: "16px 12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
              backgroundColor: "transparent",
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
          onClick={() => setDrawerOpen(!drawerOpen)}
          style={{
            position: "fixed",
            left: 12,
            top: 10,
            zIndex: 1500,
            background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            width: 44,
            height: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          icon={<MenuOutlined style={{ fontSize: 20, color: "#ffffff" }} />}
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
          paddingTop: isMobile ? 68 : getResponsivePadding(),
          overflowX: "hidden",
          overflowY: "auto",
          height: "100vh",
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
          body: {
            padding: 0,
            margin: 0,
            background: "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",
          },
          mask: { backgroundColor: "rgba(0,0,0,0.5)" },
        }}
        width={260}
        closable={false}
        maskClosable
        style={{ zIndex: 1600 }}
      >
        <div
          style={{
            width: "100%",
            height: "100vh",
            color: "white",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Logo Section */}
          <div
            style={{
              padding: "14px 20px",
              height: "64px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                opacity: 0.9,
              }}
            >
              Admin Panel
            </span>
          </div>

          {/* Drawer Navigation - Scrollable Area */}
          <div
            className="no-scrollbar"
            style={{
              padding: "16px 12px",
              flex: 1,
              overflowY: "auto",
              WebkitOverflowScrolling: "touch",
            }}
          >
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
                router.push("/admin/apointments");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/apointments")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/apointments")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <CalendarOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Appointment Records
              </span>
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

            <div
              onClick={() => {
                setDrawerOpen(false);
                router.push("/admin/users");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/users")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/users")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <UserOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>Add Users</span>
            </div>

            <div
              onClick={() => {
                setDrawerOpen(false);
                router.push("/admin/company-record");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/company-record")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/company-record")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <GlobalOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Company Records
              </span>
            </div>

            <div
              onClick={() => {
                setDrawerOpen(false);
                router.push("/admin/company-history");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/company-history")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/company-history")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <FileTextOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Invoice History
              </span>
            </div>

            <div
              onClick={() => {
                setDrawerOpen(false);
                router.push("/admin/reset-password");
              }}
              style={{
                padding: "14px 16px",
                cursor: "pointer",
                backgroundColor: isActive("/admin/reset-password")
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                display: "flex",
                alignItems: "center",
                gap: 14,
                borderRadius: 8,
                marginBottom: 6,
                transition: "all 0.2s",
                borderLeft: isActive("/admin/reset-password")
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
              }}
            >
              <LockOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>
                Reset Password
              </span>
            </div>
          </div>

          {/* Drawer Logout Zone - Anchored at the absolute bottom */}
          <div
            style={{
              padding: "16px 12px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              flexShrink: 0,
              backgroundColor: "transparent",
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
