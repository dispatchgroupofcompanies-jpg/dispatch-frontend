"use client";

import { Layout, Menu, Drawer } from "antd";
import {
  CalendarOutlined,
  FileAddOutlined,
  LogoutOutlined,
  CloseOutlined,
  MenuOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const { Sider } = Layout;

export const SIDEBAR_WIDTH = 260;
export const COLLAPSED_WIDTH = 80;

type SidebarProps = {
  isMobile: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const Brand = ({
  compact = false,
  mobile = false,
  onClose,
  onToggleCollapse,
}: {
  compact?: boolean;
  mobile?: boolean;
  onClose?: () => void;
  onToggleCollapse?: () => void;
}) => (
  <div
    onClick={!mobile ? onToggleCollapse : undefined}
    title={!mobile ? (compact ? "Expand Sidebar" : "Collapse Sidebar") : undefined}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "20px 16px",
      borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.6) 0%, rgba(15, 23, 42, 0) 100%)",
      cursor: !mobile ? "pointer" : "default",
      userSelect: "none",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flex: 1,
        minWidth: 0,
        justifyContent: compact && !mobile ? "center" : "flex-start",
      }}
    >
      <div
        style={{
          width: compact ? 44 : 48,
          height: compact ? 44 : 48,
          borderRadius: 10,
          background: "rgba(255, 255, 255, 0.03)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.4)",
          flexShrink: 0,
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <img
          src="/logo.jpeg"
          alt="XCDGOC Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            background: "transparent",
          }}
        />
      </div>

      {(!compact || mobile) && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: compact ? "14px" : "15px",
              fontWeight: 700,
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            XCDGOC PVT LTD
          </div>

          <div
            style={{
              color: "#64748b",
              fontSize: "10px",
              fontWeight: 600,
              marginTop: 2,
              letterSpacing: "0.3px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            COMPLETE DISPATCH SOLUTIONS
          </div>
        </div>
      )}
    </div>

    {mobile && onClose && (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "none",
          color: "#94a3b8",
          width: 32,
          height: 32,
          borderRadius: 8,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
          transition: "all 0.2s ease",
        }}
      >
        <CloseOutlined style={{ fontSize: 16 }} />
      </button>
    )}
  </div>
);

export default function Sidebar({
  isMobile,
  collapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const getSelectedKey = () => {
    switch (pathname) {
      case "/user/createInvoice":
        return "1";
      case "/user/appointment":
        return "2";
      case "/user/loadboard":
        return "3";
      default:
        return "1";
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <FileAddOutlined style={{ fontSize: "16px" }} />,
      label: "CREATE INVOICE",
      path: "/user/createInvoice",
    },
    {
      key: "2",
      icon: <CalendarOutlined style={{ fontSize: "16px" }} />,
      label: "BOOK APPOINTMENT",
      path: "/user/appointment",
    },
    {
      key: "3",
      icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
      label: "3P DISPATCH",
      path: "/user/loadboard",
    },
  ];

  const buildItems = (closeDrawerOnClick: boolean) => [
    ...menuItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: (
        <span style={{ fontWeight: 600, letterSpacing: "0.4px", fontSize: "13px" }}>
          {item.label}
        </span>
      ),
      onClick: () => {
        if (closeDrawerOnClick) setDrawerOpen(false);
        router.push(item.path);
      },
    })),
    {
      key: "logout",
      danger: true,
      icon: <LogoutOutlined style={{ fontSize: "16px" }} />,
      label: (
        <span style={{ fontWeight: 600, letterSpacing: "0.3px", fontSize: "13px" }}>
          LOGOUT
        </span>
      ),
      onClick: () => {
        if (closeDrawerOnClick) setDrawerOpen(false);
        logout();
      },
    },
  ];

  if (isMobile) {
    return (
      <>
        {!drawerOpen && (
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            style={{
              position: "fixed",
              left: 16,
              top: 16,
              zIndex: 1700,
              width: 42,
              height: 42,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0F172A",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: 10,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
            }}
          >
            <MenuOutlined style={{ fontSize: 18, color: "#fff" }} />
          </button>
        )}

        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          closable={false}
          width={280}
          maskClosable
          style={{ zIndex: 1600 }}
          styles={{
            body: { padding: 0, background: "#0F172A" },
            mask: {
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              backdropFilter: "blur(4px)",
            },
          }}
        >
          <div style={{ background: "#0F172A", height: "100vh", display: "flex", flexDirection: "column" }}>
            <Brand compact mobile onClose={() => setDrawerOpen(false)} />
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              inlineIndent={12}
              style={{ background: "transparent", borderRight: 0, padding: "16px 12px 4px 12px" }}
              items={buildItems(true)}
            />
          </div>
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={SIDEBAR_WIDTH}
      collapsedWidth={COLLAPSED_WIDTH}
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
        borderRight: "1px solid rgba(255, 255, 255, 0.04)",
        boxShadow: "6px 0 30px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        transition: "all 0.2s cubic-bezier(0.2, 0, 0, 1)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Brand compact={collapsed} onToggleCollapse={onToggleCollapse} />

        <Menu
          theme="dark"
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={[getSelectedKey()]}
          inlineIndent={12}
          style={{
            background: "transparent",
            borderRight: 0,
            padding: "10px 12px 4px 12px",
          }}
          items={buildItems(false)}
        />
      </div>
    </Sider>
  );
}