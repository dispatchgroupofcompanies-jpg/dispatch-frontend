"use client";

import { useState } from "react";
import { Modal, Button, message } from "antd";
import { ExportOutlined, FilePdfOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import type { CompanyHistoryInvoice } from "../types";

interface ExportModalsProps {
  filteredInvoices: CompanyHistoryInvoice[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string | undefined) => string;
  isMobile: boolean;
}

export default function CompanyHistoryExportModals({
  filteredInvoices,
  formatCurrency,
  formatDate,
  isMobile,
}: ExportModalsProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportDays, setExportDays] = useState(7);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfDays, setPdfDays] = useState(7);

  const showExportModal = () => {
    setExportModalOpen(true);
  };

  const handleExportConfirm = () => {
    setExportModalOpen(false);

    const now = dayjs();
    const startDate = now.subtract(exportDays, "days").startOf("day");
    const endDate = now.endOf("day");

    const invoicesToExport = filteredInvoices.filter((inv) => {
      const invDate = dayjs(inv.createdAt);
      return (
        (invDate.isAfter(startDate) || invDate.isSame(startDate, "day")) &&
        (invDate.isBefore(endDate) || invDate.isSame(endDate, "day"))
      );
    });

    if (invoicesToExport.length === 0) {
      message.warning(`No invoices found in the last ${exportDays} days`);
      return;
    }

    const excelData = invoicesToExport.map((invoice, index) => {
      let carrierNeedToPay = 0;
      let carrierNeedsToReceive = 0;

      if (invoice.trips && invoice.trips.length > 0) {
        invoice.trips.forEach((trip) => {
          const totalCharges = Number(trip.totalCharges || 0);
          const dispatchPercentage = Number(trip.dispatchPercentage || 10);
          const dispatchAmount = (totalCharges * dispatchPercentage) / 100;

          carrierNeedToPay += dispatchAmount;
          carrierNeedsToReceive += totalCharges - dispatchAmount;
        });
      }

      const driverNames =
        invoice.trips
          ?.map((t) => t.driverName)
          .filter(Boolean)
          .join(", ") || "-";
      const vrids =
        invoice.trips
          ?.map((t) => t.vrid)
          .filter(Boolean)
          .join(", ") || "-";

      return {
        "S.NO": index + 1,
        "INVOICE NUMBER": invoice.invoiceNumber || "-",
        "INVOICE DATE": invoice.invoiceDate
          ? formatDate(invoice.invoiceDate)
          : "-",
        "PAYEE COMPANY": invoice.payee?.companyName || "-",
        "RECEIVE COMPANY": invoice.customer?.companyName || "-",
        DISPATCH: carrierNeedToPay > 0 ? formatCurrency(carrierNeedToPay) : "-",
        "DRIVER NAME": driverNames,
        VRID: vrids,
        TOTAL: formatCurrency(invoice.grandTotal),
        STATUS: invoice.invoiceStatus
          ? invoice.invoiceStatus.toUpperCase()
          : "-",
      };
    });

    const ws = XLSX.utils.json_to_sheet(excelData);

    const objectMaxLength: { width: number }[] = [];
    excelData.forEach((row) => {
      Object.keys(row).forEach((key, ind) => {
        const val = row[key as keyof typeof row];
        const valueLength = val ? val.toString().length : 10;
        const headerLength = key.length;
        const maxLen = Math.max(valueLength, headerLength) + 3;

        if (!objectMaxLength[ind]) {
          objectMaxLength[ind] = { width: maxLen };
        } else {
          if (maxLen > objectMaxLength[ind].width) {
            objectMaxLength[ind].width = maxLen;
          }
        }
      });
    });
    ws["!cols"] = objectMaxLength;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Invoices");

    const filename = `Invoices_${startDate.format("YYYY-MM-DD")}_to_${endDate.format("YYYY-MM-DD")}`;
    XLSX.writeFile(wb, `${filename}.xlsx`);
    message.success(
      `Exported ${invoicesToExport.length} invoices successfully!`,
    );
  };

  const handleExportCancel = () => {
    setExportModalOpen(false);
  };

  const showPdfModal = () => {
    setPdfModalOpen(true);
  };

  const handlePdfConfirm = async () => {
    setPdfModalOpen(false);

    const now = dayjs();
    const startDate = now.subtract(pdfDays, "days").startOf("day");
    const endDate = now.endOf("day");

    const invoicesToDownload = filteredInvoices.filter((inv) => {
      const invDate = dayjs(inv.createdAt);
      return (
        (invDate.isAfter(startDate) || invDate.isSame(startDate, "day")) &&
        (invDate.isBefore(endDate) || invDate.isSame(endDate, "day"))
      );
    });

    if (invoicesToDownload.length === 0) {
      message.warning(`No invoices found in the last ${pdfDays} days`);
      return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const invoice of invoicesToDownload) {
      try {
        const response = await fetch(`/api/invoices/${invoice._id}/pdf`);
        if (!response.ok) throw new Error("Failed to fetch PDF");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        successCount++;
      } catch (error) {
        console.error(
          `Failed to download PDF for invoice ${invoice.invoiceNumber}:`,
          error,
        );
        failCount++;
      }
    }

    if (successCount > 0) {
      message.success(`Successfully downloaded ${successCount} PDF(s)`);
    }
    if (failCount > 0) {
      message.error(`Failed to download ${failCount} PDF(s)`);
    }
  };

  const handlePdfCancel = () => {
    setPdfModalOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        icon={<ExportOutlined />}
        onClick={showExportModal}
        size="large"
        style={{
          background: "#10b981",
          borderColor: "#10b981",
          fontWeight: 600,
        }}
      >
        Export to Excel
      </Button>
      <Button
        icon={<FilePdfOutlined />}
        onClick={showPdfModal}
        size="large"
        style={{
          background: "#ef4444",
          borderColor: "#ef4444",
          color: "white",
          fontWeight: 600,
        }}
      >
        Download PDF
      </Button>

      {/* Export Modal */}
      <Modal
        title="Export to Excel"
        open={exportModalOpen}
        onOk={handleExportConfirm}
        onCancel={handleExportCancel}
        okText="Export"
        cancelText="Cancel"
        centered
        width={isMobile ? "90%" : 520}
        style={{ top: isMobile ? 0 : 20 }}
        styles={{
          body: {
            padding: isMobile ? "12px" : "20px 0",
          },
        }}
      >
        <div>
          <p
            style={{
              marginBottom: 16,
              fontSize: isMobile ? 13 : 14,
              color: "#475569",
            }}
          >
            Select the number of days to export:
          </p>
          <div
            style={{
              display: "flex",
              gap: isMobile ? 6 : 8,
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {[7, 15, 30, 90, 180, 365].map((days) => (
              <Button
                key={days}
                type={exportDays === days ? "primary" : "default"}
                onClick={() => setExportDays(days)}
                style={{
                  minWidth: isMobile ? 60 : 80,
                  fontSize: isMobile ? 12 : 14,
                }}
                size={isMobile ? "small" : "middle"}
              >
                {days === 365
                  ? "1 Year"
                  : days === 90
                    ? "3 Months"
                    : days === 30
                      ? "1 Month"
                      : days === 15
                        ? "15 Days"
                        : `${days} Days`}
              </Button>
            ))}
          </div>
          <p
            style={{
              marginTop: 16,
              fontSize: isMobile ? 11 : 12,
              color: "#94a3b8",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            This will export all invoices from the last {exportDays} days based
            on current filters.
          </p>
        </div>
      </Modal>

      {/* PDF Download Modal */}
      <Modal
        title="Download Invoices PDF"
        open={pdfModalOpen}
        onOk={handlePdfConfirm}
        onCancel={handlePdfCancel}
        okText="Download PDFs"
        cancelText="Cancel"
        centered
        width={isMobile ? "90%" : 520}
        style={{ top: isMobile ? 0 : 20 }}
        styles={{
          body: {
            padding: isMobile ? "12px" : "20px 0",
          },
        }}
      >
        <div>
          <p
            style={{
              marginBottom: 16,
              fontSize: isMobile ? 13 : 14,
              color: "#475569",
            }}
          >
            Select the number of days to download PDFs:
          </p>
          <div
            style={{
              display: "flex",
              gap: isMobile ? 6 : 8,
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            {[7, 15, 30, 90, 180, 365].map((days) => (
              <Button
                key={days}
                type={pdfDays === days ? "primary" : "default"}
                onClick={() => setPdfDays(days)}
                style={{
                  minWidth: isMobile ? 60 : 80,
                  fontSize: isMobile ? 12 : 14,
                }}
                size={isMobile ? "small" : "middle"}
              >
                {days === 365
                  ? "1 Year"
                  : days === 90
                    ? "3 Months"
                    : days === 30
                      ? "1 Month"
                      : days === 15
                        ? "15 Days"
                        : `${days} Days`}
              </Button>
            ))}
          </div>
          <p
            style={{
              marginTop: 16,
              fontSize: isMobile ? 11 : 12,
              color: "#94a3b8",
              textAlign: isMobile ? "center" : "left",
            }}
          >
            This will download all invoice PDFs from the last {pdfDays} days
            based on current filters.
          </p>
        </div>
      </Modal>
    </>
  );
}
