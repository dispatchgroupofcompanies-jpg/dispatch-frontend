"use client";

import React from "react";
import { Table, Tag, Space, Button, Grid } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { LoadBoardRecord } from "../types";

const { useBreakpoint } = Grid;

interface Props {
  records: LoadBoardRecord[];
  loading: boolean;
  onViewRecord: (record: LoadBoardRecord) => void;
}

export default function LoadBoardTable({
  records,
  loading,
  onViewRecord,
}: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
            onClick={() => onViewRecord(record)}
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
    <Table
      columns={columns}
      dataSource={records}
      loading={loading}
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
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row-even" : "table-row-odd"
      }
      expandable={{
        expandedRowRender: (record) => {
          const loads =
            record.loads && record.loads.length > 0
              ? record.loads
              : [
                  {
                    vrid: record.vrid,
                    load1Id: record.load1Id,
                    load2Id: record.load2Id,
                    tripCharges: record.tripCharges,
                    dispatcher: record.dispatcher,
                    driverName: record.driverName,
                    dispatchCharges: record.dispatchCharges,
                    tonu: record.tonu,
                    date: record.date,
                    mgCharges: record.mgCharges,
                  },
                ];

          return (
            <div
              style={{
                padding: isMobile ? "12px" : "16px",
                background: "#f8fafc",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              {/* ================= SECTION 1: PARENT LOAD INFO ================= */}
              <div
                style={{
                  fontSize: isMobile ? 12 : 13,
                  fontWeight: 600,
                  color: "#475569",
                  marginBottom: 8,
                  paddingBottom: 4,
                  borderBottom: "2px solid #cbd5e1",
                  letterSpacing: "0.5px",
                }}
              >
                PARENT LOAD PARAMETERS
              </div>
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: isMobile ? "10px 12px" : "14px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile
                      ? "1fr 1fr"
                      : "repeat(4, 1fr)",
                    gap: isMobile ? 10 : 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Carrier Name
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.carrierName || "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      3P Carrier Name
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.thirdPartyCarrierName || "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Date
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.date
                        ? new Date(record.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      VRID
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.vrid || "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Load 1 ID
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.load1Id || "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Trip Charges
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      CAD ${record.tripCharges?.toLocaleString() ?? "0"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Dispatch Charges
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      CAD ${record.dispatchCharges?.toLocaleString() ?? "0"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      MG Charges
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      CAD ${record.mgCharges?.toLocaleString() ?? "0"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Dispatcher
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.dispatcher || "—"}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                      }}
                    >
                      Driver Name
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#1e293b",
                        fontWeight: 600,
                      }}
                    >
                      {record.driverName || "—"}
                    </div>
                  </div>
                  {record.tonu && (
                    <div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#64748b",
                          fontWeight: 500,
                          textTransform: "uppercase",
                        }}
                      >
                        Status
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: "#dc2626",
                          fontWeight: 600,
                        }}
                      >
                        CANCELLED
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ================= SECTION 2: CHILD LOADS BREAKDOWN ================= */}
              {record.loads && record.loads.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: isMobile ? 12 : 13,
                      fontWeight: 600,
                      color: "#2563eb",
                      marginBottom: 8,
                      paddingBottom: 4,
                      borderBottom: "2px solid #93c5fd",
                      letterSpacing: "0.5px",
                    }}
                  >
                    ALL ACTIVE LOADS ({record.loads.length})
                  </div>

                  {record.loads.map((loadItem, index) => {
                    const loadsLength = record.loads!.length;
                    return (
                      <div
                        key={index}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: 8,
                          padding: isMobile ? "10px 12px" : "14px",
                          marginBottom: index === loadsLength - 1 ? 0 : 12,
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: isMobile
                              ? "1fr 1fr"
                              : "repeat(4, 1fr)",
                            gap: isMobile ? 10 : 14,
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              Load 1 ID
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              {loadItem.load1Id || "—"}
                            </div>
                          </div>
                          {loadItem.load2Id && (
                            <div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#64748b",
                                  fontWeight: 500,
                                  textTransform: "uppercase",
                                }}
                              >
                                Load 2 ID
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  color: "#1e293b",
                                  fontWeight: 600,
                                }}
                              >
                                {loadItem.load2Id}
                              </div>
                            </div>
                          )}
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              VRID
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              {loadItem.vrid || "—"}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              Date
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              {loadItem.date
                                ? new Date(loadItem.date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : "—"}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              Trip Charges
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              CAD $
                              {loadItem.tripCharges?.toLocaleString() ?? "0"}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              Dispatch Charges
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              CAD $
                              {loadItem.dispatchCharges?.toLocaleString() ??
                                "0"}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              MG Charges
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              CAD ${loadItem.mgCharges?.toLocaleString() ?? "0"}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              Dispatcher
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              {loadItem.dispatcher || "—"}
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                fontSize: 10,
                                color: "#64748b",
                                fontWeight: 500,
                                textTransform: "uppercase",
                              }}
                            >
                              Driver Name
                            </div>
                            <div
                              style={{
                                fontSize: 13,
                                color: "#1e293b",
                                fontWeight: 600,
                              }}
                            >
                              {loadItem.driverName || "—"}
                            </div>
                          </div>
                          {loadItem.tonu && (
                            <div>
                              <div
                                style={{
                                  fontSize: 10,
                                  color: "#64748b",
                                  fontWeight: 500,
                                  textTransform: "uppercase",
                                }}
                              >
                                Status
                              </div>
                              <div
                                style={{
                                  fontSize: 13,
                                  color: "#dc2626",
                                  fontWeight: 600,
                                }}
                              >
                                CANCELLED
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        },
        rowExpandable: () => true,
      }}
    />
  );
}
