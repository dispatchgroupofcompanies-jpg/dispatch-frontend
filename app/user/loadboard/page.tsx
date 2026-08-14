"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, Button, message, Grid, Input, Row, Col } from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import type { LoadBoardRecord } from "./types";
import LoadBoardModal from "./components/LoadBoardModal";
import LoadBoardTable from "./components/LoadBoardTable";
import LoadBoardDetailsModal from "./components/LoadBoardDetailsModal";
import {
  getAllLoadBoardRecords,
  createLoadBoardRecord,
  updateLoadBoardRecord,
  searchLoadBoardRecords,
  deleteLoadBoardRecord,
} from "../../../src/services/loadboardService";

const { useBreakpoint } = Grid;

export default function LoadBoardPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [records, setRecords] = useState<LoadBoardRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LoadBoardRecord | null>(
    null,
  );
  const [detailsRecord, setDetailsRecord] = useState<LoadBoardRecord | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await getAllLoadBoardRecords();
      if (response.success) {
        setRecords(response.data || []);
      }
    } catch (error) {
      message.error("Failed to fetch load board records");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch records on component mount
  useEffect(() => {
    let isMounted = true;

    const loadRecords = async () => {
      await fetchRecords();
      if (isMounted) {
        // Component is still mounted
      }
    };

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  // Search records using backend API
  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      fetchRecords();
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchLoadBoardRecords(value);
      if (response.success) {
        setRecords(response.data || []);
      }
    } catch (error) {
      message.error("Failed to search records");
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredRecords = useMemo(() => {
    return records;
  }, [records]);

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setModalOpen(true);
  };

  const handleViewRecord = (record: LoadBoardRecord) => {
    setDetailsRecord(record);
  };

  // ✅ New Handler for Editing
  const handleEditRecord = (record: LoadBoardRecord) => {
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSave = async (record: LoadBoardRecord, screenshot?: File) => {
    try {
      const payload = new FormData();
      Object.entries(record).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "_id" && key !== "screenshotUrl" && key !== "screenshotPublicId") payload.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
      });
      if (screenshot) payload.append("screenshot", screenshot);
      if (selectedRecord && record._id && !record._id.startsWith("temp-")) {
        // Update existing record
        const response = await updateLoadBoardRecord(record._id, payload);
        setRecords((current) => current.map((r) => (r._id === record._id ? response.data : r)));
        message.success("Record updated successfully");
      } else {
        // Create new record
        const response = await createLoadBoardRecord(payload);
        if (response.success) {
          setRecords((current) => [response.data, ...current]);
          message.success("Record added successfully");
        }
      }
      setModalOpen(false);
      setSelectedRecord(null);
    } catch (error) {
      message.error("Failed to save record");
      console.error(error);
    }
  };

  const handleDeleteRecord = async (record: LoadBoardRecord) => {
    if (!record._id) return;
    try {
      await deleteLoadBoardRecord(record._id);
      setRecords((current) => current.filter((item) => item._id !== record._id));
      message.success("Dispatch record deleted");
    } catch { message.error("Failed to delete dispatch record"); }
  };

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: isMobile ? "12px" : "24px",
        minHeight: "calc(100vh - 80px)",
        background: "#f8fafc",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background:
            " linear-gradient(135deg, rgb(30, 64, 175) 0%, rgb(59, 130, 246) 100%)",
          padding: isMobile ? "12px" : "16px 20px",
          marginBottom: isMobile ? 8 : 12,
          borderRadius: isMobile ? 8 : 12,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          gutter={[isMobile ? 12 : 16, 12]}
        >
          <Col xs={24} md={16}>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: isMobile ? 18 : 22,
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                Load Board
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: isMobile ? 11 : 13,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Manage 3P work and load assignments
              </p>
            </div>
          </Col>
          <Col
            xs={24}
            md={8}
            style={{ textAlign: isMobile ? "left" : "right" }}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="middle"
              onClick={handleAddRecord}
              style={{
                background: "#fff",
                color: "#10b981",
                borderRadius: "6px",
                fontWeight: 600,
                boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
                width: isMobile ? "100%" : "auto",
              }}
            >
              {isMobile ? "Add New" : "Add New Record"}
            </Button>
          </Col>
        </Row>
      </div>

      {/* Collapse Button */}
      <Row style={{ marginBottom: isMobile ? 8 : 12 }}>
        <Col xs={24}>
          <Button
            icon={isCollapsed ? <UnorderedListOutlined /> : <BarsOutlined />}
            onClick={toggleCollapse}
            style={{
              background: "#fff",
              border: "1px solid #d1d5db",
              borderRadius: 6,
              fontWeight: 500,
              color: "#374151",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {isCollapsed ? "Show Filters" : "Hide Filters"}
          </Button>
        </Col>
      </Row>

      {/* Collapsible Section: Search Bar & Stats Cards */}
      {!isCollapsed && (
        <>
          {/* Search Bar */}
          <Row style={{ marginBottom: isMobile ? 8 : 12 }}>
            <Col xs={24}>
              <Input
                placeholder="Search by VRID, Load ID, Carrier, Dispatcher, or Driver..."
                prefix={
                  isSearching ? (
                    <SearchOutlined style={{ color: "#94a3b8" }} spin />
                  ) : (
                    <SearchOutlined style={{ color: "#94a3b8" }} />
                  )
                }
                size={isMobile ? "large" : "middle"}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                style={{
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                }}
              />
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row
            gutter={[isMobile ? 8 : 10, isMobile ? 8 : 10]}
            style={{ marginBottom: isMobile ? 8 : 12 }}
          >
            <Col xs={24} sm={8}>
              <Card
                style={{
                  background: "#eff6ff",
                  border: "1px solid #2563eb15",
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: isMobile ? "10px 12px" : "14px 16px" }}
                hoverable
              >
                <div
                  style={{
                    fontSize: isMobile ? 9 : 10,
                    color: "#2563eb",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: isMobile ? 4 : 6,
                    letterSpacing: "0.5px",
                  }}
                >
                  Total Records
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {filteredRecords.length}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #16a34a15",
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: isMobile ? "10px 12px" : "14px 16px" }}
                hoverable
              >
                <div
                  style={{
                    fontSize: isMobile ? 9 : 10,
                    color: "#16a34a",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: isMobile ? 4 : 6,
                    letterSpacing: "0.5px",
                  }}
                >
                  Active
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {
                    filteredRecords.filter(
                      (r) => r.status?.toLowerCase() === "active",
                    ).length
                  }
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card
                style={{
                  background: "#fef2f2",
                  border: "1px solid #ef444415",
                  borderRadius: 8,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                }}
                bodyStyle={{ padding: isMobile ? "10px 12px" : "14px 16px" }}
                hoverable
              >
                <div
                  style={{
                    fontSize: isMobile ? 9 : 10,
                    color: "#ef4444",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    marginBottom: isMobile ? 4 : 6,
                    letterSpacing: "0.5px",
                  }}
                >
                  Cancelled
                </div>
                <div
                  style={{
                    fontSize: isMobile ? 20 : 24,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {
                    filteredRecords.filter(
                      (r) => r.status?.toLowerCase() === "cancelled",
                    ).length
                  }
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Records Table */}
      <Card
        style={{
          borderRadius: isMobile ? 8 : 10,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <LoadBoardTable
          records={filteredRecords}
          loading={loading}
          onViewRecord={handleViewRecord}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
        />
      </Card>

      {/* Modal */}
      <LoadBoardModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedRecord(null);
        }}
        onSave={handleSave}
        record={selectedRecord}
      />
      <LoadBoardDetailsModal
        open={Boolean(detailsRecord)}
        record={detailsRecord}
        onClose={() => setDetailsRecord(null)}
      />

      <style jsx global>{`
        .table-row-even {
          background-color: #f9fafb;
        }
        .table-row-odd {
          background-color: #ffffff;
        }
        .ant-table-tbody > tr:hover > td {
          background-color: #f3f4f6 !important;
          cursor: pointer;
        }
        .ant-table-thead > tr > th {
          background-color: #f8fafc !important;
          font-weight: 600;
          color: #374151;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        .ant-table-tbody > tr > td {
          border-bottom: 1px solid #f3f4f6;
        }
        .ant-table-tbody > tr.ant-table-row-expanded > td {
          background-color: #eff6ff !important;
        }
        .ant-card {
          transition: all 0.3s ease;
        }
        .ant-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .ant-table-expanded-row > td {
          padding: 0 !important;
        }
      `}</style>
    </div>
  );
}