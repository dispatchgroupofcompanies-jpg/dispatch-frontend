"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  Card,
  Typography,
  message,
  Button,
  Grid,
  Select,
  Tooltip,
  Modal,
  Image,
  Tag,
  Space,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  getAdminLoadboard,
  updateAdminLoadboardStatus,
} from "../../../src/services/admin/loadboard";
import { DispatchFilterBar } from "./DispatchFilterBar";

const { Text } = Typography;
const { useBreakpoint } = Grid;

interface LoadBoardRecord {
  _id: string;
  invoiceStatus?: string;
  paymentStatus?: string;
  createdBy?: { email: string; name: string };
  createdAt: string;
  load1Id?: string;
  carrierName?: string;
  thirdPartyCarrierName?: string;
  driverName?: string;
  dispatcher?: string;
  tripCharges?: number;
  screenshotUrl?: string;
  globalSerial?: number;
  [key: string]: any;
}

const STATUS_OPTIONS = [
  { value: "generated", label: "Generated" },
  { value: "pending", label: "Pending" },
];

const PAGE_SIZE_OPTIONS = ["10", "20", "50", "100"];

const statusStyle = (value: string, isDisabled: boolean = false) => {
  const isGenerated = value === "generated";
  return {
    width: "100%",
    color: isGenerated ? "#047857" : "#b91c1c",
    fontWeight: 700,
    background: isGenerated ? "#dcfce7" : "#fee2e2",
    borderColor: isGenerated ? "#86efac" : "#fca5a5",
    borderRadius: 6,
    opacity: isDisabled ? 0.85 : 1,
  };
};

const statusTag = (value: string | undefined) => {
  const isGenerated = value === "generated";
  return (
    <Tag
      color={isGenerated ? "green" : "red"}
      style={{ margin: 0, fontWeight: 600 }}
    >
      {isGenerated ? "Invoice Generated" : "Invoice Pending"}
    </Tag>
  );
};

const DetailItem = React.memo(
  ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div
      style={{
        background: "#ffffff",
        padding: "10px 12px",
        borderRadius: "8px",
        border: "1px solid #d1fae5",
        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontSize: "11px",
          fontWeight: 700,
          color: "#059669",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </span>
      <div
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#064e3b",
          wordBreak: "break-word",
        }}
      >
        {children}
      </div>
    </div>
  )
);
DetailItem.displayName = "DetailItem";

