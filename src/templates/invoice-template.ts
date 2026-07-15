type InvoiceTrip = {
  tripDate?: string;
  vrid?: string;
  loadId1?: string;
  loadId2?: string;
  driverName?: string;
  route?: string;
  pickup?: string;
  drop?: string;
  totalCharges?: number;
  dispatchAmount?: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getInvoiceTemplate = (invoice: any): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: invoice.currency || "CAD",
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr)
      .toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  const maskGstNumber = (gstNumber: string) => {
    if (!gstNumber || gstNumber.length <= 6) return gstNumber || "N/A";
    const lastSix = gstNumber.slice(-6);
    return `******${lastSix}`;
  };

  const tripsCount = invoice.trips?.length || 0;
  const dynamicInvoiceTitle = tripsCount > 1 ? "INVOICE - T" : "INVOICE - 1";
  const eTransferAddress =
    invoice.customer?.eTransfer || invoice.payee?.eTransferAddress;

  const tripRows = (invoice.trips || [])
    .map((trip: InvoiceTrip) => {
      const hasMultipleLoads = trip.loadId2 && trip.loadId2.trim() !== "";
      const loadIdDisplay = hasMultipleLoads
        ? `${trip.loadId1 || "N/A"}<br/>${trip.loadId2}`
        : "";

      return `
    <tr>
      <td style="padding: 12px 10px; font-size: 12px; border-bottom: 1px solid #e6eaf0; vertical-align: top;">${formatDate(trip.tripDate)}</td>
      <td style="padding: 12px 10px; font-size: 12px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
        ${trip.vrid || "N/A"}${loadIdDisplay ? `<br/><span style="font-size: 11px; color: #64748b; font-weight: normal;">${loadIdDisplay}</span>` : ""}
      </td>
      <td style="padding: 12px 10px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top;">${trip.driverName || "N/A"}</td>
      <td style="padding: 12px 10px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top;">${trip.route || "N/A"}</td>
      <td style="padding: 12px 10px; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
        ${trip.pickup || "N/A"} - ${trip.drop || "N/A"}
      </td>
      <td style="padding: 12px 10px; font-size: 12px; text-align: right; font-weight: bold; color: #dc2626; white-space: nowrap; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
        ${formatCurrency(trip.totalCharges || 0)}
      </td>
    </tr>
  `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @page { 
            size: A4; 
            margin: 0;
          }
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            position: relative;
            width: 210mm;
            height: 296mm;
            overflow: hidden;
          }

          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            transform-origin: center center;
            font-size: 56px;
            font-weight: 900;
            color: rgba(148, 163, 184, 0.12);
            letter-spacing: 8px;
            white-space: nowrap;
            text-align: center;
            z-index: 0;
            pointer-events: none;
            width: 100%;
            text-transform: uppercase;
          }

          .page-container {
            position: relative;
            width: 210mm;
            height: 296mm;
            padding: 16mm 15mm 48mm 15mm;
            box-sizing: border-box;
            display: block;
            z-index: 1;
            overflow: hidden;
          }

          .header-section {
            margin-bottom: 40px;
          }

          .invoice-title {
            font-size: 34px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #0f2962;
            margin: 0;
            line-height: 1.1;
            text-transform: uppercase;
          }

          .invoice-number {
            font-size: 13px;
            color: #5f6978;
            margin-top: 4px;
            display: block;
          }

          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .company-name-red {
            font-size: 14px;
            font-weight: bold;
            color: #dc2626;
            display: block;
            margin-bottom: 2px;
            text-transform: uppercase;
          }

          .company-name-blue {
            font-size: 14px;
            font-weight: bold;
            color: #2563eb;
            display: block;
            margin-bottom: 2px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }

          .items-table thead tr {
            background-color: #102a63;
            color: #ffffff;
          }

          .items-table th {
            font-weight: 700;
            padding: 12px 10px;
            font-size: 12px;
            text-align: left;
            letter-spacing: 0.5px;
          }

          .footer-band {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 40mm;
            background: #f8fafc;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            box-sizing: border-box;
            padding: 6mm 15mm 6mm 15mm;
          }

          .footer-brand {
            margin: 0 0 4px 0;
            font-size: 32px;
            line-height: 1;
            font-weight: 900;
            letter-spacing: 2px;
            color: #475569;
          }

          .footer-left-copy {
            font-size: 13px;
            line-height: 1.3;
            font-weight: bold;
            color: #475569;
          }

          .footer-right-copy {
            font-size: 12px;
            line-height: 1.4;
            color: #64748b;
            text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="watermark">XCDGOC PVT LTD</div>

        <div class="page-container">
          <!-- Header Section -->
          <div class="header-section">
            <h1 class="invoice-title">${dynamicInvoiceTitle}</h1>
            <span class="invoice-number">Num: <b>#${invoice.invoiceNumber || "N/A"}</b></span>
          </div>

          <!-- Company Details Section -->
          <table class="details-table" style="table-layout: fixed;">
            <tr>
              <td style="vertical-align: top; width: 50%; padding-right: 20px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 6px 0; font-weight: bold; letter-spacing: 0.5px;">EXTREME LOGISTICS INVOICE FROM:</div>
                <div>
                  <span class="company-name-red">${invoice.payee?.companyName || invoice.payee?.customerName || "N/A"}</span>
                  <div style="color: #475569; font-size: 12px; line-height: 1.3; text-transform: uppercase;">
                    ${invoice.payee?.address1 || invoice.payee?.address || "N/A"}
                  </div>
                  <div style="margin-top: 4px; color: #475569; font-size: 12px; line-height: 1.35;">
                    <b>Phone:</b> ${invoice.payee?.phone || "N/A"}<br/>
                    <b>Email:</b> ${invoice.payee?.email || "N/A"}<br/>
                    <b>GST/HST:</b> ${maskGstNumber(invoice.payee?.gstNumber)}
                  </div>
                </div>
              </td>
              <td style="vertical-align: top; width: 50%; padding-left: 40px;">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; margin: 0 0 6px 0; font-weight: bold; letter-spacing: 0.5px;">INVOICE TO:</div>
                <div>
                  <span class="company-name-blue">${invoice.customer?.companyName || invoice.customer?.customerName || "N/A"}</span>
                  <div style="color: #475569; font-size: 12px; line-height: 1.3; text-transform: uppercase;">
                    ${invoice.customer?.address1 || invoice.customer?.address || "N/A"}
                  </div>
                  <div style="margin-top: 4px; color: #475569; font-size: 12px; line-height: 1.35;">
                    <b>Phone:</b> ${invoice.customer?.phone || "N/A"}<br/>
                    <b>Email:</b> ${invoice.customer?.email || "N/A"}<br/>
                    <b>GST/HST:</b> ${invoice.customer?.gstNumber || "N/A"}
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 15%;">DATE</th>
                <th style="width: 20%;">TRIP ID</th>
                <th style="width: 20%;">ASSIGNED</th>
                <th style="width: 15%;">ROUTE</th>
                <th style="width: 18%;">DISCRIPTION</th>
                <th style="width: 12%; text-align: right;">CHARGES</th>
              </tr>
            </thead>
            <tbody>
              ${tripRows}
            </tbody>
          </table>

          <!-- Right-aligned Summary & Deposit Area -->
          <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <td style="width: 50%;"></td>
              <td style="width: 50%; vertical-align: top;">
                <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-top: 3px solid #102a63; border-bottom: 3px solid #102a63; padding: 10px;">
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 6px 8px; font-size: 11px; font-weight: bold; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">DISPATCH CHARGES</td>
                    <td style="padding: 6px 8px; font-size: 12px; font-weight: bold; text-align: right; color: #dc2626;">${formatCurrency(invoice.dispatchTotal || invoice.trips?.reduce((acc: number, t: any) => acc + (t.dispatchAmount || 0), 0) || 0)}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 6px 8px; font-size: 11px; font-weight: bold; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">GRAND TOTAL</td>
                    <td style="padding: 6px 8px; font-size: 14px; font-weight: bold; text-align: right; color: #1e293b; white-space: nowrap;">${formatCurrency(invoice.grandTotal)}</td>
                  </tr>
                  <tr>
                    <td colspan="2" style="padding: 8px 8px 4px 8px; font-size: 11px; font-weight: bold; color: #dc2626; text-transform: uppercase; letter-spacing: 0.5px;">DEPOSIT DETAILS</td>
                  </tr>
                  ${
                    eTransferAddress
                      ? `
                  <tr>
                    <td colspan="2" style="padding: 2px 8px 2px 18px; font-size: 11px; color: #dc2626; line-height: 1.4;">
                      <span style="font-weight: bold; text-transform: uppercase;">E-TRANSFER:</span> <span style="color: #475569; font-weight: bold;">${eTransferAddress}</span>
                    </td>
                  </tr>
                  `
                      : ""
                  }
                  <tr>
                    <td colspan="2" style="padding: 2px 8px 6px 18px; font-size: 11px; color: #dc2626; line-height: 1.4;">
                      ${invoice.accountNumber ? `<span style="font-weight: bold; text-transform: uppercase;">VOID CHEQUE:</span> <span style="color: #475569; font-weight: normal; font-size: 10px; text-transform: uppercase;">Institution: ${invoice.institutionNumber || "003"} | Transit: ${invoice.transitNumber || "115000"} | Acct: ${invoice.accountNumber}</span>` : ""}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Footer Band -->
          <div class="footer-band">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 55%; vertical-align: top;">
                  <h2 class="footer-brand">XCDGOC PVT LTD</h2>
                  <div class="footer-left-copy">
                    Extreme Canada Dispatch Group of Companies<br/>
                    <span style="font-size: 11px; font-weight: 800; color: #0f2962; letter-spacing: 0.2px;">WE ARE CANADA'S LEADING AND LARGEST DISPATCH SERVICES PROVIDEERS</span>
                  </div>
                </td>
                <td style="width: 45%; vertical-align: top;">
                  <div class="footer-right-copy">
                    Open Board,Bision,Walmart,Load Link<br/>
                    and Non Amazon Dispatch Solutions<br/><br/>
                    <b>Contact :</b> xcdgoc@gmail.com<br/>
                    +91 750 121 6555<br/>
                    Shahid ul islam
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </body>
    </html>
  `;
};

// Email-safe template matching the new invoice design
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getInvoiceEmailBody = (invoice: any): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: invoice.currency || "CAD",
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr)
      .toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\//g, "-");
  };

  const invoiceNumber = invoice.invoiceNumber || "N/A";
  const grandTotal = formatCurrency(invoice.grandTotal);
  const dispatchTotal = formatCurrency(
    invoice.dispatchTotal ||
      invoice.trips?.reduce(
        (acc: number, t: any) => acc + (t.dispatchAmount || 0),
        0,
      ) ||
      0,
  );
  const customerName =
    invoice.customer?.companyName ||
    invoice.customer?.customerName ||
    "Valued Customer";
  const eTransferAddress =
    invoice.customer?.eTransfer || invoice.payee?.eTransferAddress;

  const tripRows = (invoice.trips || [])
    .map((trip: unknown) => {
      const t = trip as Record<string, unknown>;
      const hasMultipleLoads = t.loadId2 && (t.loadId2 as string).trim() !== "";
      const loadIdDisplay = hasMultipleLoads
        ? `${(t.loadId1 as string) || "N/A"}<br/>${t.loadId2 as string}`
        : "";

      return `
        <tr>
          <td style="padding: 10px 8px; font-size: 11px; border-bottom: 1px solid #e6eaf0; vertical-align: top; color: #475569;">
            ${formatDate(t.tripDate as string | undefined)}
          </td>
          <td style="padding: 10px 8px; font-size: 11px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
            ${(t.vrid as string) || "N/A"}${loadIdDisplay ? `<br/><span style="font-size: 10px; color: #64748b; font-weight: normal;">${loadIdDisplay}</span>` : ""}
          </td>
          <td style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top; color: #2563eb; font-weight: bold;">
            ${(t.driverName as string) || "N/A"}
          </td>
          <td style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top; color: #475569;">
            ${(t.route as string) || "N/A"}
          </td>
          <td style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top; color: #475569;">
            ${(t.pickup as string) || "N/A"} - ${(t.drop as string) || "N/A"}
          </td>
          <td style="padding: 10px 8px; font-size: 11px; text-align: right; font-weight: bold; color: #dc2626; white-space: nowrap; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
            ${formatCurrency((t.totalCharges as number) || 0)}
          </td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media screen and (max-width: 600px) {
            .email-container {
              width: 100% !important;
              max-width: 100% !important;
            }
            .email-padding {
              padding: 15px !important;
            }
            .email-header {
              font-size: 20px !important;
            }
            .email-invoice-number {
              font-size: 12px !important;
            }
            .email-greeting {
              font-size: 13px !important;
            }
            .email-message {
              font-size: 13px !important;
            }
            .trip-table {
              font-size: 10px !important;
            }
            .trip-table th {
              padding: 6px 4px !important;
              font-size: 10px !important;
            }
            .trip-table td {
              padding: 6px 4px !important;
              font-size: 10px !important;
            }
            .summary-section {
              width: 100% !important;
              display: block !important;
            }
            .summary-spacer {
              display: none !important;
            }
            .summary-box {
              width: 100% !important;
              display: block !important;
            }
            .footer-section {
              width: 100% !important;
              display: block !important;
            }
            .footer-left {
              width: 100% !important;
              display: block !important;
              margin-bottom: 15px !important;
            }
            .footer-right {
              width: 100% !important;
              display: block !important;
              text-align: left !important;
            }
            .footer-brand {
              font-size: 18px !important;
            }
            .footer-tagline {
              font-size: 9px !important;
            }
            .watermark {
              font-size: 32px !important;
            }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="position: relative; width: 100%; max-width: 600px; margin: 0 auto; overflow: hidden;" class="email-container">
          <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-35deg); font-family: Arial, sans-serif; font-size: 48px; font-weight: 900; color: rgba(148, 163, 184, 0.12); z-index: 0; pointer-events: none; white-space: nowrap; text-align: center; width: 100%;" class="watermark">
            XCDGOC PVT LTD
          </div>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="position: relative; z-index: 1; font-family: Arial, sans-serif; color: #1e293b; background: transparent;">
            <tr>
              <td style="padding: 20px;" class="email-padding">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="text-align: left; padding-bottom: 15px; border-bottom: 2px solid #102a63;">
                      <h1 class="email-header" style="margin: 0; font-size: 24px; font-weight: 900; color: #0f2962; text-transform: uppercase;">INVOICE</h1>
                      <p class="email-invoice-number" style="margin: 4px 0 0 0; font-size: 13px; color: #64748b;">Num: <strong>#${invoiceNumber}</strong></p>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                      <p class="email-greeting" style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #1e293b;">Hello ${customerName},</p>
                      <p class="email-message" style="margin: 0; font-size: 14px; line-height: 1.5; color: #475569;">Please find attached your professional invoice as a PDF document.</p>
                    </td>
                  </tr>
                </table>

                ${
                  invoice.trips && invoice.trips.length > 0
                    ? `
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <h2 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">Trip Details</h2>
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="trip-table" style="font-size: 11px;">
                      <thead>
                        <tr style="background-color: #102a63; color: #ffffff;">
                          <th style="padding: 8px; text-align: left; font-weight: 700; width: 15%;">DATE</th>
                          <th style="padding: 8px; text-align: left; font-weight: 700; width: 20%;">TRIP ID</th>
                          <th style="padding: 8px; text-align: left; font-weight: 700; width: 20%;">ASSIGNED</th>
                          <th style="padding: 8px; text-align: left; font-weight: 700; width: 15%;">ROUTE</th>
                          <th style="padding: 8px; text-align: left; font-weight: 700; width: 18%;">DISCRIPTION</th>
                          <th style="padding: 8px; text-align: right; font-weight: 700; width: 12%;">CHARGES</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${tripRows}
                      </tbody>
                    </table>
                  </td>
                </tr>
              </table>
              `
                    : ""
                }

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                  <tr>
                    <td class="summary-spacer" width="40%"></td>
                    <td class="summary-section" width="60%" style="background-color: #f8fafc; border-top: 3px solid #102a63; padding: 12px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="summary-box">
                        <tr>
                          <td style="padding: 4px 0; font-size: 11px; font-weight: bold; color: #dc2626; text-transform: uppercase;">DISPATCH CHARGES</td>
                          <td style="padding: 4px 0; font-size: 12px; font-weight: bold; text-align: right; color: #dc2626;">${dispatchTotal}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                          <td style="padding: 4px 0; font-size: 11px; font-weight: bold; color: #dc2626; text-transform: uppercase;">GRAND TOTAL</td>
                          <td style="padding: 4px 0; font-size: 14px; font-weight: bold; text-align: right; color: #1e293b; white-space: nowrap;">${grandTotal}</td>
                        </tr>
                        <tr>
                          <td colspan="2" style="padding: 8px 0 2px 0; font-size: 11px; font-weight: bold; color: #dc2626; text-transform: uppercase;">DEPOSIT DETAILS</td>
                        </tr>
                        ${
                          eTransferAddress
                            ? `
                      <tr>
                        <td colspan="2" style="padding: 2px 0 2px 10px; font-size: 11px; color: #dc2626; text-transform: uppercase;">
                          E-TRANSFER: <span style="color: #475569; font-weight: bold;">${eTransferAddress}</span>
                        </td>
                      </tr>
                      `
                            : ""
                        }
                        <tr>
                          <td colspan="2" style="padding: 2px 0 2px 10px; font-size: 11px; color: #dc2626; text-transform: uppercase; line-height: 1.4;">
                            VOID CHEQUE ${invoice.accountNumber ? `<br/><span style="color: #475569; font-weight: normal; font-size: 10px; text-transform: uppercase;">Institution: ${invoice.institutionNumber || "003"} | Transit: ${invoice.transitNumber || "115000"} | Acct: ${invoice.accountNumber}</span>` : ""}
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; margin-top: 20px;">
                  <tr>
                    <td class="footer-left" style="width: 55%; vertical-align: top;">
                      <h2 class="footer-brand" style="margin: 0 0 4px 0; font-size: 22px; font-weight: 900; color: #475569; letter-spacing: 1px;">XCDGOC PVT LTD</h2>
                      <p style="margin: 0; font-size: 12px; font-weight: bold; color: #475569; line-height: 1.3;">Extreme Canada Dispatch Group of Companies</p>
                      <p class="footer-tagline" style="margin: 4px 0 0 0; font-size: 10px; font-weight: bold; color: #0f2962;">WE ARE CANADA'S LEADING AND LARGEST DISPATCH SERVICES PROVIDEERS</p>
                    </td>
                    <td class="footer-right" style="width: 45%; vertical-align: top; text-align: right;">
                      <p style="margin: 0; font-size: 11px; line-height: 1.4; color: #64748b;">
                        Open Board, Bision, Walmart, Load Link<br/>
                        and Non Amazon Dispatch Solutions<br/><br/>
                        <strong>Contact:</strong> xcdgoc@gmail.com<br/>
                        +91 750 121 6555<br/>
                        Shahid ul islam
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
  `;
};
