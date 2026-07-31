"use client";

import { useMemo } from "react";
import { Grid } from "antd";
import type { Invoice } from "../types/invoice";
import { getInvoiceTemplate } from "../templates/invoice-template";

const { useBreakpoint } = Grid;

export default function InvoicePreview({
  invoice,
  serialNumber,
}: {
  invoice: Invoice;
  serialNumber?: number | string;
}) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const html = useMemo(
    () => getInvoiceTemplate(invoice, serialNumber),
    [invoice, serialNumber],
  );

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#f1f5f9",
        // The iframe document owns horizontal/vertical scrolling. Keeping the
        // wrapper clipped prevents a duplicate scrollbar around the preview.
        overflow: "hidden",
        padding: "clamp(4px, 2vw, 12px)",
      }}
    >
      <iframe
        title={`Invoice ${invoice.invoiceNumber || ""}`}
        srcDoc={html}
        style={{
          display: "block",
          // Desktop modals size themselves from this A4 preview. Only use a
          // fluid width on phone/tablet screens where the page must fit.
          width: isMobile ? "100%" : "210mm",
          // The invoice remains A4 when printed, but the browser preview must
          // fit inside a dialog viewport. This iframe is the only vertical
          // scroll area for the preview.
          height: "min(296mm, calc(100dvh - 220px))",
          minHeight: "360px",
          overflow: "auto",
          margin: "0 auto",
          border: "0",
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.14)",
        }}
      />
    </div>
  );
}
