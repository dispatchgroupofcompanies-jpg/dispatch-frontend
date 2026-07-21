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
  carrierNeedToPay?: number;
  carrierNeedsToReceive?: number;
  _id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  grandTotal: number;
  customer?: {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  payee?: {
    companyName?: string;
    contactPerson?: string;
    phone?: string;
    email?: string;
  };
  createdAt: string;
  invoiceDate?: string;
  trips?: CompanyHistoryInvoiceTrip[];
}
