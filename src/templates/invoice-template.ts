export const formatCurrency = (amount?: number, currency = "CAD") => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency,
  }).format(amount || 0);
};

export const formatDate = (dateStr?: string) => {
  if (!dateStr) return "N/A";
  return new Date(dateStr)
    .toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\//g, "-");
};

export const maskGstNumber = (gstNumber?: string) => {
  if (!gstNumber || gstNumber.length <= 6) return gstNumber || "N/A";
  const lastSix = gstNumber.slice(-6);
  return `******${lastSix}`;
};

export const getInvoiceTemplate = (
  invoice: any,
  serialNumberOverride?: number | string,
) => {
  const serialNumber =
    serialNumberOverride ??
    invoice.payeeSerialNumber ??
    invoice.invoiceNumber ??
    "N/A";
  const dynamicInvoiceTitle = `INVOICE - #${serialNumber}`;
  const eTransferAddress =
    invoice.customer?.eTransfer || invoice.payee?.eTransferAddress;

  const dispatchTotal =
    invoice.dispatchTotal ||
    invoice.trips?.reduce(
      (acc: number, t: any) => acc + (t.dispatchAmount || 0),
      0,
    ) ||
    0;

  const tripRows = (invoice.trips || [])
    .map((trip: any) => {
      const hasMultipleLoads = trip.loadId2 && trip.loadId2.trim() !== "";
      const loadIdDisplay = hasMultipleLoads
        ? `${trip.loadId1 || "N/A"}<br/>${trip.loadId2}`
        : "";

      return `
    <tr>
      <td style="padding: 10px 8px; font-size: 11px; border-bottom: 1px solid #e6eaf0; vertical-align: top;">${formatDate(trip.tripDate)}</td>
      <td style="padding: 10px 8px; font-size: 11px; font-weight: bold; color: #1e293b; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
        ${trip.vrid || "N/A"}${loadIdDisplay ? `<br/><span style="font-size: 10px; color: #64748b; font-weight: normal;">${loadIdDisplay}</span>` : ""}
      </td>
      <td style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top;">${trip.driverName || "N/A"}</td>
      <td style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top;">${trip.route || "N/A"}</td>
      <td style="padding: 10px 8px; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
        ${trip.pickup || "N/A"} - ${trip.drop || "N/A"}
      </td>
      <td style="padding: 10px 8px; font-size: 11px; text-align: right; font-weight: bold; color: #dc2626; white-space: nowrap; border-bottom: 1px solid #e6eaf0; vertical-align: top;">
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page { size: A4; margin: 0; }
          
          * { box-sizing: border-box; }

          html, body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1e293b;
            -webkit-print-color-adjust: exact;
          }

          .page-wrapper {
            width: 100%;
            max-width: 210mm;
            margin: 0 auto;
            position: relative;
            padding: 16mm 15mm 20px 15mm;
          }

          .watermark {
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 50px;
            font-weight: 900;
            color: rgba(148, 163, 184, 0.08);
            letter-spacing: 6px;
            white-space: nowrap;
            text-align: center;
            z-index: 0;
            pointer-events: none;
            width: 100%;
            text-transform: uppercase;
          }

          .main-content {
            position: relative;
            z-index: 1;
          }

          .header-section { margin-bottom: 24px; }
          .invoice-title {
            font-size: 28px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #0f2962;
            margin: 0;
            text-transform: uppercase;
          }

          .details-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .company-name-red { font-size: 13px; font-weight: bold; color: #dc2626; display: block; margin-bottom: 2px; text-transform: uppercase; }
          .company-name-blue { font-size: 13px; font-weight: bold; color: #2563eb; display: block; margin-bottom: 2px; }
          
          .items-table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
          .items-table thead tr { background-color: #102a63; color: #ffffff; }
          .items-table th { font-weight: 700; padding: 8px; font-size: 10px; text-align: left; letter-spacing: 0.5px; }

          .footer-band {
            position: relative;
            z-index: 1;
            width: 100%;
            background: #f8fafc;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
            padding: 12px 0;
            margin-top: 25px;
          }

          .footer-brand { margin: 0 0 4px 0; font-size: 22px; line-height: 1; font-weight: 900; letter-spacing: 1px; color: #475569; }
          .footer-left-copy { font-size: 10px; line-height: 1.3; font-weight: bold; color: #475569; }
          .footer-right-copy { font-size: 10px; line-height: 1.3; color: #64748b; text-align: right; }

          /* Mobile Screen Adjustments */
          @media screen and (max-width: 700px) {
            .page-wrapper { padding: 12px 10px; }
            .invoice-title { font-size: 22px; }
            .watermark { font-size: 30px; }
            .items-table th, .items-table td { padding: 6px 4px !important; font-size: 9px !important; }
            .details-table td { padding-left: 5px !important; padding-right: 5px !important; }
            .footer-brand { font-size: 18px; }
          }
        </style>
      </head>
      <body>
        <div class="page-wrapper">
          <div class="watermark">XCDGOC PVT LTD</div>

          <div class="main-content">
            <div class="header-section">
              <h1 class="invoice-title">${dynamicInvoiceTitle}</h1>
              <div style="margin-top: 6px; color: #64748b; font-size: 8px; line-height: 1.15; font-weight: bold; letter-spacing: 0.2px;">
                All invoices are non HST/GST<br/>
                We are not responsible for your previous record more than 30 days<br/>
                Rest later for further previous invoices record<br/>
                Of 03 months we will charge you $50
              </div>
            </div>

            <table class="details-table" style="table-layout: fixed;">
              <tr>
                <td style="vertical-align: top; width: 50%; padding-right: 10px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; font-weight: bold;">Payee</div>
                  <div>
                    <span class="company-name-red">${invoice.payee?.companyName || invoice.payee?.customerName || "N/A"}</span>
                    <div style="color: #475569; font-size: 11px; line-height: 1.2; text-transform: uppercase;">
                      ${invoice.payee?.address1 || invoice.payee?.address || "N/A"}
                    </div>
                    <div style="margin-top: 4px; color: #475569; font-size: 11px; line-height: 1.3;">
                      <b>Phone:</b> ${invoice.payee?.phone || "N/A"}<br/>
                      <b>Email:</b> ${invoice.payee?.email || "N/A"}<br/>
                      <b>GST/HST:</b> ${maskGstNumber(invoice.payee?.gstNumber)}
                    </div>
                  </div>
                </td>
                <td style="vertical-align: top; width: 50%; padding-left: 10px;">
                  <div style="font-size: 10px; text-transform: uppercase; color: #64748b; margin-bottom: 4px; font-weight: bold;">Pay TO:</div>
                  <div>
                    <span class="company-name-blue">${invoice.customer?.companyName || invoice.customer?.customerName || "N/A"}</span>
                    <div style="color: #475569; font-size: 11px; line-height: 1.2; text-transform: uppercase;">
                      ${invoice.customer?.address1 || invoice.customer?.address || "N/A"}
                    </div>
                    <div style="margin-top: 4px; color: #475569; font-size: 11px; line-height: 1.3;">
                      <b>Phone:</b> ${invoice.customer?.phone || "N/A"}<br/>
                      <b>Email:</b> ${invoice.customer?.email || "N/A"}<br/>
                      <b>GST/HST:</b> ${maskGstNumber(invoice.customer?.gstNumber)}
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 15%;">DATE</th>
                  <th style="width: 20%;">TRIP ID</th>
                  <th style="width: 18%;">ASSIGNED</th>
                  <th style="width: 15%;">ROUTE</th>
                  <th style="width: 20%;">DESCRIPTION</th>
                  <th style="width: 12%; text-align: right;">CHARGES</th>
                </tr>
              </thead>
              <tbody>
                ${tripRows}
              </tbody>
            </table>

            <table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;">
              <tr>
                <td style="width: 35%;"></td>
                <td style="width: 65%; vertical-align: top;">
                  <table style="width: 100%; border-collapse: collapse; background-color: #f8fafc; border-top: 2px solid #102a63; border-bottom: 2px solid #102a63;">
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 6px 8px; font-size: 10px; font-weight: bold; color: #dc2626; text-transform: uppercase;">DISPATCH CHARGES</td>
                      <td style="padding: 6px 8px; font-size: 12px; font-weight: bold; text-align: right; color: #dc2626; white-space: nowrap;">${formatCurrency(dispatchTotal)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 6px 8px; font-size: 10px; font-weight: bold; color: #dc2626; text-transform: uppercase;">GRAND TOTAL</td>
                      <td style="padding: 6px 8px; font-size: 14px; font-weight: bold; text-align: right; color: #0f2962; white-space: nowrap;">${formatCurrency(invoice.grandTotal)}</td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding: 8px 8px 2px 8px; font-size: 10px; font-weight: bold; color: #dc2626; text-transform: uppercase;">DEPOSIT DETAILS</td>
                    </tr>
                    ${
                      eTransferAddress
                        ? `
                    <tr>
                      <td colspan="2" style="padding: 2px 8px 4px 12px; font-size: 10px; color: #dc2626;">
                        <span style="font-weight: bold;">E-TRANSFER:</span> <span style="color: #475569; font-weight: bold;">${eTransferAddress}</span>
                      </td>
                    </tr>
                    `
                        : ""
                    }
                    ${
                      invoice.accountNumber
                        ? `
                    <tr>
                      <td colspan="2" style="padding: 2px 8px 6px 12px; font-size: 10px; color: #dc2626;">
                        <span style="font-weight: bold;">VOID CHEQUE:</span> <span style="color: #475569;">Inst: ${invoice.institutionNumber || "003"} | Transit: ${invoice.transitNumber || "115000"} | Acct: ${invoice.accountNumber}</span>
                      </td>
                    </tr>
                    `
                        : ""
                    }
                  </table>
                </td>
              </tr>
            </table>
          </div>

          <div class="footer-band">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="width: 55%; vertical-align: top;">
                  <h2 class="footer-brand">XCDGOC PVT LTD</h2>
                  <div class="footer-left-copy">
                    XCDGOC PVT LTD<br/>
                    <span style="font-size: 9px; font-weight: 800; color: #0f2962;">WE ARE CANADA'S LEADING AND LARGEST DISPATCH SERVICES PROVIDERS</span>
                  </div>
                </td>
                <td style="width: 45%; vertical-align: top;">
                  <div class="footer-right-copy" style="font-size: 8px; line-height: 1.15;">
                    Open Board, Bison, Walmart, Load Link<br/>
                    and Non Amazon Dispatch Solutions<br/><br/>
                    <b>Contact:</b> <span style="color: #dc2626; font-weight: bold;">BUSINESS HEAD SHAHID UL ISLAM</span><br/>
                    EXTREME CANADA DISPATCH GROUP OF COMPANIES<br/>
                    DIN 11644512<br/>
                    TAN AMRX10063E<br/>
                    CIN U52241JK20260PC018999<br/>
                    business@xcdgocpvtltd.com<br/>
                    xcdgocpvtltd@gmail.com<br/>
                    +1 519 191 0142<br/>
                    +91 750 121 6555
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
