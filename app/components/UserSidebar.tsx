"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  FileAddOutlined,
  CalendarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Drawer } from "antd";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";

interface UserSidebarProps {
  isMobile: boolean;
  onClose?: () => void;
}

export const USER_SIDEBAR_WIDTH = 260;

export default function UserSidebar({ isMobile, onClose }: UserSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const getSelectedKey = () => {
    switch (pathname) {
      case "/user/loadboard":
        return "1";
      default:
        return "1";
    }
  };

  const menuItems = [
    {
      key: "1",
      icon: <FileTextOutlined style={{ fontSize: "16px" }} />,
      label: "3P DISPATCH",
      path: "/user/loadboard",
    },
  ];

  const handleClick = (path: string) => {
    if (isMobile && onClose) {
      onClose();
    }
    router.push(path);
  };

  // Mobile Drawer
  if (isMobile) {
    return (
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
        <div
          style={{
            background: "#0F172A",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header with Logo and Close Button */}
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 64,
            }}
          >
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
                  fontSize: 16,
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.3px",
                }}
              >
                Dispatch Portal
              </h2>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
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
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
            >
              <CloseOutlined style={{ fontSize: 16 }} />
            </button>
          </div>

          {/* Navigation Links */}
          <div
            style={{
              padding: "16px 12px",
              flex: 1,
              overflowY: "auto",
            }}
          >
            {menuItems.map((item) => (
              <div
                key={item.key}
                onClick={() => handleClick(item.path)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  backgroundColor:
                    getSelectedKey() === item.key
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderRadius: 8,
                  marginBottom: 6,
                  transition: "all 0.2s",
                  borderLeft:
                    getSelectedKey() === item.key
                      ? "3px solid #60a5fa"
                      : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (getSelectedKey() !== item.key) {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (getSelectedKey() !== item.key) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                {item.icon}
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
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    );
  }

  // Desktop Sidebar
  return (
    <div
      style={{
        width: USER_SIDEBAR_WIDTH,
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
      }}
    >
      {/* Logo Section */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          minHeight: 64,
        }}
      >
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
            fontSize: 16,
            fontWeight: 700,
            color: "white",
            letterSpacing: "-0.3px",
          }}
        >
          Dispatch Portal
        </h2>
      </div>

      {/* Navigation Links */}
      <div
        style={{
          padding: "16px 12px",
          flex: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {menuItems.map((item) => (
          <div
            key={item.key}
            onClick={() => handleClick(item.path)}
            style={{
              padding: "14px 16px",
              cursor: "pointer",
              backgroundColor:
                getSelectedKey() === item.key
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
              display: "flex",
              alignItems: "center",
              gap: 14,
              borderRadius: 8,
              marginBottom: 6,
              transition: "all 0.2s",
              borderLeft:
                getSelectedKey() === item.key
                  ? "3px solid #60a5fa"
                  : "3px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (getSelectedKey() !== item.key) {
                e.currentTarget.style.backgroundColor =
                  "rgba(255,255,255,0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (getSelectedKey() !== item.key) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            {item.icon}
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
          </div>
        ))}
      </div>
    </div>
  );
}
