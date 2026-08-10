"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { MenuOutlined } from "@ant-design/icons";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 992 : true
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    // Basic Auth Check
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/admin/login") {
      router.push("/admin/login");
    }

    // Responsive Handlers
    const checkResponsive = () => {
      const mobile = window.innerWidth < 992;
      setIsMobile(mobile);
      // Auto-collapse sidebar if screen gets small, but not yet mobile
      if (window.innerWidth < 1200 && window.innerWidth >= 992) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1200) {
        setSidebarCollapsed(false);
      }
    };

    // Initial check
    if (typeof window !== "undefined") {
      checkResponsive();
      window.addEventListener("resize", checkResponsive);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", checkResponsive);
      }
    };
  }, [router, pathname]);

  // Close drawer when route changes on mobile
  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      if (isMobile) {
        setDrawerOpen(false);
      }
      previousPathnameRef.current = pathname;
    }
  }, [pathname, isMobile]);

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

  const handleSidebarLogout = () => {
    handleLogout();
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  // 🔥 NEW: Function to toggle sidebar on desktop
  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // bypass layout for login page
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
      {/* Global Style Overrides for scrollbars */}
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
        /* Smooth transition for main content margin */
        .main-content-wrapper {
          transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s ease;
        }
      `,
        }}
      />

      {/* Desktop Sidebar */}
      {!isMobile && (
        <AdminSidebar
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          onLogout={handleSidebarLogout}
          onToggleCollapse={handleToggleSidebar} // 🔥 Passing the toggle function here
        />
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
        className="main-content-wrapper"
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 80 : 260,
          flex: 1,
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
            overflow: "hidden",
          },
          mask: { backgroundColor: "rgba(0,0,0,0.5)" },
        }}
        width={260}
        closable={false}
        maskClosable
        style={{ zIndex: 1600 }}
      >
        <AdminSidebar
          collapsed={false}
          isMobile={true}
          onClose={() => setDrawerOpen(false)}
          onLogout={handleSidebarLogout}
          // onToggleCollapse is not needed for mobile drawer
        />
      </Drawer>
    </div>
  );
}