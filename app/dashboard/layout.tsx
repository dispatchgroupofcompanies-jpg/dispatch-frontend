"use client";

import { Layout } from "antd";
import Sidebar from "../components/Sidebar";

const { Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />

      <Layout>
        <Content style={{ padding: 20, background: "#f5f5f5" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}