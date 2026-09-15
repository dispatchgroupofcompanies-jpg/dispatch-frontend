"use client";

import SessionLoader from "@/src/components/auth/SessionLoader";

import { useState, useEffect } from "react";
import { Drawer, Button, message } from "antd";
import { useRouter, usePathname } from "next/navigation";
import { MenuOutlined } from "@ant-design/icons";
import AdminSidebar from "@/src/components/layout/AdminSidebar";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import styles from "@/src/components/layout/Workspace.module.css";
import { getSession, signOut } from "../../src/services/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useMediaQuery("(max-width: 991px)");
  const [drawerPath, setDrawerPath] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const drawerOpen = drawerPath === pathname;
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;
    getSession().then((user) => {
      if (!active) return;
      if (!user) router.replace("/login");
      else if (user.role !== "admin") router.replace("/user/loadboard");
      else setAuthorized(true);
    });

    // Responsive Handlers
    const checkResponsive = () => {


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
      active = false;
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    try {
      await signOut();
      message.success("Logged out successfully");
      router.replace("/login");
    } catch {
      message.error("Could not sign out. Please try again.");
    }
  };

  const handleSidebarLogout = () => {
    handleLogout();
    if (isMobile) {
      setDrawerPath(null);
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

  if (!authorized) return <SessionLoader />;

  return (
    <div
      className={styles.workspace}
      style={{
        display: "flex",
        minHeight: "100vh",
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
      {isMobile && !drawerOpen && (
        <Button
          type="text"
          aria-label="Open navigation"
          aria-expanded={drawerOpen}
          onClick={() => setDrawerPath(drawerOpen ? null : pathname)}
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
        className={`main-content-wrapper ${styles.adminMain}`}
        style={{
          marginLeft: isMobile ? 0 : sidebarCollapsed ? 80 : 260,
          flex: 1,
          overflowX: "hidden",
          overflowY: "auto",
          height: "100svh",
          minWidth: 0,
        }}
      >
        {children}
      </div>

      {/* Mobile Drawer */}
      <Drawer
        placement="left"
        onClose={() => setDrawerPath(null)}
        open={drawerOpen}
        styles={{
          body: {
            padding: 0,
            margin: 0,
            background: "#14233f",
            overflow: "hidden",
          },
          mask: { backgroundColor: "rgba(0,0,0,0.5)" },
        }}
        width="min(260px, 100vw)"
        closable={false}
        maskClosable
        style={{ zIndex: 1600 }}
      >
        <AdminSidebar
          collapsed={false}
          isMobile={true}
          onClose={() => setDrawerPath(null)}
          onLogout={handleSidebarLogout}
          // onToggleCollapse is not needed for mobile drawer
        />
      </Drawer>
    </div>
  );
}
