"use client";

import { useState, useEffect, useRef } from "react";
import { Drawer, Button, message } from "antd";
import { useRouter, usePathname } from "next/navigation";
import {
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import AdminSidebar from "../components/AdminSidebar";

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

  const handleSidebarLogout = () => {
    handleLogout();
    if (isMobile) {
      setDrawerOpen(false);
    }
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
        <AdminSidebar
          collapsed={sidebarCollapsed}
          isMobile={isMobile}
          onLogout={handleSidebarLogout}
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
        <AdminSidebar
          collapsed={false}
          isMobile={true}
          onClose={() => setDrawerOpen(false)}
          onLogout={handleSidebarLogout}
        />
      </Drawer>
    </div>
  );
}
