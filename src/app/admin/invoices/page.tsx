"use client";
import React, { useEffect, useState, useRef } from "react";
import { Card, Typography } from "antd";
import InvoiceTable from "../../../components/InvoiceTable";
import InvoiceModal from "../../../components/InvoiceModal";
import {
  getInvoices,
  updateInvoiceStatus,
} from "../../../services/adminService";
import type { Invoice } from "../../../types/invoice";

const { Title, Text } = Typography;

export default function AdminInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetch = async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    try {
      const res = await getInvoices();
      if (mountedRef.current) {
        setInvoices(res.data || []);
      }
    } catch (e) {
      // noop - errors handled in service layer or UI message
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    fetch();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    if (status === "approved") setApproveLoading(true);
    else setRejectLoading(true);
    try {
      await updateInvoiceStatus(id, status);
      setSelected(null);
      await fetch();
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          padding: "32px 24px",
          marginBottom: 24,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Title
            level={2}
            style={{ color: "#fff", margin: 0, fontWeight: 700, fontSize: 28 }}
          >
            Invoice Management
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 14,
              marginTop: 8,
              display: "block",
            }}
          >
            Review, audit, and approve vendor billing pipelines
          </Text>
        </div>
      </div>

      {/* Content Container */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px 24px" }}>
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <InvoiceTable
            invoices={invoices}
            loading={loading}
            onView={(inv) => setSelected(inv)}
          />
        </Card>

        <InvoiceModal
          invoice={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdate}
          approveLoading={approveLoading}
          rejectLoading={rejectLoading}
        />
      </div>
    </div>
  );
}
