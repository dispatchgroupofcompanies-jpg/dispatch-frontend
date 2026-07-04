"use client";

import React, { useEffect, useState } from "react";
import { Table, Spin, Alert, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  TruckOutlined,
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  DollarOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getAllAppointments } from "../../../src/services/adminService";
import type { Appointment } from "../../../src/types/invoice";

type AppointmentRecord = Appointment;

const formatDate = (value?: string) => {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: "#FAEEDA", text: "#854F0B" },
  approved: { bg: "#EAF3DE", text: "#3B6D11" },
  rejected: { bg: "#FCEBEB", text: "#A32D2D" },
  completed: { bg: "#E6F1FB", text: "#185FA5" },
};

const StatusPill = ({ status }: { status: string }) => {
  const style = statusStyles[status] || { bg: "#F1EFE8", text: "#5F5E5A" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 500,
        textTransform: "capitalize",
        display: "inline-block",
      }}
    >
      {status}
    </span>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "6px 0",
    }}
  >
    <div
      style={{ color: "#94a3b8", fontSize: 15, marginTop: 2, flexShrink: 0 }}
    >
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#1e293b",
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  </div>
);

const SectionCard = ({
  title,
  icon,
  color,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #eef0f3",
      borderRadius: 14,
      padding: "16px 18px",
      flex: "1 1 260px",
      minWidth: 240,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>
        {title}
      </span>
    </div>
    {children}
  </div>
);

const AppointmentRecords = () => {
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAppointments = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await getAllAppointments();
        if (isMounted) {
          setAppointments(response.data || []);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError("Failed to fetch appointments.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      label: "Total loads",
      value: appointments.length,
      color: "#eff6ff",
      accent: "#2563eb",
    },
    {
      label: "Pending",
      value: appointments.filter((a) => a.status === "pending").length,
      color: "#fff7ed",
      accent: "#d97706",
    },
    {
      label: "Total value",
      value: `$${appointments.reduce((s, a) => s + (a.totalAmount || 0), 0).toLocaleString()}`,
      color: "#f0fdf4",
      accent: "#16a34a",
    },
  ];

  const columns: ColumnsType<AppointmentRecord> = [
    {
      title: "Trip / shipment",
      key: "trip",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#2563eb",
              flexShrink: 0,
            }}
          >
            <TruckOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#0f172a" }}>
              Trip {record.tripNumber}
            </div>
            <div style={{ color: "#94a3b8", fontSize: 12 }}>
              Load {record.loadConfirmationNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Carrier",
      dataIndex: "carrierName",
      key: "carrierName",
      responsive: ["md"],
      render: (val: string) => (
        <span style={{ fontSize: 13, color: "#334155" }}>{val}</span>
      ),
    },
    {
      title: "Timeline (pickup / delivery)",
      key: "timeline",
      responsive: ["sm"],
      render: (_, record) => (
        <div style={{ fontSize: 13, color: "#334155" }}>
          <div>
            <span style={{ color: "#94a3b8" }}>Pick:</span>{" "}
            {formatDate(record.pickupDate)}
          </div>
          <div>
            <span style={{ color: "#94a3b8" }}>Del:</span>{" "}
            {formatDate(record.deliveryDate)}
          </div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => <StatusPill status={status} />,
    },
  ];

  const expandedRowRender = (record: AppointmentRecord) => (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        padding: "12px 4px 4px",
      }}
    >
      <SectionCard title="Carrier" icon={<TruckOutlined />} color="#2563eb">
        <InfoRow
          icon={<FileTextOutlined />}
          label="Equipment / Pro #"
          value={`${record.equipmentType} · ${record.carrierProNumber}`}
        />
        <InfoRow
          icon={<PhoneOutlined />}
          label="Phone"
          value={record.carrierPhone}
        />
        <InfoRow
          icon={<MailOutlined />}
          label="Email"
          value={record.carrierEmail}
        />
        <InfoRow
          icon={<EnvironmentOutlined />}
          label="Address"
          value={record.carrierAddress}
        />
        <InfoRow
          icon={<PhoneOutlined />}
          label="Driver cell"
          value={record.driverCellNumber}
        />
      </SectionCard>

      <SectionCard title="Shipper" icon={<UserOutlined />} color="#16a34a">
        <InfoRow
          icon={<UserOutlined />}
          label="Name"
          value={record.shipperName}
        />
        <InfoRow
          icon={<EnvironmentOutlined />}
          label="Address"
          value={`${record.shipperAddress}, ${record.shipperCity}, ${record.shipperProvince} ${record.shipperPostalCode}`}
        />
        <InfoRow
          icon={<FileTextOutlined />}
          label="Pickup # / window"
          value={`${record.pickupNumber} · ${record.pickupTimeStart}-${record.pickupTimeEnd}`}
        />
        <InfoRow
          icon={<FileTextOutlined />}
          label="Commodity"
          value={record.commodityDescription}
        />
        <InfoRow
          icon={<FileTextOutlined />}
          label="Weight"
          value={`${record.weight?.toLocaleString()} lbs`}
        />
      </SectionCard>

      <SectionCard title="Consignee" icon={<UserOutlined />} color="#d97706">
        <InfoRow
          icon={<UserOutlined />}
          label="Name"
          value={record.consigneeName}
        />
        <InfoRow
          icon={<EnvironmentOutlined />}
          label="Address"
          value={`${record.consigneeAddress}, ${record.consigneeCity}, ${record.consigneeProvince} ${record.consigneePostalCode}`}
        />
        <InfoRow
          icon={<FileTextOutlined />}
          label="Drop-off # / time"
          value={`${record.dropOffNumber} · ${record.deliveryTime}`}
        />
      </SectionCard>

      <SectionCard title="Charges" icon={<DollarOutlined />} color="#7c3aed">
        <InfoRow
          icon={<FileTextOutlined />}
          label="Description"
          value={record.chargeDescription}
        />
        <InfoRow
          icon={<DollarOutlined />}
          label="Rate"
          value={`${record.currency} ${record.rateAmount?.toLocaleString()}`}
        />
        <InfoRow
          icon={<DollarOutlined />}
          label="Total"
          value={`${record.currency} ${record.totalAmount?.toLocaleString()}`}
        />
        <InfoRow
          icon={<FileTextOutlined />}
          label="Signature"
          value={`${record.signature} · ${formatDate(record.signatureDate)}`}
        />
        <InfoRow
          icon={<FileTextOutlined />}
          label="Notes"
          value={record.notesTerms}
        />
      </SectionCard>
    </div>
  );

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Appointment records
          </h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>
            All booked trips and shipments
          </p>
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.color,
              borderRadius: 14,
              padding: "16px 20px",
              flex: "1 1 160px",
              minWidth: 150,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: s.accent,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          style={{ marginBottom: 16, borderRadius: 12 }}
        />
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #eef0f3",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={appointments}
            rowKey={(record) => record._id}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            expandable={{ expandedRowRender, expandRowByClick: true }}
            style={{ borderRadius: 16 }}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentRecords;
