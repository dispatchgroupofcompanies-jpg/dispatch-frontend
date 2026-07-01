"use client";

import { useState } from "react";
import { Card, Button, Typography } from "antd";
import CompanyProfileModal from "../../../../modules/company/CompanyProfileModal";

const { Title, Text } = Typography;

export default function CompanyRecordPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const getResponsiveValue = <T,>(obj: Record<string, T>, defaultValue: T): T => {
    if (typeof window === "undefined") return defaultValue;
    const key = window.innerWidth < 640 ? 'xs' : window.innerWidth < 768 ? 'sm' : window.innerWidth < 1024 ? 'md' : 'lg';
    return obj[key] || defaultValue;
  };

  return (
    <div style={{ 
      padding: getResponsiveValue({ xs: "12px", sm: "16px", md: "20px", lg: "24px" }, "24px"), 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc",
      overflow: "auto"
    }}>
      {/* Main Content Area */}
      <Card
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
        }}
        title={
          <div style={{ 
            display: "flex", 
            flexDirection: getResponsiveValue({ xs: "column", sm: "row", md: "row", lg: "row" }, "row"),
            justifyContent: "space-between", 
            alignItems: getResponsiveValue({ xs: "flex-start", sm: "center", md: "center", lg: "center" }, "center"), 
            width: "100%", 
            padding: "8px 0",
            gap: "12px"
          }}>
            <div>
            <Title level={3} style={{ 
                margin: 0, 
                fontSize: getResponsiveValue({ xs: "18px", sm: "20px", md: "24px", lg: "24px" }, "24px"), 
                fontWeight: 700, 
                color: "#0f172a" 
              }}>
                Company Records
              </Title>
              <Text style={{ 
                fontSize: getResponsiveValue({ xs: "11px", sm: "12px", md: "13px", lg: "13px" }, "13px"), 
                color: "#64748b",
                margin: "4px 0 0 0"
              }}>
                Manage your company profile and information
              </Text>
            </div>
            <Button
              type="primary"
              size="middle"
              onClick={showModal}
              style={{
                height: 40,
                padding: "0 20px",
                fontSize: 14,
                fontWeight: 600,
                borderRadius: 6,
              }}
            >
              + Add Company Profile
            </Button>
          </div>
        }
      >
        {/* Placeholder for Company Records List */}
        <div
          style={{
            padding: getResponsiveValue({ xs: "24px 16px", sm: "36px 20px", md: "48px 24px", lg: "48px 24px" }, "48px 24px"),
            textAlign: "center",
            backgroundColor: "#ffffff",
            border: "2px dashed #e2e8f0",
            borderRadius: "12px",
            color: "#94a3b8",
          }}
        >
          <div style={{ 
            fontSize: getResponsiveValue({ xs: "32px", sm: "40px", md: "48px", lg: "48px" }, "48px"), 
            color: "#cbd5e1", 
            marginBottom: getResponsiveValue({ xs: "8px", sm: "12px", md: "16px", lg: "16px" }, "16px") 
          }}>
            🏢
          </div>
          <h3 style={{ 
            fontSize: getResponsiveValue({ xs: "14px", sm: "15px", md: "16px", lg: "16px" }, "16px"), 
            fontWeight: 600, 
            color: "#475569", 
            margin: "0 0 8px 0" 
          }}>
            No Company Profiles Yet
          </h3>
          <p style={{ 
            fontSize: getResponsiveValue({ xs: "11px", sm: "12px", md: "13px", lg: "13px" }, "13px"), 
            color: "#64748b", 
            margin: "0 auto", 
            maxWidth: "100%",
            padding: getResponsiveValue({ xs: "0 8px", sm: "0 12px", md: "0", lg: "0" }, "0"),
            lineHeight: "1.6" 
          }}>
            Click the "Add Company Profile" button to create your first company profile and manage your business information.
          </p>
        </div>
      </Card>

      <CompanyProfileModal open={isModalOpen} onClose={handleClose} />
    </div>
  );
}
