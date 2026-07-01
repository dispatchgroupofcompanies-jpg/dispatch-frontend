"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Button, Typography, Popconfirm, Spin, Space, message, Modal, Descriptions, Tag } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, GlobalOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import CompanyProfileModal from "../../../modules/company/CompanyProfileModal";
import { getCompanyProfile, deleteCompanyProfile } from "../../../modules/company/route";

const { Title, Text } = Typography;

export default function CompanyRecordPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Modal mode state: "add" means fresh clean form, "edit" means with data
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");

  const [paddingValue, setPaddingValue] = useState("24px");
  const [flexDirection, setFlexDirection] = useState<"row" | "column">("row");
  const [isMobile, setIsMobile] = useState(false);

  const isMounted = useRef(false);

  // 🔄 1. DATA FETCH LAYER
  const loadProfileData = async (shouldShowSpinner = false) => {
    try {
      if (shouldShowSpinner) {
        setLoading(true);
      }
      const result = await getCompanyProfile();
      if (result && result.success && result.data && Object.keys(result.data).length > 0 && result.data.companyName) {
        setProfileData(result.data);
      } else {
        setProfileData(null);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load company config metadata.");
      setProfileData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isMounted.current = true;
    loadProfileData(true); 

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPaddingValue(window.innerWidth < 640 ? "12px" : "16px");
        setFlexDirection("column");
        setIsMobile(true);
      } else {
        setPaddingValue(window.innerWidth < 1024 ? "20px" : "24px");
        setFlexDirection("row");
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      isMounted.current = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 🗑️ 2. DELETION HANDLER
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
      message.error("Failed to execute deletion loop.");
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add button click: Opens modal with clean slate
  const handleAddClick = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  // ✏️ Edit button click: Opens modal with existing data
  const handleEditClick = () => {
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    loadProfileData(true); 
  };

  return (
    <div style={{ 
      padding: paddingValue, 
      minHeight: "100vh", 
      backgroundColor: "#f8fafc",
      overflow: "auto"
    }}>
      
      {/* ================= MAIN CONTAINER ================= */}
      <Card
        style={{
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "16px",
          border: "1px solid #e2e8f0"
        }}
        title={
          <div style={{ 
            display: "flex", 
            flexDirection: flexDirection,
            justifyContent: "space-between", 
            alignItems: flexDirection === "column" ? "flex-start" : "center", 
            width: "100%", 
            padding: "4px 0",
            gap: "12px"
          }}>
            <div>
              <Title level={3} style={{ margin: 0, fontSize: isMobile ? "18px" : "20px", fontWeight: 700, color: "#0f172a" }}>
                Company Records
              </Title>
              <Text style={{ fontSize: "13px", color: "#64748b", marginTop: "2px", display: "inline-block" }}>
                Manage baseline enterprise structural identities
              </Text>
            </div>

            {/* 🔴 FIXED RIGHT CORNER BUTTON - OPENS CLEAN FORM */}
            <Button
              type="primary"
              size="middle"
              icon={<PlusOutlined />}
              onClick={handleAddClick}
              style={{
                height: 38,
                padding: "0 18px",
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 8,
                backgroundColor: "#1e3a8a",
                borderColor: "#1e3a8a",
                boxShadow: "0 2px 4px rgba(30, 58, 138, 0.2)"
              }}
            >
              Add Company Profile
            </Button>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            <Spin size="large" tip="Loading configuration states..." />
          </div>
        ) : profileData ? (
          
          /* 📊 3. ULTRA SLEEK SINGLE BAR ROW WITH INDEXING BADGE */
          <div style={{ 
            display: "flex", 
            flexDirection: flexDirection,
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "14px 20px",
            backgroundColor: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
            gap: "12px"
          }}>
            <Space size="middle" style={{ width: flexDirection === "column" ? "100%" : "auto", justifyContent: "flex-start" }}>
              <GlobalOutlined style={{ color: "#1e3a8a", fontSize: "16px" }} />
              <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                {profileData.companyName}
              </span>
            </Space>

            <Space size="small" style={{ width: flexDirection === "column" ? "100%" : "auto", justifyContent: flexDirection === "column" ? "space-between" : "flex-end" }}>
              {/* Dynamic Static Index System Badge */}
              <Tag color="blue" style={{ 
                marginRight: "8px", 
                padding: "2px 8px", 
                fontSize: "11px", 
                fontWeight: 700, 
                borderRadius: "4px",
                backgroundColor: "#eff6ff",
                color: "#1e40af",
                border: "1px solid #bfdbfe"
              }}>
                #01
              </Tag>

              <Button 
                type="text" 
                icon={<EyeOutlined />} 
                onClick={() => setIsViewModalOpen(true)}
                style={{ color: "#2563eb", fontWeight: 600, fontSize: "13px" }}
              >
                View
              </Button>
              
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={handleEditClick}
                style={{ color: "#ea580c", fontWeight: 600, fontSize: "13px" }}
              >
                Edit
              </Button>

              <Popconfirm
                title="Are you absolutely sure?"
                description="This will safely wipe out configuration mappings."
                onConfirm={handleDelete}
                okText="Delete Data"
                cancelText="Keep Data"
                okButtonProps={{ danger: true }}
              >
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />}
                  style={{ fontWeight: 600, fontSize: "13px" }}
                >
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </div>

        ) : (
          
          /* EMPTY FALLBACK CONTAINER STATE */
          <div style={{
            padding: "48px 24px",
            textAlign: "center",
            backgroundColor: "#ffffff",
            border: "2px dashed #e2e8f0",
            borderRadius: "12px",
            color: "#94a3b8"
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏢</div>
            <h3 style={{ fontSize: "15px", fontWeight: 600, color: "#475569", margin: "0 0 4px 0" }}>
              No Company Profile Registered
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 auto", maxWidth: "420px" }}>
              Initialize database variables by clicking the "Add Company Profile" button at the top right corner.
            </p>
          </div>
        )}
      </Card>

      {/* 🛠️ 4. MODAL OVERLAY WITH CONDITIONAL INITIAL DATA PASSING */}
      <CompanyProfileModal 
        open={isModalOpen} 
        onClose={handleClose} 
        initialData={modalMode === "edit" ? profileData : null} 
      />

      {/* 👁️ 5. PREMIUM SUMMARY VIEW MODAL */}
      <Modal
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "12px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ width: "30px", height: "30px", backgroundColor: "#eff6ff", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <InfoCircleOutlined style={{ color: "#2563eb", fontSize: "15px" }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>
                Company Profile Summary View
              </h3>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                Full system dashboard details tracking data
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
            style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a", borderRadius: "6px", fontWeight: 600, padding: "0 18px", height: "36px" }}
          >
            Close View
          </Button>
        ]}
        width={720}
        centered
        styles={{ body: { padding: "20px 24px" } }}
      >
        {profileData && (
          <div style={{ maxHeight: "60vh", overflowY: "auto", paddingRight: "4px" }}>
            
            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e3a8a", marginBottom: "10px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                🏢 Core Identity
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b", backgroundColor: "#fff" }} labelStyle={{ color: "#475569", width: "150px", backgroundColor: "#f8fafc", fontWeight: 500 }}>
                <Descriptions.Item label="Company Name">{profileData.companyName}</Descriptions.Item>
                <Descriptions.Item label="Carrier Identifier">{profileData.carrierIdentifier}</Descriptions.Item>
                <Descriptions.Item label="NSC Number">{profileData.nsc}</Descriptions.Item>
                <Descriptions.Item label="IFTA Number">{profileData.ifta}</Descriptions.Item>
              </Descriptions>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e3a8a", marginBottom: "10px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                📞 Contact Details
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b", backgroundColor: "#fff" }} labelStyle={{ color: "#475569", width: "150px", backgroundColor: "#f8fafc", fontWeight: 500 }}>
                <Descriptions.Item label="Official Email">{profileData.email}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">{profileData.countryCode} {profileData.phone}</Descriptions.Item>
                <Descriptions.Item label="E-Transfer Address" span={2}>{profileData.eTransfer}</Descriptions.Item>
              </Descriptions>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e3a8a", marginBottom: "10px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                ⚖️ Taxation & Regulatory
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b", backgroundColor: "#fff" }} labelStyle={{ color: "#475569", width: "150px", backgroundColor: "#f8fafc", fontWeight: 500 }}>
                <Descriptions.Item label="GST / HST">{profileData.gstHst}</Descriptions.Item>
                <Descriptions.Item label="QST (Quebec)">{profileData.qst || "N/A"}</Descriptions.Item>
                <Descriptions.Item label="Province">{profileData.province}</Descriptions.Item>
              </Descriptions>
            </div>

            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#1e3a8a", marginBottom: "10px", letterSpacing: "0.5px", textTransform: "uppercase" }}>
                📍 Physical Address
              </div>
              <Descriptions column={{ xs: 1, sm: 2 }} bordered size="small" layout="horizontal" contentStyle={{ fontWeight: 600, color: "#1e293b", backgroundColor: "#fff" }} labelStyle={{ color: "#475569", width: "150px", backgroundColor: "#f8fafc", fontWeight: 500 }}>
                <Descriptions.Item label="Address Line 1" span={2}>{profileData.addressLine1}</Descriptions.Item>
                {profileData.addressLine2 && <Descriptions.Item label="Address Line 2" span={2}>{profileData.addressLine2}</Descriptions.Item>}
                <Descriptions.Item label="City">{profileData.city}</Descriptions.Item>
                <Descriptions.Item label="Postal / ZIP">{profileData.postCode}</Descriptions.Item>
                <Descriptions.Item label="Country" span={2}>{profileData.country === "CA" ? "🇨🇦 Canada" : "🇺🇸 United States"}</Descriptions.Item>
              </Descriptions>
            </div>

          </div>
        )}
      </Modal>
    </div>
  );
}