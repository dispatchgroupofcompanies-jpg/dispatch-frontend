"use client";

import { Layout } from "antd";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <Content style={{ 
          padding: { xs: 12, sm: 16, md: 20, lg: 24 }[window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : window.innerWidth < 1024 ? 'md' : 'lg'] || 20, 
          background: "#f5f5f5",
          overflow: "auto"
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}