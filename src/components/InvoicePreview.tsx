"use client";

import { useMemo, useState } from "react";
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
  const isTabletOrMobile = !screens.lg;
  const [mobileHeight, setMobileHeight] = useState<number>();

  const html = useMemo(
    () => getInvoiceTemplate(invoice, serialNumber),
    [invoice, serialNumber],
  );

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        overflow: "hidden",
        padding: "0px",
        margin: "0px",
      }}
    >
      <iframe
        title={`Invoice ${invoice.invoiceNumber || ""}`}
        srcDoc={html}
        style={{
          display: "block",
          width: "100%",
          maxWidth: "100%",
          height: isTabletOrMobile
            ? mobileHeight || "85vh"
            : "min(296mm, calc(100dvh - 180px))",
          minHeight: "450px",
          overflow: "auto",
          margin: "0 auto",
          border: "0",
          backgroundColor: "#ffffff",
        }}
        scrolling="auto"
        onLoad={(event) => {
          if (!isTabletOrMobile) return;
          const height =
            event.currentTarget.contentDocument?.documentElement.scrollHeight;
          if (height) setMobileHeight(height + 20);
        }}
      />
    </div>
  );
}