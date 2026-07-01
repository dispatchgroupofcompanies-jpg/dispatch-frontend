"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Button, Typography, Popconfirm, Spin, Space, message, Modal, Descriptions } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, GlobalOutlined } from "@ant-design/icons";
import CompanyProfileModal from "../../../modules/company/CompanyProfileModal";
import { getCompanyProfile, deleteCompanyProfile } from "../../../modules/company/route";

const { Title, Text } = Typography;

export default function CompanyRecordPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  const isMounted = useRef(false);

  // 🔄 1. FETCH DATA (GET ACTION)
  const loadProfileData = async (shouldShowSpinner = false) => {
    try {
      if (shouldShowSpinner) {
        setLoading(true);
      }
      const result = await getCompanyProfile();
      if (result.success && result.data && Object.keys(result.data).length > 0) {
        setProfileData(result.data);
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load company profile context layer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    loadProfileData(true); 

    return () => {
      isMounted.current = false;
    };
  }, []);

  // 🗑️ 2. DELETE ACTION HANDLER
  const handleDelete = async () => {
    try {
      setLoading(true);
      const result = await deleteCompanyProfile();
      if (result.success) {
        message.success("Company profile configurations cleared successfully!");
        setProfileData(null);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to delete company profile");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    loadProfileData(true);
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
      
      {/* ================= MAIN CONFIGURATION CARD ================= */}
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

            {!profileData && !loading && (
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
                  backgroundColor: "#1e3a8a",
                  borderColor: "#1e3a8a"
                }}
              >
                + Add Company Profile
              </Button>
            )}
          </div>
        }
      >
        {/* LOADING PROCESSING INDICATOR */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" tip="Fetching system configurations..." />
          </div>
        ) : profileData ? (
          
          /* 📊 3. DATA DISCOVERED STATE (GRID BLOCKS COMPLETELY REMOVED FROM HERE) */
          <Card 
            type="inner"
            title={
              <Space><GlobalOutlined style={{ color: "#1e3a8a" }} /> <span style={{ fontWeight: 600, color: "#1e293b" }}>{profileData.companyName}</span></Space>
            }
            extra={
              <Space size="middle">
                {/* VIEW BUTTON */}
                <Button type="text" icon={<EyeOutlined style={{ color: "#0284c7" }} />} onClick={() => setIsViewModalOpen(true)}>
                  View
                </Button>
                
                {/* EDIT BUTTON */}
                <Button type="text" icon={<EditOutlined style={{ color: "#ea580c" }} />} onClick={showModal}>
                  Edit
                </Button>

                {/* POPCONFIRM DELETE */}
                <Popconfirm
                  title="Are you absolutely sure?"
                  description="This will permanently delete the config setup profile."
                  onConfirm={handleDelete}
                  okText="Yes, Delete"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Button type="text" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            }
            style={{ borderRadius: "12px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" }}
          >
            
          </Card>

        ) : (
          
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
            <div style={{ fontSize: getResponsiveValue({ xs: "32px", sm: "40px", md: "48px", lg: "48px" }, "48px"), marginBottom: "16px" }}>🏢</div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#475569", margin: "0 0 8px 0" }}>No Company Profiles Detected</h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 auto", maxWidth: "450px", lineHeight: "1.6" }}>
              Please click the "+ Add Company Profile" button above to initiate your first baseline system configuration data setup.
            </p>
          </div>
        )}
      </Card>

      {/* 🛠️ 4. EDIT / CREATE FORM MODAL */}
      <CompanyProfileModal open={isModalOpen} onClose={handleClose} initialData={profileData} />

      {/* 👁️ 5. PURE PREMIUM VIEW MODAL (ALL DETAILS SAVED HERE SAFE & PROPER) */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
            <span style={{ fontSize: "20px" }}>📋</span>
            <div>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#0f172a" }}>
                Company Profile Summary View
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontWeight: 400 }}>
                Full administrative configs dashboard details
              </p>
            </div>
          </div>
        }
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button 
            key="close" 
            type="primary" 
            onClick={() => setIsViewModalOpen(false)} 
            style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a", borderRadius: "6px", fontWeight: 600, padding: "0 20px", height: "38px" }}
          >
            Close View
          </Button>
        ]}
        width={750}
        centered
        styles={{ body: { padding: "20px 24px" } }}
      >
        {profileData && (
          <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
            
            {/* CORE IDENTITY CATEGORY */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                🏢 Core Identity
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b" }} labelStyle={{ color: "#64748b" }}>
                <Descriptions.Item label="Company Name">{profileData.companyName}</Descriptions.Item>
                <Descriptions.Item label="Carrier Identifier">{profileData.carrierIdentifier}</Descriptions.Item>
                <Descriptions.Item label="NSC Number">{profileData.nsc}</Descriptions.Item>
                <Descriptions.Item label="IFTA Number">{profileData.ifta}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* CONTACT CATEGORY */}
            <div style={{ marginBottom: "24px", paddingTop: "16px", borderTop: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                📞 Contact Details
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b" }} labelStyle={{ color: "#64748b" }}>
                <Descriptions.Item label="Official Email">{profileData.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{profileData.countryCode} {profileData.phone}</Descriptions.Item>
                <Descriptions.Item label="E-Transfer Address" span={2}>{profileData.eTransfer}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* REGULATORY TAX INFORMATION */}
            <div style={{ marginBottom: "24px", paddingTop: "16px", borderTop: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                ⚖️ Taxation & Regulatory
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b" }} labelStyle={{ color: "#64748b" }}>
                <Descriptions.Item label="GST / HST">{profileData.gstHst}</Descriptions.Item>
                <Descriptions.Item label="QST (Quebec)">{profileData.qst || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Province / State">{profileData.province}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* PHYSICAL ADDRESS GEOLOCATION */}
            <div style={{ paddingTop: "16px", borderTop: "1px dashed #e2e8f0" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                📍 Physical Address
              </div>
              <Descriptions column={{ xs: 1, sm: 1 }} layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b" }} labelStyle={{ color: "#64748b" }}>
                <Descriptions.Item label="Address Line 1">{profileData.addressLine1}</Descriptions.Item>
                {profileData.addressLine2 && <Descriptions.Item label="Address Line 2">{profileData.addressLine2}</Descriptions.Item>}
              </Descriptions>
              
              <Descriptions column={{ xs: 1, sm: 2, md: 3 }} layout="horizontal" style={{ marginTop: "8px" }} contentStyle={{ fontWeight: 600, color: "#1e293b" }} labelStyle={{ color: "#64748b" }}>
                <Descriptions.Item label="City">{profileData.city}</Descriptions.Item>
                <Descriptions.Item label="Postal / ZIP">{profileData.postCode}</Descriptions.Item>
                <Descriptions.Item label="Country">{profileData.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States"}</Descriptions.Item>
              </Descriptions>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}