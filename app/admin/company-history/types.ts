export interface CompanyHistoryInvoiceTrip {
  driverName?: string;
  vrid?: string;
  loadId1?: string;
  loadId2?: string;
  totalCharges?: number;
  dispatchPercentage?: number;
  dispatchAmount?: number;
  route?: string;
  pickup?: string;
  drop?: string;
}

export interface CompanyHistoryInvoice {
  payeeName?: string;
  payeeEmail?: string;
  payToName?: string;
  vendorName?: string;
  payToAccountName?: string;
  carrierNeedToPay?: number;
  carrierNeedsToReceive?: number;
  _id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  grandTotal: number;
  customer?: {
    customerName?: string;
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  payee?: {
    companyName?: string;
    payeeSelectKey?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  paymentStatus?: string;
  isPaid?: boolean;
  createdAt: string;
  invoiceDate?: string;
  trips?: CompanyHistoryInvoiceTrip[];
}
