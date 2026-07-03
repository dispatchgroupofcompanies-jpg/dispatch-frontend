export interface Trip {
  pickup: string;
  drop: string;
  route?: string;
  totalCharges: number;
  tripDate?: string;
  vrid?: string;
  dispatchPercent?: number;
  dispatchAmount?: number;
}

export interface Party {
  companyName: string;
  contactPerson?: string;
  customerName?: string;
  driverName?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address?: string;
  gstNumber?: string;
  eTransfer?: string;
  eTransferAddress?: string;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  invoiceStatus: string;
  invoiceType?: string;
  currency?: string;
  subtotal?: number;
  tax?: number;
  grandTotal: number;
  createdAt: string;
  pdfUrl?: string;
  invoicePeriod?: {
    startDate: string;
    endDate: string;
  };
  transitNumber?: string;
  institutionNumber?: string;
  accountNumber?: string;
  eTransfer?: string;
  notes?: string;
  payee?: Party;
  customer?: Party;
  trips?: Trip[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
