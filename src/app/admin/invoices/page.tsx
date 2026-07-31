"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Card, Typography, Grid, message, Select } from "antd";
import InvoiceTable from "../../../components/InvoiceTable";
import InvoiceModal from "../../../components/InvoiceModal";
import {
  getInvoices,
  updateInvoiceStatus,
} from "../../../services/adminService";
import type { Invoice } from "../../../types/invoice";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function AdminInvoicesPage() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [selectedPayee, setSelectedPayee] = useState("all");
  const mountedRef = useRef(true);

  const payeeOptions = useMemo(() => {
    const companies = new Map<string, number>();
    invoices.forEach((invoice) => {
      const name = invoice.payee?.companyName?.trim() || "Unassigned company";
      companies.set(name, (companies.get(name) || 0) + 1);
    });

    return Array.from(companies.entries())
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([name, count]) => ({ value: name, label: `${name} (${count})` }));
  }, [invoices]);

  const filteredInvoices = useMemo(
    () =>
      selectedPayee === "all"
        ? invoices
        : invoices.filter(
            (invoice) =>
              (invoice.payee?.companyName?.trim() || "Unassigned company") ===
              selectedPayee,
          ),
    [invoices, selectedPayee],
  );

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
    const loadData = async () => {
      await fetch();
    };
    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleUpdate = async (id: string, status: "approved" | "rejected") => {
    console.log("🔔 PAGE - handleUpdate called:", { id, status });
    if (status === "approved") setApproveLoading(true);
    else setRejectLoading(true);
    try {
      console.log("🔔 PAGE - Calling updateInvoiceStatus...");
      const response = await updateInvoiceStatus(id, status);
      console.log("🔔 PAGE - updateInvoiceStatus completed:", response);

      // Show success/error message based on response
      const apiResponse = response as { message?: string };
      if (apiResponse.message) {
        if (apiResponse.message.includes("email notification failed")) {
          message.warning(apiResponse.message);
        } else {
          message.success(apiResponse.message);
        }
      } else {
        message.success(`Invoice ${status} successfully!`);
      }

      setSelected(null);
      await fetch();
    } catch (error) {
      console.error("🔔 PAGE - Error:", error);
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err?.response?.data?.message || `Failed to ${status} invoice`,
      );
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  const containerPadding = isMobile ? "12px" : "20px";
  const headerPadding = isMobile ? "16px 14px" : "24px 20px";

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
          background: "linear-gradient(135deg, #065f46 0%, #10b981 100%)",
          padding: headerPadding,
          marginBottom: isMobile ? 10 : 20,
          borderRadius: isMobile ? 12 : 16,
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <Title
            level={2}
            style={{
              color: "#fff",
              margin: 0,
              fontWeight: 700,
              fontSize: isMobile ? 20 : 24,
            }}
          >
            Invoice Management
          </Title>
          <Text
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: isMobile ? 12 : 13,
              marginTop: 6,
              display: "block",
            }}
          >
            Review, audit, and approve vendor billing pipelines
          </Text>
        </div>
      </div>

      {/* Content Container */}
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
            padding: `0 ${containerPadding} ${containerPadding}`,
        }}
      >
        <Card
          size="small"
          style={{
            marginBottom: 12,
            borderRadius: isMobile ? 10 : 12,
            border: "1px solid #dbeafe",
            background: "#f8fbff",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "stretch" : "center",
              justifyContent: "space-between",
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontWeight: 700, color: "#0f2962" }}>
                Filter by payee company
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                Review invoices for one company at a time.
              </div>
            </div>
            <Select
              value={selectedPayee}
              onChange={setSelectedPayee}
              style={{ width: isMobile ? "100%" : 300 }}
              options={[
                { value: "all", label: `All companies (${invoices.length})` },
                ...payeeOptions,
              ]}
            />
          </div>
        </Card>

        <Card
          style={{
            borderRadius: isMobile ? 10 : 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            overflow: "visible",
          }}
          bodyStyle={{ padding: isMobile ? "8px" : "12px" }}
        >
          <InvoiceTable
            invoices={filteredInvoices}
            loading={loading}
            onView={(inv) => setSelected(inv)}
            isAdmin={true}
          />
        </Card>

        <InvoiceModal
          invoice={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
          onUpdateStatus={handleUpdate}
          approveLoading={approveLoading}
          rejectLoading={rejectLoading}
          allInvoices={invoices}
        />
      </div>
    </div>
  );
}
