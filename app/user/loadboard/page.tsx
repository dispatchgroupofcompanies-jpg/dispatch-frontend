"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  Button,
  Table,
  Tag,
  Space,
  message,
  Grid,
  Input,
  Row,
  Col,
} from "antd";
import { PlusOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { LoadBoardRecord } from "./types";
import LoadBoardModal from "./components/LoadBoardModal";
import {
  getAllLoadBoardRecords,
  createLoadBoardRecord,
  updateLoadBoardRecord,
  searchLoadBoardRecords,
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
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
    fetchRecords().then(() => {
      if (isMounted) {
        // Component is still mounted
      }
    });
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
    setSelectedRecord(record);
    setModalOpen(true);
  };

  const handleSave = async (record: LoadBoardRecord) => {
    try {
      if (selectedRecord && record._id && !record._id.startsWith("temp-")) {
        // Update existing record
        await updateLoadBoardRecord(record._id, record);
        setRecords(records.map((r) => (r._id === record._id ? record : r)));
        message.success("Record updated successfully");
      } else {
        // Create new record
        const response = await createLoadBoardRecord(record);
        if (response.success) {
          setRecords([...records, response.data]);
          message.success("Record added successfully");
        }
      }
      setModalOpen(false);
    } catch (error) {
      message.error("Failed to save record");
      console.error(error);
    }
  };

  const columns: ColumnsType<LoadBoardRecord> = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: isMobile ? 100 : 100,
      render: (date: string) => (
        <span
          style={{
            fontSize: isMobile ? 12 : 13,
            color: "#1e293b",
            fontWeight: 500,
          }}
        >
          {new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Carrier Name",
      dataIndex: "carrierName",
      key: "carrierName",
      // Removing strict desktop width allows the text to expand naturally without wrapping aggressively
      width: isMobile ? 140 : 150,
      render: (name: string) => (
        <span
          style={{
            fontSize: isMobile ? 12 : 13,
            color: "#334155",
            fontWeight: 500,
          }}
        >
          {name}
        </span>
      ),
    },
    {
      title: "VRID",
      dataIndex: "vrid",
      key: "vrid",
      width: isMobile ? 90 : 80,
      render: (vrid: string) => (
        <span
          style={{
            fontSize: isMobile ? 12 : 13,
            color: vrid?.toLowerCase().startsWith("t") ? "#2563eb" : "#1e293b",
            fontWeight: 600,
          }}
        >
          {vrid}
        </span>
      ),
    },
    {
      title: "Legs",
      dataIndex: "legs",
      key: "legs",
      width: isMobile ? 80 : 100,
      render: (legs: number) => (
        <Tag
          color={legs === 2 ? "blue" : "green"}
          style={{
            fontSize: isMobile ? 11 : 12,
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {legs} {legs > 1 ? "Legs" : "Leg"}
        </Tag>
      ),
    },
    {
      title: "Trip Charges",
      dataIndex: "tripCharges",
      key: "tripCharges",
      width: isMobile ? 110 : 100,
      render: (charges: number) => (
        <span
          style={{
            fontSize: isMobile ? 12 : 13,
            color: "#1e293b",
            fontWeight: 600,
          }}
        >
          CAD ${charges?.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: isMobile ? 100 : 100,
      render: (status: string) => (
        <Tag
          color={status?.toLowerCase() === "active" ? "success" : "error"}
          style={{
            fontSize: isMobile ? 11 : 12,
            padding: "2px 8px",
            borderRadius: "4px",
          }}
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "action",
      width: isMobile ? 80 : 100,
      align: "center",
      render: (_, record) => (
        <Space size={isMobile ? "small" : "middle"}>
          <Button
            type="default"
            size={isMobile ? "small" : "middle"}
            icon={<EyeOutlined />}
            onClick={() => handleViewRecord(record)}
            style={{
              borderRadius: "6px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMobile ? "" : "View"}
          </Button>
        </Space>
      ),
    },
  ];

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
            }}
            bodyStyle={{ padding: isMobile ? "10px 12px" : "12px 14px" }}
          >
            <div
              style={{
                fontSize: isMobile ? 9 : 10,
                color: "#2563eb",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: isMobile ? 2 : 4,
                letterSpacing: "0.5px",
              }}
            >
              Total Records
            </div>
            <div
              style={{
                fontSize: isMobile ? 16 : 18,
                fontWeight: 700,
                color: "#0f172a",
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
            }}
            bodyStyle={{ padding: isMobile ? "10px 12px" : "12px 14px" }}
          >
            <div
              style={{
                fontSize: isMobile ? 9 : 10,
                color: "#16a34a",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: isMobile ? 2 : 4,
                letterSpacing: "0.5px",
              }}
            >
              Active
            </div>
            <div
              style={{
                fontSize: isMobile ? 18 : 20,
                fontWeight: 700,
                color: "#0f172a",
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
            }}
            bodyStyle={{ padding: isMobile ? "10px 12px" : "12px 14px" }}
          >
            <div
              style={{
                fontSize: isMobile ? 9 : 10,
                color: "#ef4444",
                fontWeight: 600,
                textTransform: "uppercase",
                marginBottom: isMobile ? 2 : 4,
                letterSpacing: "0.5px",
              }}
            >
              Cancelled
            </div>
            <div
              style={{
                fontSize: isMobile ? 18 : 20,
                fontWeight: 700,
                color: "#0f172a",
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

      {/* Records Table */}
      <Card
        style={{
          borderRadius: isMobile ? 8 : 10,
          border: "1px solid #eef0f3",
          overflow: "hidden",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey={(record) => record._id || record.vrid + record.date}
          pagination={{
            pageSize: isMobile ? 5 : 10,
            size: "small",
            showSizeChanger: !isMobile,
            showTotal: (total) =>
              isMobile
                ? `${total} items`
                : `Total ${total} item${total !== 1 ? "s" : ""}`,
          }}
          size={isMobile ? "middle" : "small"}
          scroll={isMobile ? { x: "max-content" } : { x: undefined }}
          style={{ fontSize: isMobile ? 12 : 13 }}
        />
      </Card>

      {/* Modal */}
      <LoadBoardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        record={selectedRecord}
      />
    </div>
  );
}
