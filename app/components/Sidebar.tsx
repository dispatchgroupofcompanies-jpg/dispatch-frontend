"use client";

import { Layout, Menu, Drawer } from "antd";
import {
  CalendarOutlined,
  FileAddOutlined,
  LogoutOutlined,
  TruckOutlined,
  CloseOutlined,
  MenuOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

const { Sider } = Layout;

// Exported so AppShell can use the exact same value for content offset
export const SIDEBAR_WIDTH = 260;

type SidebarProps = {
  isMobile: boolean;
};

export default function Sidebar({ isMobile }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
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
      icon: <FileAddOutlined />,
      label: "CREATE INVOICE",
      path: "/user/createInvoice",
    },
    {
      key: "2",
      icon: <CalendarOutlined />,
      label: "BOOK APPOINTMENT",
      path: "/user/appointment",
    },
    {
      key: "3",
      icon: <FileTextOutlined />,
      label: "3P DISPATCH",
      path: "/user/loadboard",
    },
  ];

  const buildItems = (closeDrawerOnClick: boolean) =>
    menuItems.map((item) => ({
      key: item.key,
      icon: item.icon,
      label: item.label,
      onClick: () => {
        if (closeDrawerOnClick) setDrawerOpen(false);
        router.push(item.path);
      },
    }));

  const Brand = ({
    compact = false,
    mobile = false,
  }: {
    compact?: boolean;
    mobile?: boolean;
  }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 16px",
        borderBottom: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: compact ? 42 : 52,
            height: compact ? 42 : 52,
            borderRadius: compact ? 10 : 14,
            background: "linear-gradient(135deg,#1677ff 0%,#69b1ff 100%)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxShadow: "0 10px 20px rgba(22,119,255,.35)",
            flexShrink: 0,
          }}
        >
          <TruckOutlined
            style={{
              color: "#fff",
              fontSize: compact ? 20 : 26,
            }}
          />
        </div>

        <div>
          <div
            style={{
              color: "#fff",
              fontSize: compact ? 16 : 19,
              fontWeight: 700,
            }}
          >
            Extreme Dispatch
          </div>

          <div
            style={{
              color: "#94A3B8",
              fontSize: compact ? 11 : 12,
              marginTop: 2,
            }}
          >
            Dispatch Management
          </div>
        </div>
      </div>

      {mobile && (
        <button
          onClick={() => setDrawerOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CloseOutlined style={{ fontSize: 22 }} />
        </button>
      )}
    </div>
  );

  const LogoutMenu = ({ onLogout }: { onLogout: () => void }) => (
    <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,.08)" }}>
      <Menu
        theme="dark"
        mode="inline"
        selectable={false}
        style={{ background: "#0F172A", border: 0 }}
        items={[
          {
            key: "logout",
            danger: true,
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: onLogout,
          },
        ]}
      />
    </div>
  );

  if (isMobile) {
    return (
      <>
        {!drawerOpen && (
          <button
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            style={{
              position: "fixed",
              left: 12,
              top: 12,
              zIndex: 1700,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#0F172A",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            <MenuOutlined style={{ fontSize: 20, color: "#fff" }} />
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
            body: {
              padding: 0,
              background: "#0F172A",
            },
            mask: {
              backgroundColor: "rgba(0,0,0,0.45)",
            },
          }}
        >
          <div
            style={{
              background: "#0F172A",
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
              }}
            >
              <Brand compact />

              <button
                aria-label="Close menu"
                onClick={() => setDrawerOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                <CloseOutlined style={{ fontSize: 20 }} />
              </button>
            </div>

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
              }}
              items={buildItems(true)}
            />

            <LogoutMenu
              onLogout={() => {
                setDrawerOpen(false);
                logout();
              }}
            />
          </div>
        </Drawer>
      </>
    );
  }

  return (
    <Sider
      width={SIDEBAR_WIDTH}
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
      <Brand />

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
        items={buildItems(false)}
      />

      <LogoutMenu onLogout={logout} />
    </Sider>
  );
}
