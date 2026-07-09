type InvoiceTrip = {
  tripDate?: string;
  vrid?: string;
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
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    .map(
      (trip: InvoiceTrip, index: number) => `
    <tr>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; text-align: center; border-bottom: 1px solid #e6eaf0;">${index + 1}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; white-space: nowrap; border-bottom: 1px solid #e6eaf0;">${formatDate(trip.tripDate)}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; font-weight: 800; color: #1e293b; border-bottom: 1px solid #e6eaf0;">${trip.vrid || "N/A"}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; font-weight: 800; color: #2563eb; text-transform: uppercase; border-bottom: 1px solid #e6eaf0;">${trip.driverName || "N/A"}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; border-bottom: 1px solid #e6eaf0;">${trip.route || "N/A"}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; border-bottom: 1px solid #e6eaf0;">${trip.pickup || "N/A"} to ${trip.drop || "N/A"}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; text-align: right; white-space: nowrap; border-bottom: 1px solid #e6eaf0;">${formatCurrency(trip.totalCharges || 0)}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; text-align: right; font-weight: 800; color: #b91c1c; white-space: nowrap; border-bottom: 1px solid #e6eaf0;">${formatCurrency(trip.dispatchAmount || 0)}</td>
      <td style="padding: 21px 10px 13px 10px; font-size: 12px; text-align: right; font-weight: 800; color: #10b981; white-space: nowrap; border-bottom: 1px solid #e6eaf0;">${formatCurrency((trip.totalCharges || 0) - (trip.dispatchAmount || 0))}</td>
    </tr>
  `,
    )
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
            top: 63%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 28px;
            font-weight: 900;
            color: rgba(148, 163, 184, 0.48);
            letter-spacing: 3px;
            white-space: normal;
            width: 100%;
            text-align: center;
            line-height: 1;
            z-index: 0;
            pointer-events: none;
          }

          .watermark-subtitle {
            display: block;
            margin-top: 6px;
            font-size: 12px;
            letter-spacing: 1px;
            color: rgba(148, 163, 184, 0.42);
          }

          .page-container {
            position: relative;
            width: 210mm;
            height: 296mm;
            padding: 16mm 15mm 45mm 15mm;
            box-sizing: border-box;
            display: block;
            z-index: 1;
            overflow: hidden;
          }

          .header-section {
            margin-bottom: 48px;
          }

          .invoice-title {
            font-size: 31px;
            font-weight: 800;
            letter-spacing: 1px;
            color: #102a63;
            margin: 0;
            line-height: 1.1;
            text-transform: uppercase;
          }

          .invoice-number {
            font-size: 13px;
            color: #5f6978;
            margin-top: 4px;
            display: block;
            padding-left: 75px;
          }

          .status-badge {
            padding: 6px 14px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            border-radius: 999px;
            display: inline-block;
            background-color: #ecfdf5;
            border: 1px solid #bbf7d0;
            color: #166534;
          }

          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 58px;
          }

          .company-name-red {
            font-size: 14px;
            font-weight: 700;
            color: #dc2626;
            display: block;
            margin-bottom: 2px;
          }

          .company-name-blue {
            font-size: 14px;
            font-weight: 700;
            color: #2563eb;
            display: block;
            margin-bottom: 2px;
          }

          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 46px;
          }

          .items-table thead tr {
            background-color: #102a63;
            color: #ffffff;
          }

          .items-table th {
            font-weight: 700;
            padding: 10px 10px;
            font-size: 12px;
            text-align: left;
            line-height: 1.3;
          }

          .items-table td {
            padding: 14px 10px;
            font-size: 12px;
            border-bottom: 1px solid #e6eaf0;
          }

          .totals-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 0;
          }

          .grand-total-row {
            border-top: 3px solid #102a63;
            border-bottom: 1px solid #e6eaf0;
          }

          .payment-section {
            width: 100%;
            border-collapse: collapse;
            margin-top: 0;
          }

          .payment-box {
            padding: 10px 12px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 2px;
          }

          .payment-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #64748b;
            margin: 0 0 6px 0;
            letter-spacing: 0.5px;
            font-weight: 700;
          }

          .payment-label-blue {
            font-size: 10px;
            text-transform: uppercase;
            color: #2563eb;
            margin: 0 0 6px 0;
            letter-spacing: 0.5px;
            font-weight: 700;
          }

          .footer-band {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            height: 46mm;
            background: #f8fafc;
            color: #64748b;
            border-top: 0.5px solid #64748b;
            box-sizing: border-box;
            padding: 9mm 15mm 8mm 15mm;
          }

          .footer-brand {
            margin: 0 0 7px 0;
            font-size: 35px;
            line-height: 0.9;
            font-weight: 900;
            letter-spacing: 3px;
            color: #64748b;
          }

          .footer-left-copy {
            font-size: 15px;
            line-height: 1.15;
            font-weight: 600;
            color: #64748b;
          }

          .footer-right-copy {
            font-size: 14px;
            line-height: 1.35;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <div class="watermark">
            XCDGOC PVT LTD
       
          </div>
          <!-- Header Section -->
          <div class="header-section">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="text-align: left; vertical-align: top; padding-bottom: 10px;">
                  <h1 class="invoice-title">${dynamicInvoiceTitle}</h1>
                  <span class="invoice-number">Num: <b>#${invoice.invoiceNumber}</b></span>
                </td>
              </tr>
            </table>
          </div>

          <!-- Company Details Section -->
          <table class="details-table" style="table-layout: fixed;">
            <tr>
              <td style="vertical-align: top; width: 50%; padding-right: 30px;">
                <div style="font-size: 12px; text-transform: uppercase; color: #7b8492; margin: 0 0 6px 0; letter-spacing: 0.9px; font-weight: 800;">EXTREME LOGISTICS INVOICE FROM:</div>
                <div>
                  <span class="company-name-red">${invoice.payee?.companyName || invoice.payee?.customerName || "N/A"}</span>
                  <div style="color: #475569; font-size: 12px; line-height: 1.25; text-transform: uppercase;">
                    ${invoice.payee?.address1 || invoice.payee?.address || "N/A"}
                  </div>
                  <div style="margin-top: 2px; color: #475569; font-size: 12px; line-height: 1.25;">
                    <b>Phone:</b> ${invoice.payee?.phone || "N/A"}<br/>
                    <b>Email:</b> ${invoice.payee?.email || "N/A"}<br/>
                    <b>GST/HST:</b> ${maskGstNumber(invoice.payee?.gstNumber)}
                  </div>
                </div>
              </td>
              <td style="vertical-align: top; width: 50%; padding-left: 130px;">
                <div style="font-size: 12px; text-transform: uppercase; color: #7b8492; margin: 0 0 6px 0; letter-spacing: 0.9px; font-weight: 800;">INVOICE TO:</div>
                <div>
                  <span class="company-name-blue">${invoice.customer?.companyName || invoice.customer?.customerName || "N/A"}</span>
                  <div style="color: #475569; font-size: 12px; line-height: 1.25; text-transform: uppercase;">
                    ${invoice.customer?.address1 || invoice.customer?.address || "N/A"}
                  </div>
                  <div style="margin-top: 2px; color: #475569; font-size: 12px; line-height: 1.25;">
                    <b>Phone:</b> ${invoice.customer?.phone || "N/A"}<br/>
                    <b>Email:</b> ${invoice.customer?.email || "N/A"}<br/>
                    <b>GST/HST:</b> ${maskGstNumber(invoice.customer?.gstNumber)}
                  </div>
                </div>
              </td>
            </tr>
          </table>

          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th style="text-align: center; width: 4%;">#</th>
                <th style="text-align: left; width: 11%;">Date</th>
                <th style="text-align: left; width: 12%;">VRID</th>
                <th style="text-align: left; width: 14%;">Driver Name</th>
                <th style="text-align: left; width: 10%;">Route</th>
                <th style="text-align: left; width: 21%;">Description</th>
                <th style="text-align: right; width: 10%;">Charges</th>
                <th style="text-align: right; width: 9%;">Dispatch</th>
                <th style="text-align: right; width: 9%;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${tripRows}
            </tbody>
          </table>

          <table class="payment-section">
            <tr>
              <td style="width: 50%; padding-right: 40px; vertical-align: top;">
                ${
                  invoice.accountNumber
                    ? `
                  <div class="payment-box" style="margin-top: 18px;">
                    <div class="payment-label">Direct Deposit Details</div>
                    <div style="font-size: 12px; color: #475569; line-height: 1.25;">
                      Institution: ${invoice.institutionNumber || "003"} | Transit: ${invoice.transitNumber || "115000"} | Account: ${invoice.accountNumber}
                    </div>
                  </div>
                `
                    : ""
                }
              </td>
              <td style="width: 50%; padding-left: 40px; vertical-align: top;">
                <table class="totals-table" style="width: 100%;">
                  ${
                    invoice.tax
                      ? `
                  <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 6px 0; font-size: 12px; color: #475569;">Tax / VAT:</td>
                    <td style="padding: 6px 0; font-size: 12px; text-align: right; color: #0f172a; font-weight: 500;">${formatCurrency(invoice.tax)}</td>
                  </tr>
                  `
                      : ""
                  }
                  <tr class="grand-total-row">
                    <td style="padding: 11px 0; font-size: 16px; font-weight: 800; color: #1e293b;">Grand Total:</td>
                    <td style="padding: 11px 0; font-size: 21px; font-weight: 800; text-align: right; color: #2563eb; white-space: nowrap;">${invoice.currency || "CAD"} ${formatCurrency(invoice.grandTotal)}</td>
                  </tr>
                </table>
                ${
                  eTransferAddress
                    ? `
                  <div class="payment-box" style="text-align: right; border: 0; margin-top: 5px;">
                    <div class="payment-label-blue">E-Transfer Details</div>
                    <div style="font-size: 12px; color: #1e293b; font-weight: 800; line-height: 1.3;">
                      ${eTransferAddress}
                    </div>
                  </div>
                `
                    : ""
                }
              </td>
            </tr>
          </table>

          <div class="footer-band">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 58%; vertical-align: top;">
                  <h2 class="footer-brand">XCDGOC PVT LTD</h2>
                  <div class="footer-left-copy">
                    Extreme Canada Dispatch Group of Companies<br/>
                   
                  </div>
                </td>
                <td style="width: 42%; vertical-align: top; padding-top: 9px;">
                  <div class="footer-right-copy">
                    Open Board,Bision,Walmart,Load Link<br/>
                    and Non Amazon Dispatch Solutions<br/><br/>
                    Contact : xcdgoc@gmail.com<br/>
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

// Email-safe template for invoices (no @page, no position:fixed, no classes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getInvoiceEmailBody = (invoice: any): string => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: invoice.currency || "CAD",
    }).format(amount || 0);
  };

  const invoiceNumber = invoice.invoiceNumber || "N/A";
  const grandTotal = formatCurrency(invoice.grandTotal);
  const customerName =
    invoice.customer?.companyName ||
    invoice.customer?.customerName ||
    "Valued Customer";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
      <tr>
        <td style="padding: 20px; background-color: #ffffff;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="text-align: right; padding-bottom: 15px; border-bottom: 2px solid #102a63;">
                <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">INVOICE</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Invoice #: <strong>#${invoiceNumber}</strong></p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #1e293b;">Hello ${customerName},</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #475569;">Please find attached your professional invoice as a PDF document.</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">Invoice Summary</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #475569; width: 50%;">Invoice Number:</td>
                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; width: 50%; text-align: right;">#${invoiceNumber}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #1e293b;">Grand Total:</td>
                    <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #2563eb; text-align: right;">${grandTotal}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <h2 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">Payment Methods Available:</h2>
                <ul style="margin: 0; padding-left: 18px; line-height: 1.6; font-size: 13px; color: #475569;">
                  <li style="margin-bottom: 4px;"><strong>Direct Deposit:</strong> See attached PDF for complete banking details</li>
                  <li><strong>E-Transfer:</strong> See attached PDF for E-Transfer email address</li>
                </ul>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 2px solid #102a63; padding-top: 15px; margin-top: 20px;">
            <tr>
              <td style="padding-top: 15px;">
                <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #1e293b;">Thank you for your business!</p>
                <p style="margin: 0; font-size: 11px; color: #64748b;">— Dispatch Group Billing Team</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
            <tr>
              <td style="padding: 20px; background-color: #f8fafc; border-radius: 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="width: 58%; vertical-align: top;">
                      <h2 style="margin: 0 0 7px 0; font-size: 20px; font-weight: 900; letter-spacing: 3px; color: #64748b;">XCDGOC PVT LTD</h2>
                      <p style="margin: 0; font-size: 14px; line-height: 1.3; color: #64748b; font-weight: 600;">Extreme Canada Dispatch Group of Companies</p>
                    </td>
                    <td style="width: 42%; vertical-align: top; padding-top: 9px;">
                      <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #64748b; text-align: center;">
                        Open Board, Bision, Walmart, Load Link<br/>
                        and Non Amazon Dispatch Solutions<br/><br/>
                        Contact: xcdgoc@gmail.com<br/>
                        +91 750 121 6555<br/>
                        Shahid ul islam
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};