export default function Admin3PDispatchPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.lg;

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<LoadBoardRecord[]>([]);
  const [statusUpdating, setStatusUpdating] = useState<Record<string, boolean>>({});
  const [detailsRecord, setDetailsRecord] = useState<LoadBoardRecord | null>(null);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [selectedWeekRange, setSelectedWeekRange] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAdminLoadboard({ limit: 1000 });
      if (res?.success) {
        setRecords(res.data || []);
      } else {
        message.error(res?.message || "Failed to load 3P dispatch records");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch 3P dispatch records");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const indexedRecords = useMemo(() => {
    const sorted = [...records].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sorted.map((record, index) => ({
      ...record,
      globalSerial: index + 1,
    }));
  }, [records]);

  const handleStatusChange = useCallback(
    async (
      recordId: string,
      field: "invoiceStatus" | "paymentStatus",
      value: string
    ) => {
      setStatusUpdating((prev) => ({ ...prev, [recordId]: true }));
      try {
        const statusUpdate = { [field]: value };
        const res = await updateAdminLoadboardStatus(recordId, statusUpdate);
        if (res.success) {
          setRecords((prev) =>
            prev.map((r) => (r._id === recordId ? res.data : r))
          );
          message.success("Status updated successfully");
        } else {
          message.error(res.message || "Failed to update status");
        }
      } catch (err) {
        console.error(err);
        message.error("Failed to update status");
      } finally {
        setStatusUpdating((prev) => ({ ...prev, [recordId]: false }));
      }
    },
    []
  );

  const handleSearchChange = useCallback((text: string) => {
    setSearchText(text);
    setCurrentPage(1);
  }, []);

  const handleStatusFilterChange = useCallback((value: string | undefined) => {
    setStatusFilter(value);
    setCurrentPage(1);
  }, []);

  const handleWeekFilterChange = useCallback((range?: string) => {
    setSelectedWeekRange(range);
    setCurrentPage(1);
  }, []);

  const selectedWeekSummary = useMemo(() => {
    const weekRecords = !selectedWeekRange || selectedWeekRange === "all"
      ? records
      : (() => {
          const [startStr, endStr] = selectedWeekRange.split("_");
          const startDate = dayjs(startStr).startOf("day");
          const endDate = dayjs(endStr).endOf("day");

          return records.filter((record) => {
            const recordDate = dayjs(record.createdAt);
            return !recordDate.isBefore(startDate) && !recordDate.isAfter(endDate);
          });
        })();

    return weekRecords.reduce(
      (summary, record) => {
        summary.total += 1;
        if (record.invoiceStatus === "generated") {
          summary.generated += 1;
        } else {
          summary.pending += 1;
        }
        return summary;
      },
      { total: 0, pending: 0, generated: 0 }
    );
  }, [records, selectedWeekRange]);

  const filteredRecords = useMemo(() => {
    const term = searchText.toLowerCase().trim();

    const filtered = indexedRecords.filter((r) => {
      const recordStatus = r.invoiceStatus || "pending";
      if (statusFilter && recordStatus !== statusFilter) {
        return false;
      }

      if (selectedWeekRange && selectedWeekRange !== "all") {
        const [startStr, endStr] = selectedWeekRange.split("_");
        const recordDate = dayjs(r.createdAt);
        const startDate = dayjs(startStr).startOf("day");
        const endDate = dayjs(endStr).endOf("day");

        if (recordDate.isBefore(startDate) || recordDate.isAfter(endDate)) {
          return false;
        }
      }

      if (term) {
        const carrierMatch = r.carrierName?.toLowerCase().includes(term);
        const thirdPartyMatch = r.thirdPartyCarrierName
          ?.toLowerCase()
          .includes(term);
        const dispatcherMatch = r.dispatcher?.toLowerCase().includes(term);

        if (!carrierMatch && !thirdPartyMatch && !dispatcherMatch) {
          return false;
        }
      }

      return true;
    });

    return filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [indexedRecords, searchText, statusFilter, selectedWeekRange]);

  const columns = useMemo(
    () => [
      {
        title: "S.No",
        key: "serial",
        width: 70,
        render: (_v: any, record: LoadBoardRecord) => (
          <span
            style={{
              fontWeight: 800,
              color: "#ffffff",
              background: "#059669",
              padding: "4px 10px",
              borderRadius: 6,
              display: "inline-block",
              minWidth: 32,
              textAlign: "center",
            }}
          >
            {record.globalSerial}
          </span>
        ),
      },
      {
        title: "Company Name / Payee",
        dataIndex: "carrierName",
        width: 170,
        ellipsis: true,
        render: (value: string) => (
          <span style={{ fontWeight: 600, color: "#047857" }}>
            {value || "—"}
          </span>
        ),
      },
      {
        title: "Pay To / Company Driver",
        dataIndex: "thirdPartyCarrierName",
        width: 170,
        ellipsis: true,
        render: (value: string) => (
          <span style={{ fontWeight: 600, color: "#064e3b" }}>
            {value || "—"}
          </span>
        ),
      },
      {
        title: "Dispatcher",
        dataIndex: "dispatcher",
        width: 140,
        ellipsis: true,
        render: (value: string) => value || "—",
      },
      {
        title: "CAD Amount",
        dataIndex: "tripCharges",
        width: 130,
        render: (value: number) => (
          <span
            style={{ fontWeight: 700, color: "#022c22", whiteSpace: "nowrap" }}
          >
            CAD ${Number(value || 0).toLocaleString()}
          </span>
        ),
      },
      {
        title: "Invoice Status",
        dataIndex: "invoiceStatus",
        width: 150,
        render: (value: string, record: LoadBoardRecord) => {
          const isGenerated = value === "generated";

          return (
            <Select
              size="small"
              value={value || "pending"}
              disabled={isGenerated}
              style={statusStyle(value || "pending", isGenerated)}
              onChange={(val) =>
                handleStatusChange(record._id, "invoiceStatus", val)
              }
              loading={statusUpdating[record._id]}
              options={STATUS_OPTIONS}
            />
          );
        },
      },
      {
        title: "Actions",
        key: "actions",
        width: 90,
        align: "center" as const,
        render: (_v: any, record: LoadBoardRecord) => (
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              icon={<EyeOutlined />}
              onClick={() => setDetailsRecord(record)}
              style={{ borderColor: "#10b981", color: "#047857" }}
            />
          </Tooltip>
        ),
      },
    ],
    [statusUpdating, handleStatusChange]
  );

  const paginatedMobileRecords = useMemo(() => {
    if (!isMobile) return [];
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRecords.slice(startIndex, startIndex + pageSize);
  }, [isMobile, filteredRecords, currentPage, pageSize]);

  const filterHeader = (
    <DispatchFilterBar
      searchText={searchText}
      statusFilter={statusFilter}
      selectedWeekRange={selectedWeekRange}
      selectedWeekSummary={selectedWeekSummary}
      onSearchChange={handleSearchChange}
      onStatusFilterChange={handleStatusFilterChange}
      onWeekFilterChange={handleWeekFilterChange}
    />
  );

  if (isMobile) {
    return (
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          padding: "12px",
          minHeight: "calc(100vh - 80px)",
          background: "#ecfdf5",
        }}
      >
        <Card
          bodyStyle={{ padding: 0 }}
          style={{ borderRadius: 12, overflow: "hidden" }}
        >
          {filterHeader}
          {loading && (
            <div style={{ textAlign: "center", padding: 24, color: "#047857" }}>
              Loading dispatch records...
            </div>
          )}
          {!loading && filteredRecords.length === 0 && (
            <div style={{ textAlign: "center", padding: 24, color: "#6b7280" }}>
              No matching records found.
            </div>
          )}
          {paginatedMobileRecords.map((record) => {
            const isInvoiceGenerated = record.invoiceStatus === "generated";
            const rowColors = isInvoiceGenerated
              ? { background: "#ecfdf5", border: "#a7f3d0", text: "#047857" }
              : { background: "#fef2f2", border: "#fecaca", text: "#b91c1c" };

            return (
              <div
                key={record._id}
                style={{
                  display: "grid",
                  gap: 12,
                  padding: 14,
                  background: rowColors.background,
                  borderBottom: `1px solid ${rowColors.border}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    paddingBottom: 8,
                    borderBottom: `1px solid ${rowColors.border}`,
                  }}
                >
                  <Space>
                    <span
                      style={{
                        fontWeight: 800,
                        color: "#fff",
                        background: "#059669",
                        padding: "3px 8px",
                        borderRadius: 6,
                        fontSize: 12,
                      }}
                    >
                      {record.globalSerial}
                    </span>
                  </Space>
                  <span
                    style={{
                      fontWeight: 700,
                      color: rowColors.text,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {record.carrierName || record.thirdPartyCarrierName || "—"}
                  </span>
                </div>

                <div style={{ fontSize: 12, color: "#374151" }}>
                  Dispatcher: <strong>{record.dispatcher || "—"}</strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 11, color: "#6b7280" }}>
                      CAD Amount
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        color: rowColors.text,
                        fontSize: 15,
                      }}
                    >
                      CAD ${Number(record.tripCharges || 0).toLocaleString()}
                    </div>
                  </div>
                  <Button
                    size="small"
                    icon={<EyeOutlined />}
                    onClick={() => setDetailsRecord(record)}
                    style={{
                      color: "#047857",
                      borderColor: "#a7f3d0",
                      background: "#ffffff",
                    }}
                  >
                    View
                  </Button>
                </div>

                <Select
                  size="small"
                  value={record.invoiceStatus || "pending"}
                  disabled={isInvoiceGenerated}
                  style={statusStyle(
                    record.invoiceStatus || "pending",
                    isInvoiceGenerated
                  )}
                  onChange={(value) =>
                    handleStatusChange(record._id, "invoiceStatus", value)
                  }
                  loading={statusUpdating[record._id]}
                  options={STATUS_OPTIONS}
                />
              </div>
            );
          })}
        </Card>

        <Modal
          open={Boolean(detailsRecord)}
          onCancel={() => setDetailsRecord(null)}
          footer={null}
          width={340}
          centered
          title={
            <span style={{ color: "#065f46", fontWeight: 700 }}>
              Dispatch Details
            </span>
          }
          bodyStyle={{
            maxHeight: "80vh",
            overflowY: "auto",
            background: "#ecfdf5",
            padding: "16px",
          }}
        >
          {detailsRecord && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {detailsRecord.screenshotUrl && (
                <Image
                  src={detailsRecord.screenshotUrl}
                  alt="Load screenshot"
                  width="100%"
                  style={{
                    maxHeight: 180,
                    objectFit: "contain",
                    borderRadius: 8,
                    background: "#ffffff",
                    border: "1px solid #d1fae5",
                  }}
                />
              )}
              <DetailItem label="S.No">{detailsRecord.globalSerial}</DetailItem>
              <DetailItem label="Company Name / Payee">
                {detailsRecord.carrierName || "—"}
              </DetailItem>
              <DetailItem label="Pay To / Company Driver">
                {detailsRecord.thirdPartyCarrierName || "—"}
              </DetailItem>
              <DetailItem label="Dispatcher">
                {detailsRecord.dispatcher || "—"}
              </DetailItem>
              <DetailItem label="CAD Amount">
                CAD ${Number(detailsRecord.tripCharges || 0).toLocaleString()}
              </DetailItem>
              <DetailItem label="Invoice Status">
                {statusTag(detailsRecord.invoiceStatus)}
              </DetailItem>
              <DetailItem label="Created By">
                {detailsRecord.createdBy?.email || "—"}
              </DetailItem>
              <DetailItem label="Created At">
                {new Date(detailsRecord.createdAt).toLocaleString()}
              </DetailItem>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        padding: 24,
        minHeight: "calc(100vh - 80px)",
        background: "#ecfdf5",
      }}
    >
      <Card
        style={{
          background: "#ffffff",
          borderColor: "#a7f3d0",
          borderRadius: 12,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: 0 }}
      >
        {filterHeader}
        <Table
          dataSource={filteredRecords}
          columns={columns}
          rowKey={(r) => r._id}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredRecords.length,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
            showSizeChanger: true,
            pageSizeOptions: PAGE_SIZE_OPTIONS,
            style: { paddingRight: 16 },
          }}
          size="middle"
          rowClassName={(record) =>
            record.invoiceStatus === "generated"
              ? "loadboard-row-generated"
              : "loadboard-row-pending"
          }
          style={{ background: "#f0fdf4" }}
        />
      </Card>

      <Modal
        open={Boolean(detailsRecord)}
        onCancel={() => setDetailsRecord(null)}
        footer={null}
        width={780}
        centered
        title={
          <span style={{ color: "#065f46", fontWeight: 700, fontSize: "18px" }}>
            3P Dispatch Details
          </span>
        }
        bodyStyle={{ background: "#f0fdf4", padding: "20px" }}
      >
        {detailsRecord && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            {detailsRecord.screenshotUrl && (
              <Image
                src={detailsRecord.screenshotUrl}
                alt="Load screenshot"
                width="100%"
                style={{
                  maxHeight: 250,
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "#ffffff",
                  border: "1px solid #a7f3d0",
                }}
              />
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "12px",
              }}
            >
              <DetailItem label="S.No">{detailsRecord.globalSerial}</DetailItem>
              <DetailItem label="Company Name / Payee">
                {detailsRecord.carrierName || "—"}
              </DetailItem>
              <DetailItem label="Pay To / Company Driver">
                {detailsRecord.thirdPartyCarrierName || "—"}
              </DetailItem>
              <DetailItem label="Dispatcher">
                {detailsRecord.dispatcher || "—"}
              </DetailItem>
              <DetailItem label="CAD Amount">
                CAD ${Number(detailsRecord.tripCharges || 0).toLocaleString()}
              </DetailItem>
              <DetailItem label="Payment ID">
                {detailsRecord.driverName ? (
                  <Text copyable={{ tooltips: ["Copy", "Copied!"] }}>
                    {detailsRecord.driverName}
                  </Text>
                ) : (
                  "—"
                )}
              </DetailItem>
              <DetailItem label="Invoice Status">
                {statusTag(detailsRecord.invoiceStatus)}
              </DetailItem>
              <DetailItem label="Created By">
                {detailsRecord.createdBy?.email || "—"}
              </DetailItem>
              <DetailItem label="Created At">
                {new Date(detailsRecord.createdAt).toLocaleString()}
              </DetailItem>
            </div>
          </div>
        )}
      </Modal>

      <style jsx global>{`
        .ant-table-tbody > tr.loadboard-row-generated > td {
          background: #ecfdf5 !important;
        }
        .ant-table-tbody > tr.loadboard-row-pending > td {
          background: #fef2f2 !important;
        }
        .ant-table-tbody > tr.loadboard-row-generated:hover > td {
          background: #dcfce7 !important;
        }
        .ant-table-tbody > tr.loadboard-row-pending:hover > td {
          background: #fee2e2 !important;
        }
      `}</style>
    </div>
  );
}
