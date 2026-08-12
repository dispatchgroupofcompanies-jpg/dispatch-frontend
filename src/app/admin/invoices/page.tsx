"use client";
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Card, Typography, Grid, message, Select, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import InvoiceTable from "../../../components/InvoiceTable";
import InvoiceModal from "../../../components/InvoiceModal";
import {
  getInvoices,
  updateInvoiceStatus,
  updatePaymentStatus,
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

  // NEW: State for Payment Status Filter ("all", "pending", "paid")
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all");

  // Search Query State
  const [searchQuery, setSearchQuery] = useState("");

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

  // NEW: Dynamic counts for Payment Statuses
  const paymentCounts = useMemo(() => {
    let pending = 0;
    let paid = 0;
    invoices.forEach((inv) => {
      const status = (inv.paymentStatus || "pending").toLowerCase();
      if (status === "paid") paid++;
      else pending++;
    });
    return { pending, paid };
  }, [invoices]);

  // Updated filtering logic including Payment Status (Pending / Paid)
  const filteredInvoices = useMemo(() => {
    return invoices.filter((invoice) => {
      // 1. Payee Company Filter
      const payeeName = invoice.payee?.companyName?.trim() || "Unassigned company";
      const matchesPayee = selectedPayee === "all" || payeeName === selectedPayee;

      if (!matchesPayee) return false;

      // 2. NEW: Payment Status Filter (Pending / Paid)
      const currentPaymentStatus = (invoice.paymentStatus || "pending").toLowerCase();
      if (
        selectedPaymentStatus !== "all" &&
        currentPaymentStatus !== selectedPaymentStatus
      ) {
        return false;
      }

      // 3. Search Query Filtering
      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase().trim();

      // Search in Company Names (Payee or Receiver/Customer)
      const matchesCompany =
        invoice.payee?.companyName?.toLowerCase().includes(query) ||
        invoice.customer?.companyName?.toLowerCase().includes(query);

      // Search in Invoice Level Fields
      const matchesInvoiceId =
        invoice._id?.toLowerCase().includes(query) ||
        invoice.invoiceNumber?.toLowerCase().includes(query);

      // Search inside Trips Array (loadId1, loadId2, vrid, driverName)
      const matchesTrips = invoice.trips?.some((trip: any) => {
        const matchVrid = trip.vrid?.toLowerCase().includes(query);
        const matchLoadId1 = trip.loadId1?.toLowerCase().includes(query);
        const matchLoadId2 = trip.loadId2?.toLowerCase().includes(query);
        const matchDriver = trip.driverName?.toLowerCase().includes(query);

        return matchVrid || matchLoadId1 || matchLoadId2 || matchDriver;
      });

      return matchesCompany || matchesInvoiceId || matchesTrips;
    });
  }, [invoices, selectedPayee, selectedPaymentStatus, searchQuery]);

  const fetch = async () => {
    if (!mountedRef.current) return;
    setLoading(true);
    try {
      const res = await getInvoices();
      if (mountedRef.current) {
        setInvoices(res.data || []);
      }
    } catch (e) {
      // noop
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
    if (status === "approved") setApproveLoading(true);
    else setRejectLoading(true);
    try {
      const response = await updateInvoiceStatus(id, status);

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

  const handlePaymentStatusUpdate = async (
    invoice: Invoice,
    status: "pending" | "paid",
    proofFile?: File,
  ): Promise<boolean> => {
    try {
      const res = await updatePaymentStatus(invoice._id, status, proofFile);
      message.success(res.message || `Payment status updated to ${status}`);
      await fetch();
      return true;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(
        err?.response?.data?.message || "Failed to update payment status",
      );
      return false;
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
        {/* Controls Card (Search Bar + Dropdowns) */}
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
              gap: 12,
            }}
          >
            {/* Search Input Field */}
            <div style={{ flex: 1, maxWidth: isMobile ? "100%" : 380 }}>
              <Input
                placeholder="Search by Load ID, VRID, Driver, Company..."
                prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                size="middle"
                style={{ borderRadius: 6 }}
              />
            </div>

            {/* Dropdown Filters (Payment Status + Payee Company) */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: isMobile ? "stretch" : "center",
                gap: 8,
              }}
            >
              {/* Payment Status Dropdown */}
              <Select
                value={selectedPaymentStatus}
                onChange={setSelectedPaymentStatus}
                style={{ width: isMobile ? "100%" : 200 }}
                options={[
                  { value: "all", label: `All Payments (${invoices.length})` },
                  { value: "pending", label: `🕐 Pending (${paymentCounts.pending})` },
                  { value: "paid", label: `✅ Paid (${paymentCounts.paid})` },
                ]}
              />

              {/* Payee Company Select */}
              <Select
                value={selectedPayee}
                onChange={setSelectedPayee}
                style={{ width: isMobile ? "100%" : 240 }}
                options={[
                  { value: "all", label: `All companies (${invoices.length})` },
                  ...payeeOptions,
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Invoice Table Container */}
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
            onUpdatePaymentStatus={handlePaymentStatusUpdate}
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
          isAdmin={true}
        />
      </div>
    </div>
  );
}