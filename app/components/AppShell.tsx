"use client";

import { useEffect, useState } from "react";
import Sidebar, { SIDEBAR_WIDTH, COLLAPSED_WIDTH } from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted] = useState(() => typeof window !== "undefined");
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 992 : false,
  );
  // State for sidebar collapse
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Sidebar
        isMobile={isMobile}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <main
        style={{
          // Dynamic marginLeft fix for white space
          marginLeft: isMobile ? 0 : collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          paddingTop: isMobile ? 56 : 0,
          minHeight: "100vh",
          transition: "margin-left 0.2s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        <div
          style={{
            padding: isMobile ? "12px" : "24px",
            maxWidth: "1600px",
            margin: "0 auto",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}