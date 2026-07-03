"use client";

import { Layout, Menu, Drawer, Button } from "antd";
import {
  BankOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FileAddOutlined,
  HistoryOutlined,
  LogoutOutlined,
  TruckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useRouter, usePathname } from "next/navigation";
import { MenuOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isClient = useSyncExternalStore(
    (onChange) => {
      window.addEventListener("load", onChange);
      return () => window.removeEventListener("load", onChange);
    },
    () => true,
    () => false,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isClient) {
    return null;
  }

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getSelectedKey = () => {
    switch (pathname) {
      case "/user/dashboard":
        return "1";
      case "/user/createInvoice":
        return "2";
      case "/user/appointment":
        return "3";
      case "/user/company-record":
        return "6";
      case "/user/company-history":
        return "7";
      default:
        return "1";
    }
  };

  return (
    <>
      {isMobile && (
        <Button
          type="text"
          onClick={() => setDrawerOpen(true)}
          style={{
            position: "fixed",
            left: 12,
            top: 12,
            zIndex: 1500,
            background: "transparent",
            border: "none",
            color: "#0f172a",
          }}
          icon={<MenuOutlined style={{ fontSize: 22, color: "#0f172a" }} />}
        />
      )}

      {!isMobile && (
        <Sider
          width={260}
          breakpoint="lg"
          collapsedWidth={0}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "22px 16px",
              borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "linear-gradient(135deg,#1677ff 0%,#69b1ff 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 10px 20px rgba(22,119,255,.35)",
              }}
            >
              <TruckOutlined
                style={{
                  color: "#fff",
                  fontSize: 26,
                }}
              />
            </div>

            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 19,
                  fontWeight: 700,
                }}
              >
                Extreme Dispatch
              </div>

              <div
                style={{
                  color: "#94A3B8",
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                Dispatch Management
              </div>
            </div>
          </div>

          {/* Menu */}
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
            items={[
              {
                key: "1",
                icon: <DashboardOutlined />,
                label: "Dashboard",
                onClick: () => router.push("/user/dashboard"),
              },
              {
                key: "2",
                icon: <FileAddOutlined />,
                label: "Create Invoice",
                onClick: () => router.push("/user/createInvoice"),
              },
              {
                key: "3",
                icon: <CalendarOutlined />,
                label: "Book Appointment",
                onClick: () => router.push("/user/appointment"),
              },
              {
                key: "6",
                icon: <BankOutlined />,
                label: "Company Record",
                onClick: () => router.push("/user/company-record"),
              },
              {
                key: "7",
                icon: <HistoryOutlined />,
                label: "Company History",
                onClick: () => router.push("/user/company-history"),
              },
            ]}
          />

          {/* Logout */}
          <div
            style={{
              padding: 12,
              borderTop: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <Menu
              theme="dark"
              mode="inline"
              selectable={false}
              style={{
                background: "#0F172A",
                border: 0,
              }}
              items={[
                {
                  key: "logout",
                  danger: true,
                  icon: <LogoutOutlined />,
                  label: "Logout",
                  onClick: logout,
                },
              ]}
            />
          </div>
        </Sider>
      )}

      <Drawer
        title={null}
        placement="left"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        styles={{
          body: { padding: 0 },
          mask: { backgroundColor: "rgba(0,0,0,0.45)" },
        }}
        size={280}
        maskClosable
        style={{ zIndex: 1600 }}
      >
        <div style={{ background: "#0F172A", height: "100vh" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "22px 16px",
              borderBottom: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "linear-gradient(135deg,#1677ff 0%,#69b1ff 100%)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "0 10px 20px rgba(22,119,255,.35)",
              }}
            >
              <TruckOutlined style={{ color: "#fff", fontSize: 20 }} />
            </div>

            <div>
              <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
                Extreme Dispatch
              </div>
              <div style={{ color: "#94A3B8", fontSize: 11, marginTop: 2 }}>
                Dispatch Management
              </div>
            </div>

            <button
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
                padding: 6,
              }}
            >
              <CloseOutlined />
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
              height: "calc(100vh - 140px)",
              overflowY: "auto",
            }}
            items={[
              {
                key: "1",
                icon: <DashboardOutlined />,
                label: "Dashboard",
                onClick: () => {
                  setDrawerOpen(false);
                  router.push("/user/dashboard");
                },
              },
              {
                key: "2",
                icon: <FileAddOutlined />,
                label: "Create Invoice",
                onClick: () => {
                  setDrawerOpen(false);
                  router.push("/user/createInvoice");
                },
              },
              {
                key: "3",
                icon: <CalendarOutlined />,
                label: "Book Appointment",
                onClick: () => {
                  setDrawerOpen(false);
                  router.push("/user/appointment");
                },
              },
              {
                key: "6",
                icon: <BankOutlined />,
                label: "Company Record",
                onClick: () => {
                  setDrawerOpen(false);
                  router.push("/user/company-record");
                },
              },
              {
                key: "7",
                icon: <HistoryOutlined />,
                label: "Company History",
                onClick: () => {
                  setDrawerOpen(false);
                  router.push("/user/company-history");
                },
              },
            ]}
          />

          <div
            style={{
              padding: 12,
              borderTop: "1px solid rgba(255,255,255,.08)",
            }}
          >
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
                  onClick: () => {
                    localStorage.removeItem("token");
                    router.push("/login");
                  },
                },
              ]}
            />
          </div>
        </div>
      </Drawer>
    </>
  );
}
