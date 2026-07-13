"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoutOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons";
import { message } from "antd";

interface UserHeaderProps {
  isMobile: boolean;
  onMenuClick?: () => void;
}

export default function UserHeader({ isMobile, onMenuClick }: UserHeaderProps) {
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    message.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div
      style={{
        height: 64,
        background: "linear-gradient(135deg, #0F172A 0%, #1e293b 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 999,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      {/* Left Section - Menu Toggle and Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {isMobile && (
          <button
            onClick={onMenuClick}
            style={{
              background: "rgba(255,255,255,0.05)",
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
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            <MenuOutlined />
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "rgba(255,255,255,0.1)",
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
            Dispatch Portal
          </h2>
        </div>
      </div>

      {/* Right Section - Profile and Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Profile Icon with Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            style={{
              background: "rgba(255,255,255,0.05)",
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
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
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
                    User Profile
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginTop: 2,
                    }}
                  >
                    user@dispatch.com
                  </div>
                </div>
                <div
                  onClick={handleLogout}
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

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#fca5a5",
            cursor: "pointer",
            fontSize: 14,
            fontWeight: 500,
            padding: "6px 16px",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.25)";
            e.currentTarget.style.color = "#fef2f2";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)";
            e.currentTarget.style.color = "#fca5a5";
          }}
        >
          <LogoutOutlined style={{ fontSize: 14 }} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
