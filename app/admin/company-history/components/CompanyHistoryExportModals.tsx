"use client";

import { useState } from "react";
import { Modal, Button, message } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import dayjs from "dayjs";
import type { CompanyHistoryInvoice } from "../types";

interface ExportModalsProps {
  filteredInvoices: CompanyHistoryInvoice[];
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string | undefined) => string;
  isMobile: boolean;
  selectedCompany: string | null;
  payeeSerialNumbers: Map<string, number>;
}

export default function CompanyHistoryExportModals({
  filteredInvoices,
  formatCurrency,
  formatDate,
  isMobile,
  selectedCompany,
  payeeSerialNumbers,
}: ExportModalsProps) {
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportDays, setExportDays] = useState<number | null>(null);

  const showExportModal = () => {
    setExportModalOpen(true);
  };

  const handleExportConfirm = () => {
    setExportModalOpen(false);

    const now = dayjs();
    const startDate = exportDays
      ? now.subtract(exportDays, "days").startOf("day")
      : null;
    const endDate = now.endOf("day");

    const invoicesToExport = startDate
      ? filteredInvoices.filter((inv) => {
          const invDate = dayjs(inv.createdAt);
          return (
            (invDate.isAfter(startDate) || invDate.isSame(startDate, "day")) &&
            (invDate.isBefore(endDate) || invDate.isSame(endDate, "day"))
          );
        })
      : filteredInvoices;

    if (invoicesToExport.length === 0) {
      message.warning(
        exportDays
          ? `No invoices found in the last ${exportDays} days`
          : "No invoices found for the selected filters",
      );
      return;
    }

    const excelData = invoicesToExport.map((invoice, index) => {
      let carrierNeedToPay = 0;

      if (invoice.trips && invoice.trips.length > 0) {
        invoice.trips.forEach((trip) => {
          const totalCharges = Number(trip.totalCharges || 0);
          const dispatchPercentage = Number(trip.dispatchPercentage || 10);
          const dispatchAmount = (totalCharges * dispatchPercentage) / 100;

          carrierNeedToPay += dispatchAmount;
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
        "INVOICE NUMBER": `#${payeeSerialNumbers.get(invoice._id) || 1}`,
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

    const companyFileName = selectedCompany
      ? `_${selectedCompany.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`
      : "";
    const periodFileName = startDate
      ? `${startDate.format("YYYY-MM-DD")}_to_${endDate.format("YYYY-MM-DD")}`
      : "all-dates";
    const filename = `Invoices${companyFileName}_${periodFileName}`;
    XLSX.writeFile(wb, `${filename}.xlsx`);
    message.success(
      `Exported ${invoicesToExport.length} invoices successfully!`,
    );
  };

  const handleExportCancel = () => {
    setExportModalOpen(false);
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
            Choose an export period
            {selectedCompany ? ` for ${selectedCompany}` : ""}:
          </p>
          <div
            style={{
              display: "flex",
              gap: isMobile ? 6 : 8,
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <Button
              type={exportDays === null ? "primary" : "default"}
              onClick={() => setExportDays(null)}
              style={{ minWidth: isMobile ? 60 : 80 }}
              size={isMobile ? "small" : "middle"}
            >
              All dates
            </Button>
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
            This will export {selectedCompany ? `${selectedCompany}'s ` : ""}
            invoices for {exportDays ? `the last ${exportDays} days` : "all dates"},
            respecting the active filters.
          </p>
        </div>
      </Modal>

    </>
  );
}
