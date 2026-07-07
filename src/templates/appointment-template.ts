// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAppointmentTemplate = (appointment: any): string => {
  const getValue = (value: any, fallback = "N/A") => value || fallback;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pickupDateOpt = appointment.pickupDate
    ? formatDate(appointment.pickupDate)
    : "N/A";
  const deliveryDateOpt = appointment.deliveryDate
    ? formatDate(appointment.deliveryDate)
    : "N/A";
  const dateFormatted = formatDate(appointment.appointmentDate);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        @page {
          size: A4;
          margin: 15mm 15mm;
        }
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Segoe UI', Arial, sans-serif; 
          color: #1e293b;
          background-color: #ffffff;
          -webkit-print-color-adjust: exact;
          position: relative;
        }

        .page-container {
          padding: 25px; 
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 16px;
          font-weight: 900;
          color: rgba(100, 116, 139, 0.4);
          letter-spacing: 1.5px;
          white-space: normal;
          width: 80%;
          max-width: 600px;
          text-align: center;
          line-height: 1.6;
          z-index: 0;
          pointer-events: none;
        }

        .layout-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
        .section-header {
          margin: 12px 0 8px 0; 
          font-size: 12px; 
          text-transform: uppercase; 
          color: #0f172a; 
          border-bottom: 2px solid #cbd5e1; 
          padding-bottom: 4px; 
          letter-spacing: 0.5px;
          font-weight: 700;
        }
        .data-label { font-size: 11px; color: #64748b; font-weight: 600; padding: 4px 0; }
        .data-value { font-size: 11px; color: #1e293b; padding: 4px 0; }
        
        .routing-table { width: 100%; border-collapse: collapse; margin-bottom: 14px; border: 1px solid #e2e8f0; }
        .routing-table th { background-color: #f8fafc; padding: 6px 10px; font-size: 10px; color: #475569; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; text-align: left; }
        .routing-table td { padding: 8px 10px; font-size: 11px; border-bottom: 1px solid #e2e8f0; vertical-align: top; line-height: 1.35; }
        
        .financial-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px 12px; }
      </style>
    </head>
    <body>
      <div class="page-container">
        <div class="watermark">XCDGOC PVT LTD</div>

        <table class="layout-table" style="background-color: #0f172a; border-radius: 4px; margin-bottom: 14px;">
          <tr>
            <td style="padding: 16px 22px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">Confirmation Details</h1>
              <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 11px;">ID: #${getValue(appointment._id)}</p>
            </td>
            <td align="right" valign="bottom" style="padding: 16px 22px;">
              <p style="margin: 0; color: #cbd5e1; font-size: 11px; font-weight: 600;">Generated: ${new Date().toLocaleDateString("en-CA", { year: "numeric", month: "short", day: "numeric" })}</p>
            </td>
          </tr>
        </table>

        <table class="layout-table" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
          <tr>
            <td width="33%" style="padding: 12px 18px;">
              <strong style="display:block; font-size: 9px; color: #64748b; text-transform: uppercase; margin-bottom: 3px;">Trip Number</strong>
              <span style="font-size: 13px; font-weight: 600; color: #0f172a;">${getValue(appointment.tripNumber)}</span>
            </td>
            <td width="33%" style="padding: 12px 18px; border-left: 1px solid #e2e8f0;">
              <strong style="display:block; font-size: 9px; color: #64748b; text-transform: uppercase; margin-bottom: 3px;">Load Confirmation</strong>
              <span style="font-size: 13px; font-weight: 600; color: #0f172a;">${getValue(appointment.loadConfirmationNumber)}</span>
            </td>
            <td width="34%" style="padding: 12px 18px; border-left: 1px solid #e2e8f0;">
              <strong style="display:block; font-size: 9px; color: #64748b; text-transform: uppercase; margin-bottom: 3px;">Shipment Reference</strong>
              <span style="font-size: 13px; font-weight: 600; color: #0f172a;">${getValue(appointment.shipmentNumber)}</span>
            </td>
          </tr>
        </table>

        <h2 class="section-header">Carrier & Equipment Information</h2>
        <table class="layout-table">
          <tr>
            <td width="50%" valign="top" style="padding-right: 12px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="35%" class="data-label">Carrier Name:</td>
                  <td class="data-value"><b>${getValue(appointment.carrierName)}</b></td>
                </tr>
                <tr>
                  <td class="data-label">Phone:</td>
                  <td class="data-value">${getValue(appointment.carrierPhone)}</td>
                </tr>
                <tr>
                  <td class="data-label">Email:</td>
                  <td class="data-value" style="text-transform: lowercase;">${getValue(appointment.carrierEmail)}</td>
                </tr>
              </table>
            </td>
            <td width="50%" valign="top" style="padding-left: 12px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="40%" class="data-label">Equipment Type:</td>
                  <td class="data-value">${getValue(appointment.equipmentType)}</td>
                </tr>
                <tr>
                  <td class="data-label">Carrier Address:</td>
                  <td class="data-value" style="line-height: 1.4;">${getValue(appointment.carrierAddress)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <h2 class="section-header">Schedule & Routing</h2>
        <table class="routing-table">
          <tr>
            <th width="18%">Milestone</th>
            <th width="42%">Location Detail</th>
            <th width="25%">Schedule / Window</th>
            <th width="15%">Ref #</th>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #0284c7; padding: 10px;">O: PICKUP</td>
            <td style="padding: 10px;">
              <strong style="color: #0f172a;">${getValue(appointment.shipperName)}</strong><br>
              ${getValue(appointment.shipperAddress)}<br>
              ${getValue(appointment.shipperCity)}${appointment.shipperProvince ? ", " + appointment.shipperProvince : ""} ${getValue(appointment.shipperPostalCode)}
            </td>
            <td style="padding: 10px;">
              Date: ${getValue(pickupDateOpt)}<br>
              Time: ${getValue(appointment.pickupTimeStart)} - ${getValue(appointment.pickupTimeEnd)}
            </td>
            <td style="color: #475569; padding: 10px;">PU#: ${getValue(appointment.pickupNumber)}</td>
          </tr>
          <tr>
            <td style="font-weight: 600; color: #16a34a; padding: 10px; border-bottom: none;">D: DELIVERY</td>
            <td style="padding: 10px; border-bottom: none;">
              <strong style="color: #0f172a;">${getValue(appointment.consigneeName)}</strong><br>
              ${getValue(appointment.consigneeAddress)}<br>
              ${getValue(appointment.consigneeCity)}${appointment.consigneeProvince ? ", " + appointment.consigneeProvince : ""} ${getValue(appointment.consigneePostalCode)}
            </td>
            <td style="padding: 10px; border-bottom: none;">
              Date: ${getValue(deliveryDateOpt)}<br>
              Time: ${getValue(appointment.deliveryTime)}
            </td>
            <td style="color: #475569; padding: 10px; border-bottom: none;">Drop#: ${getValue(appointment.dropOffNumber)}</td>
          </tr>
        </table>

        <h2 class="section-header">Cargo & Financial Summary</h2>
        <table class="layout-table">
          <tr>
            <td width="55%" valign="top" style="padding-right: 12px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="data-label">Commodity:</td>
                  <td class="data-value">${getValue(appointment.commodityDescription)}</td>
                </tr>
                <tr>
                  <td class="data-label">Weight:</td>
                  <td class="data-value">${appointment.weight ? appointment.weight + " lbs" : "N/A"}</td>
                </tr>
                <tr>
                  <td class="data-label">Service Type:</td>
                  <td class="data-value">${getValue(appointment.serviceType)}</td>
                </tr>
              </table>
            </td>
            <td width="45%" valign="top">
              <div class="financial-box">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="font-size: 11px; color: #64748b; padding: 5px 0;">Description:</td>
                    <td align="right" style="font-size: 11px; color: #1e293b; font-weight: 500; padding: 5px 0;">${getValue(appointment.chargeDescription)}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 11px; color: #64748b; padding: 6px 0;">Base Rate:</td>
                    <td align="right" style="font-size: 11px; color: #1e293b; font-weight: 500; padding: 6px 0;">${appointment.rateAmount ? appointment.rateAmount.toFixed(2) : "0.00"}</td>
                  </tr>
                  <tr style="border-top: 1px solid #cbd5e1;">
                    <td style="font-size: 12px; font-weight: 700; color: #0f172a; padding: 7px 0 5px 0;">Total Due:</td>
                    <td align="right" style="font-size: 12px; font-weight: 700; color: #0f172a; padding: 7px 0 5px 0;">${appointment.totalAmount ? appointment.totalAmount.toFixed(2) : "0.00"} ${getValue(appointment.currency)}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>
        </table>

        <h2 class="section-header">Corporate Compliance Data</h2>
        <table class="layout-table">
          <tr>
            <td width="50%" valign="top" style="padding-right: 12px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td class="data-label">Driver Cell:</td>
                  <td class="data-value">${getValue(appointment.driverCellNumber)}</td>
                </tr>
                <tr>
                  <td class="data-label">Carrier Pro #:</td>
                  <td class="data-value">${getValue(appointment.carrierProNumber)}</td>
                </tr>
              </table>
            </td>
            <td width="50%" valign="top" style="padding-left: 12px;">
              <table width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td width="35%" class="data-label">NSC #:</td>
                  <td class="data-value">${getValue(appointment.nsc)}</td>
                </tr>
                <tr>
                  <td class="data-label">GST/HST:</td>
                  <td class="data-value">${getValue(appointment.gstHst)}</td>
                </tr>
                <tr>
                  <td class="data-label">QST:</td>
                  <td class="data-value">${getValue(appointment.qst)}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        ${
          appointment.notesTerms || appointment.notes
            ? `
        <div style="margin-top: 10px; padding: 10px 14px; background-color: #fafafa; border-left: 4px solid #64748b; font-size: 11px; line-height: 1.5; color: #475569; border-radius: 0 4px 4px 0;">
          <strong style="color: #0f172a; display: block; margin-bottom: 3px;">Special Instructions & Terms:</strong>
          ${appointment.notesTerms ? appointment.notesTerms : ""}
          ${appointment.notes ? "<br>" + appointment.notes : ""}
        </div>
        `
            : ""
        }

        <table class="layout-table" style="margin-top: 20px; padding-top: 12px; border-top: 1px solid #e2e8f0;">
          <tr>
            <td width="60%" valign="bottom">
              <span style="font-size: 10px; color: #64748b; display: block; margin-bottom: 2px;">Authorized Electronic Signature:</span>
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 14px; font-weight: bold; color: #0f172a; border-bottom: 1px dashed #94a3b8; padding-bottom: 2px; display: inline-block; margin-top: 4px;">
                ${getValue(appointment.signature, "Electronically Finalized Verification")}
              </span>
            </td>
            <td width="40%" align="right" valign="bottom">
              <span style="font-size: 10px; color: #64748b; display: block; margin-bottom: 2px;">Authorization Date:</span>
              <span style="font-size: 11px; color: #0f172a; font-weight: 600; display: block; margin-top: 4px;">
                ${appointment.signatureDate ? new Date(appointment.signatureDate).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }) : dateFormatted}
              </span>
            </td>
          </tr>
        </table>

        <div style="margin-top: 22px; padding-top: 12px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="margin: 0; font-size: 12px; font-weight: 600; color: #334155;">${getValue(appointment.companyName, "Dispatch Group")}</p>
          <p style="margin: 4px 0 0 0; font-size: 10px; color: #64748b;">
            ${appointment.addressLine1 ? appointment.addressLine1 : ""}${appointment.addressLine1 && appointment.addressLine2 ? " " : ""}${appointment.addressLine2 ? appointment.addressLine2 : ""}${appointment.addressLine2 && (appointment.city || appointment.province || appointment.state) ? ", " : ""}${appointment.city ? appointment.city : ""}${appointment.city && (appointment.province || appointment.state) ? ", " : ""}${appointment.province || appointment.state ? appointment.province || appointment.state : ""} ${appointment.postCode ? appointment.postCode : ""}
          </p>
          <p style="margin: 8px 0 0 0; font-size: 9px; color: #94a3b8;">© ${new Date().getFullYear()} Dispatch Group. Confidential Logistics Transmission.</p>
        </div>

      </div>
    </body>
    </html>
  `;
};

// Email-safe template for appointments (no @page, no position:fixed, no classes)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAppointmentEmailBody = (appointment: any): string => {
  const getValue = (value: any, fallback = "N/A") => value || fallback;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const pickupDateOpt = appointment.pickupDate
    ? formatDate(appointment.pickupDate)
    : "N/A";
  const deliveryDateOpt = appointment.deliveryDate
    ? formatDate(appointment.deliveryDate)
    : "N/A";

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto;">
      <tr>
        <td style="padding: 20px; background-color: #ffffff;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="text-align: right; padding-bottom: 15px; border-bottom: 2px solid #102a63;">
                <h1 style="margin: 0; font-size: 20px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">APPOINTMENT CONFIRMATION</h1>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">ID: #${getValue(appointment._id)}</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; margin-bottom: 20px;">
            <tr>
              <td style="padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0; font-size: 14px; line-height: 1.5; color: #1e293b;">Hello,</p>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #475569;">Please find attached your appointment confirmation document as a PDF.</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <h2 style="margin: 0 0 10px 0; font-size: 12px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Summary</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #475569; width: 50%;">Trip Number:</td>
                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; width: 50%; text-align: right;">${getValue(appointment.tripNumber)}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 6px 0; font-size: 13px; color: #475569;">Load Confirmation:</td>
                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${getValue(appointment.loadConfirmationNumber)}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 6px 0; font-size: 13px; color: #475569;">Carrier:</td>
                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${getValue(appointment.carrierName)}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 8px 0; font-size: 14px; font-weight: bold; color: #1e293b;">Total Amount:</td>
                    <td style="padding: 8px 0; font-size: 16px; font-weight: bold; color: #2563eb; text-align: right;">${appointment.totalAmount ? appointment.totalAmount.toFixed(2) : "0.00"} ${getValue(appointment.currency)}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
            <tr>
              <td style="padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                <h2 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.5px;">Schedule Information</h2>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #475569; width: 50%;">Pickup Date:</td>
                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; width: 50%; text-align: right;">${pickupDateOpt}</td>
                  </tr>
                  <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 6px 0; font-size: 13px; color: #475569;">Delivery Date:</td>
                    <td style="padding: 6px 0; font-size: 13px; color: #1e293b; font-weight: 600; text-align: right;">${deliveryDateOpt}</td>
                  </tr>
                </table>
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
        </td>
      </tr>
    </table>
  `;
};
