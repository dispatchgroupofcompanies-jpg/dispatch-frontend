"use client";

import { useState, useEffect, useRef } from "react";
import { Button, Card, Descriptions, Popconfirm, Spin, message, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, GlobalOutlined } from "@ant-design/icons";
import CompanyProfileModal from "./CompanyProfileModal"; // Dono files ek hi folder me honi chahiye
import { getCompanyProfile, deleteCompanyProfile } from "./route";

export default function CompanyProfilePage() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // Component unmount memory leaks aur render loops se bachane ke liye ref flag
  const isMounted = useRef(false);

  // 🔄 1. FETCH DATA (GET ACTION) - Safely Encapsulated Asynchronous State
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
      message.error("Failed to load company profile data");
    } finally {
      setLoading(false);
    }
  };

  // Safe Mount Trigger Effect Layer
  useEffect(() => {
    isMounted.current = true;
    
    // React execution tick manager ko sync rakhne ke liye yahan se loading state encapsulation ki hai
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
        setProfileData(null); // Instant UI fallback state updates
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to delete company profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      
      {/* ================= HEADER SECTION ================= */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, color: "#0f172a", fontWeight: 700 }}>🏢 Company Configuration Dashboard</h2>
          <p style={{ margin: 0, color: "#64748b" }}>Manage and view your system backend profiles setup</p>
        </div>
        
        {/* Agar system me koi configuration exist nahi karti to primary button active hoga */}
        {!profileData && !loading && (
          <Button type="primary" size="large" onClick={() => setIsEditModalOpen(true)} style={{ backgroundColor: "#1e3a8a", borderColor: "#1e3a8a" }}>
            + Create Profile Setup
          </Button>
        )}
      </div>

      {/* ================= LOADING SPINNER ================= */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" tip="Processing profile configuration layers..." />
        </div>
      ) : profileData ? (
        
        /* 📊 3. DATA DISPLAY CARD WITH CORE CRUD ACTIONS */
        <Card 
          title={
            <Space><GlobalOutlined style={{ color: "#1e3a8a" }} /> <span style={{ fontWeight: 600 }}>{profileData.companyName}</span></Space>
          }
          extra={
            <Space size="middle">
              {/* VIEW ACTION BUTTON */}
              <Button type="text" icon={<EyeOutlined style={{ color: "#0284c7" }} />} onClick={() => setIsViewModalOpen(true)}>
                View
              </Button>
              
              {/* EDIT ACTION BUTTON */}
              <Button type="text" icon={<EditOutlined style={{ color: "#ea580c" }} />} onClick={() => setIsEditModalOpen(true)}>
                Edit
              </Button>

              {/* SECURE POPCONFIRM DELETE ACTION BUTTON */}
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
          style={{ boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", borderRadius: "12px" }}
        >
          {/* Dashboard Information Layout Block */}
          <Descriptions column={{ xs: 1, sm: 2, md: 3 }} layout="vertical" bordered contentStyle={{ fontWeight: 500 }}>
            <Descriptions.Item label="Carrier ID">{profileData.carrierIdentifier}</Descriptions.Item>
            <Descriptions.Item label="Official Email">{profileData.email}</Descriptions.Item>
            <Descriptions.Item label="Phone">{profileData.countryCode} {profileData.phone}</Descriptions.Item>
            <Descriptions.Item label="Province">{profileData.province}</Descriptions.Item>
            <Descriptions.Item label="NSC Number">{profileData.nsc}</Descriptions.Item>
            <Descriptions.Item label="GST/HST">{profileData.gstHst}</Descriptions.Item>
            <Descriptions.Item label="City & Country">{profileData.city}, {profileData.country === "CA" ? "Canada" : "USA"}</Descriptions.Item>
            <Descriptions.Item label="Postal Code">{profileData.postCode}</Descriptions.Item>
            <Descriptions.Item label="E-Transfer Address">{profileData.eTransfer}</Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        /* NO DATA FALLBACK STATE UI */
        <Card style={{ textAlign: "center", padding: "40px 0", color: "#64748b", borderRadius: "12px" }}>
          No system configuration profile detected. Please initiate a setup profile configuration.
        </Card>
      )}

      {/* 🛠️ 4. EDIT / CREATE FORM MODAL COMPONENT */}
      <CompanyProfileModal 
        open={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          loadProfileData(true); // Callback reload stream
        }} 
        initialData={profileData} 
      />

      {/* 👁️ 5. PURE READ-ONLY DETAIL POPUP SUMMARY */}
      <Modal
        title={<span style={{ fontWeight: 700, fontSize: 16 }}>📋 Full Company Profile Summary View</span>}
        open={isViewModalOpen}
        onCancel={() => setIsViewModalOpen(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setIsViewModalOpen(false)} style={{ backgroundColor: "#1e3a8a" }}>
            Close View
          </Button>
        ]}
        width={700}
        centered
      >
        {profileData && (
          <div style={{ marginTop: 16, maxHeight: "65vh", overflowY: "auto" }}>
            <h4 style={{ color: "#1e3a8a", borderBottom: "2px solid #eff6ff", paddingBottom: 6 }}>Core Identity</h4>
            <p><strong>Company Name:</strong> {profileData.companyName}</p>
            <p><strong>Carrier Identifier:</strong> {profileData.carrierIdentifier}</p>
            <p><strong>NSC Number:</strong> {profileData.nsc}</p>
            <p><strong>IFTA:</strong> {profileData.ifta}</p>
            
            <h4 style={{ color: "#1e3a8a", borderBottom: "2px solid #eff6ff", paddingBottom: 6, marginTop: 16 }}>Taxation & Payments</h4>
            <p><strong>GST/HST Number:</strong> {profileData.gstHst}</p>
            <p><strong>QST Number:</strong> {profileData.qst || "N/A"}</p>
            <p><strong>E-Transfer Email:</strong> {profileData.eTransfer}</p>

            <h4 style={{ color: "#1e3a8a", borderBottom: "2px solid #eff6ff", paddingBottom: 6, marginTop: 16 }}>Contact & Physical Location</h4>
            <p><strong>Email:</strong> {profileData.email}</p>
            <p><strong>Phone:</strong> {profileData.countryCode} {profileData.phone}</p>
            <p><strong>Address:</strong> {profileData.addressLine1} {profileData.addressLine2 ? `, ${profileData.addressLine2}` : ""}</p>
            <p><strong>City, State & Postal:</strong> {profileData.city}, {profileData.state} - {profileData.postCode}</p>
            <p><strong>Country:</strong> {profileData.country === "CA" ? "Canada" : "United States"}</p>
          </div>
        )}
      </Modal>

    </div>
  );
}