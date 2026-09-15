"use client";

import { useState } from "react";
import { useMediaQuery } from "@/src/hooks/useMediaQuery";
import styles from "./Workspace.module.css";
import Sidebar, { SIDEBAR_WIDTH, COLLAPSED_WIDTH } from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useMediaQuery("(max-width: 991px)");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={styles.workspace}>
      <Sidebar
        isMobile={isMobile}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
      />

      <main
        className={styles.userMain}
        style={{
          // Dynamic marginLeft fix for white space
          marginLeft: isMobile ? 0 : collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
          paddingTop: isMobile ? 56 : 0,
          minHeight: "100svh",
          transition: "margin-left 0.2s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        <div
          style={{
            padding: isMobile ? "12px" : "24px",
            minWidth: 0,
            width: "100%",
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