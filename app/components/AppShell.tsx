"use client";

import { useEffect, useState } from "react";
import Sidebar, { SIDEBAR_WIDTH } from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const check = () => setIsMobile(window.innerWidth < 992);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Avoid a flash of the wrong layout before we know the viewport width.
  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Sidebar isMobile={isMobile} />

      <main
        style={{
          marginLeft: isMobile ? 0 : SIDEBAR_WIDTH,
          paddingTop: isMobile ? 56 : 0,
          minHeight: "100vh",
          transition: "margin-left 0.2s ease",
        }}
      >
        {children}
      </main>
    </div>
  );
}
