"use client";

import { useState } from "react";
import { Modal, Button, message } from "antd";
import { ExportOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import ExcelJS from "exceljs";
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

  const handleExportConfirm = async () => {
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

    // Create ExcelJS Workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Invoices");

    // Configure Page Setup for A4 Printing
    worksheet.pageSetup = {
      paperSize: 9, // 9 = A4 Paper Size
      orientation: "portrait",
      fitToPage: true,
      fitToWidth: 1, // Fit all columns into 1 page wide
      fitToHeight: 0, // Automatic vertical pages
    };

    // Define Columns (DISPATCH REMOVED)
    worksheet.columns = [
      { header: "S.NO", key: "sNo", width: 6 },
      { header: "INVOICE NUMBER", key: "invoiceNumber", width: 16 },
      { header: "INVOICE DATE", key: "invoiceDate", width: 14 },
      { header: "PAYEE COMPANY", key: "payeeCompany", width: 22 },
      { header: "RECEIVE COMPANY", key: "receiveCompany", width: 22 },
      { header: "DRIVER NAME", key: "driverName", width: 20 },
      { header: "VRID / TRIPS", key: "vrids", width: 22 },
      { header: "TOTAL", key: "total", width: 14 },
      { header: "STATUS", key: "status", width: 12 },
    ];

    // Style Header Row (10pt Font)
    const headerRow = worksheet.getRow(1);
    headerRow.height = 26;
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "1E293B" }, // Dark Slate
      };
      cell.font = {
        name: "Arial",
        size: 10, // Set Header Font to 10pt
        bold: true,
        color: { argb: "FFFFFF" },
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });

    // Add Data Rows (10pt Font)
    invoicesToExport.forEach((invoice, index) => {
      const driverNames =
        invoice.trips
          ?.map((t) => t.driverName)
          .filter(Boolean)
          .join("\n") || "-";

      const vrids =
        invoice.trips
          ?.map((t) => t.vrid)
          .filter(Boolean)
          .join("\n") || "-";

      const row = worksheet.addRow({
        sNo: index + 1,
        invoiceNumber: `#${payeeSerialNumbers.get(invoice._id) || 1}`,
        invoiceDate: invoice.invoiceDate ? formatDate(invoice.invoiceDate) : "-",
        payeeCompany: invoice.payee?.companyName || "-",
        receiveCompany: invoice.customer?.companyName || "-",
        driverName: driverNames,
        vrids: vrids,
        total: formatCurrency(invoice.grandTotal || 0),
        status: invoice.invoiceStatus ? invoice.invoiceStatus.toUpperCase() : "-",
      });

      // Alignments & Word Wrap for Multi-line VRID / Driver Name
      row.getCell("vrids").alignment = { wrapText: true, vertical: "top" };
      row.getCell("driverName").alignment = { wrapText: true, vertical: "top" };
      row.getCell("sNo").alignment = { horizontal: "center", vertical: "top" };
      row.getCell("invoiceNumber").alignment = { vertical: "top" };
      row.getCell("invoiceDate").alignment = { vertical: "top" };
      row.getCell("payeeCompany").alignment = { vertical: "top" };
      row.getCell("receiveCompany").alignment = { vertical: "top" };
      row.getCell("total").alignment = { vertical: "top", horizontal: "right" };
      row.getCell("status").alignment = { vertical: "top", horizontal: "center" };

      // Apply 10pt Font to all data cells & Red color for Total
      row.eachCell((cell, colNumber) => {
        cell.font = {
          name: "Arial",
          size: 10, // Set Data Cells Font to 10pt
          bold: colNumber === 8, // Total Amount in bold
          color: colNumber === 8 ? { argb: "DC2626" } : { argb: "0F172A" },
        };
        cell.border = {
          bottom: { style: "thin", color: { argb: "E2E8F0" } },
        };
      });
    });

    // Generate Excel file buffer and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const companyFileName = selectedCompany
      ? `_${selectedCompany.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}`
      : "";
    const periodFileName = startDate
      ? `${startDate.format("YYYY-MM-DD")}_to_${endDate.format("YYYY-MM-DD")}`
      : "all-dates";
    const filename = `Invoices${companyFileName}_${periodFileName}.xlsx`;

    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.URL.revokeObjectURL(url);

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