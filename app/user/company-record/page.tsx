"use client";

import { useState, useEffect, useRef } from "react";
import { Card, Button, Typography, Popconfirm, Spin, Space, message, Tag, Collapse } from "antd";
import { EditOutlined, DeleteOutlined, GlobalOutlined, PlusOutlined, DownOutlined } from "@ant-design/icons";
import CompanyProfileModal from "../../../modules/company/CompanyProfileModal";
import { getCompanyProfile, deleteCompanyProfile } from "../../../modules/company/route";

const { Title, Text } = Typography;

export default function CompanyRecordPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true); 
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [paddingValue, setPaddingValue] = useState("24px");
  const [flexDirection, setFlexDirection] = useState<"row" | "column">("row");
  const [isMobile, setIsMobile] = useState(false);

  const isMounted = useRef(false);

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

  const handleAddClick = () => {
    setModalMode("add");
    setIsModalOpen(true);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
  };

  const handleClose = () => {
    setIsModalOpen(false);
    loadProfileData(true); 
  };

  const renderExpandedContent = () => (
    <div style={{ padding: "8px 4px" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px" }}>
          CORE IDENTITY
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr 1fr", gap: "16px", paddingLeft: "4px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Company Name</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.companyName || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Carrier Identifier</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.carrierIdentifier || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>NSC Number</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.nsc || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>IFTA Number</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.ifta || "—"}</div>
          </div>
        </div>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px" }}>
          CONTACT DETAILS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px", paddingLeft: "4px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Official Email</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}>{profileData.email || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Phone Number</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
              {profileData.countryCode || ""} {profileData.phone || "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>E-Transfer Address</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a", wordBreak: "break-all" }}>{profileData.eTransfer || "—"}</div>
          </div>
        </div>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />

      <div style={{ marginBottom: "20px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px" }}>
          TAXATION & REGULATORY
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px", paddingLeft: "4px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>GST / HST</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.gstHst || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>QST (Quebec)</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.qst || "N/A"}</div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Province</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{profileData.province || "—"}</div>
          </div>
        </div>
      </div>

      <hr style={{ border: "0", borderTop: "1px solid #f1f5f9", margin: "16px 0" }} />

      {/* 📍 Physical Address */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e3a8a", marginBottom: "12px", letterSpacing: "0.5px" }}>
          PHYSICAL ADDRESS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: "16px", paddingLeft: "4px" }}>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Address</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
              {profileData.addressLine1}
              {profileData.addressLine2 ? `, ${profileData.addressLine2}` : ""}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>City & Postal Code</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
              {profileData.city || "—"} ({profileData.postCode || "—"})
            </div>
          </div>
          <div>
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "2px" }}>Country</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>
              {profileData.country === "CA" ? "🇨🇦 Canada" : profileData.country === "US" ? "🇺🇸 United States" : profileData.country || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: paddingValue, minHeight: "100vh", backgroundColor: "#f8fafc", overflow: "auto" }}>
      
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
          
          <Collapse
            ghost
            expandIcon={({ isActive }) => <DownOutlined rotate={isActive ? 180 : 0} style={{ color: "#1e3a8a", fontSize: "14px" }} />}
            expandIconPosition="end"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
            }}
            items={[
              {
                key: "1",
                label: (
                  <div style={{ 
                    display: "flex", 
                    flexDirection: flexDirection,
                    justifyContent: "space-between", 
                    alignItems: "center",
                    width: "100%",
                    gap: "12px"
                  }}>
                    <Space size="middle" style={{ width: flexDirection === "column" ? "100%" : "auto", justifyContent: "flex-start" }}>
                      <GlobalOutlined style={{ color: "#1e3a8a", fontSize: "16px" }} />
                      <span style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>
                        {profileData.companyName}
                      </span>
                    </Space>

                    <Space size="small" onClick={(e) => e.stopPropagation()} style={{ width: flexDirection === "column" ? "100%" : "auto", justifyContent: flexDirection === "column" ? "space-between" : "flex-end" }}>
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
                        onPopupClick={handleDeleteClick}
                        okText="Delete Data"
                        cancelText="Keep Data"
                        okButtonProps={{ danger: true }}
                      >
                        <Button 
                          type="text" 
                          danger 
                          icon={<DeleteOutlined />}
                          onClick={handleDeleteClick}
                          style={{ fontWeight: 600, fontSize: "13px" }}
                        >
                          Delete
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                ),
                children: renderExpandedContent()
              }
            ]}
          />

        ) : (
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
              Initialize database variables by clicking the Add Company Profile button at the top right corner.
            </p>
          </div>
        )}
      </Card>

      <CompanyProfileModal 
        open={isModalOpen} 
        onClose={handleClose} 
        initialData={modalMode === "edit" ? profileData : null} 
      />
    </div>
  );
}