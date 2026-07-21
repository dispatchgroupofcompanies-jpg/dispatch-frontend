"use client";

import { useMemo } from "react";
import type { Invoice } from "../types/invoice";
import { getInvoiceTemplate } from "../templates/invoice-template";

export default function InvoicePreview({
  invoice,
  serialNumber,
}: {
  invoice: Invoice;
  serialNumber?: number;
}) {
  const html = useMemo(
    () => getInvoiceTemplate(invoice, serialNumber),
    [invoice, serialNumber],
  );

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#f1f5f9",
        overflowX: "auto",
        padding: 12,
      }}
    >
      <iframe
        title={`Invoice ${invoice.invoiceNumber || ""}`}
        srcDoc={html}
        style={{
          display: "block",
          width: "210mm",
          height: "296mm",
          maxWidth: "100%",
          margin: "0 auto",
          border: "0",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.14)",
        }}
      />
    </div>
  );
}
