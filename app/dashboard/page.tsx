"use client";

import React from "react";
import { Card, Button, Breadcrumb, Space } from "antd";
import { ArrowLeftOutlined, FileAddOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function CreateInvoicePage() {
  const router = useRouter();

  return (
    <div style={{ padding: "24px", minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      
      {/* Navigation Path Indicator */}
      <Breadcrumb
        style={{ marginBottom: "16px" }}
        items={[
          { title: "Home" },
          { title: "Dashboard", href: "/dashboard" },
          { title: "Create Invoice" },
        ]}
      />

      {/* Main Content Area */}
      <Card
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
        }}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "8px 0" }}>
            <Space size="middle">
              <Button 
                type="text" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => router.push("/dashboard")}
                style={{ fontSize: "16px" }}
              />
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#0f172a" }}>
                  Create New Statement
                </h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", fontWeight: 400, color: "#64748b" }}>
                  Set up a new dispatch transaction record, assign routing, and process breakdown details.
                </p>
              </div>
            </Space>
          </div>
        }
      >
        {/* Placeholder for Form Template Section */}
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            border: "2px dashed #e2e8f0",
            borderRadius: "12px",
            color: "#94a3b8",
          }}
        >
          <FileAddOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#475569", margin: "0 0 8px 0" }}>
            Invoice Generation Pipeline Blueprint
          </h3>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 auto", maxWidth: "420px", lineHeight: "1.6" }}>
            This workspace will house the custom multi-trip selector configuration layout. You can bind driver details, custom tracking IDs, and routing profiles here.
          </p>
        </div>
      </Card>
    </div>
  );
}