"use client";

import React, { useEffect, useState } from "react";
import { Card, Typography, message, Spin, Grid } from "antd";
import type { Invoice } from "../../../../src/types/invoice";
import InvoicePreview from "../../../../src/components/InvoicePreview";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function PublicInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/invoice/${params.id}`);
        const data = await response.json();

        if (data.success && data.data) {
          setInvoice(data.data);
        } else {
          setError(data.message || "Invoice not found");
        }
      } catch (err) {
        setError("Failed to load invoice");
        message.error("Failed to load invoice");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [params.id]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
          padding: isMobile ? "12px" : "20px",
        }}
      >
        <Card style={{ maxWidth: 500, textAlign: "center", borderRadius: 12 }}>
          <Title level={3} style={{ color: "#dc2626", marginBottom: 16 }}>
            Invoice Not Found
          </Title>
          <Text type="secondary">
            {error ||
              "The invoice you're looking for doesn't exist or has been removed."}
          </Text>
        </Card>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: isMobile ? "8px" : "20px",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card
          style={{
            borderRadius: 12,
            border: "1px solid #e2e8f0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          <InvoicePreview invoice={invoice} />
        </Card>
      </div>
    </div>
  );
}
