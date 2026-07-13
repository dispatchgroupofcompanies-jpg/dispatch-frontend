"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { message } from "antd";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  isMobile: boolean;
  onMenuClick?: () => void;
}

export default function AdminHeader({
  sidebarCollapsed,
  onToggleSidebar,
  isMobile,
  onMenuClick,
}: AdminHeaderProps) {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    message.success("Logged out successfully");
    router.push("/login");
  };

  const handleProfileLogout = () => {
    handleLogout();
  };

  return (
    <div
      style={{
        height: 64,
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        borderRadius: 8,
        marginBottom: 16,
        flexShrink: 0,
      }}
    >
      {/* Left Section - Menu Toggle and Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <button
          onClick={isMobile ? onMenuClick : onToggleSidebar}
          style={{
            background: "rgba(255,255,255,0.1)",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: 18,
            width: 36,
            height: 36,
            borderRadius: 8,
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
          {isMobile ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          ) : sidebarCollapsed ? (
            <MenuUnfoldOutlined />
          ) : (
            <MenuFoldOutlined />
          )}
        </button>

        {isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
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
      </div>

      {/* Right Section - Profile */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Profile Icon with Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: 18,
              width: 36,
              height: 36,
              borderRadius: 8,
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
            <UserOutlined />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 998,
                }}
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div
                style={{
                  position: "absolute",
                  top: 44,
                  right: 0,
                  background: "white",
                  borderRadius: 8,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  minWidth: 180,
                  zIndex: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid #f0f0f0",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      color: "#1e293b",
                      fontSize: 14,
                    }}
                  >
                    Admin User
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginTop: 2,
                    }}
                  >
                    admin@dispatch.com
                  </div>
                </div>
                <div
                  onClick={handleProfileLogout}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#ef4444",
                    fontSize: 14,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fef2f2")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <LogoutOutlined style={{ fontSize: 14 }} />
                  <span style={{ fontWeight: 500 }}>Logout</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
