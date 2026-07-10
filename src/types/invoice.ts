export interface Trip {
  pickup: string;
  drop: string;
  route?: string;
  totalCharges: number;
  tripDate?: string;
  vrid?: string;
  dispatchPercent?: number;
  dispatchAmount?: number;
  loadId1?: string;
  loadId2?: string;
  driverName?: string;
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
  institutionNumber?: string;
  eTransfer?: string;
  eTransferAddress?: string;
}

export interface Invoice {
  message?: string;
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
  carrierNeedToPay?: number;
  carrierNeedsToReceive?: number;
  createdByUser?: {
    name: string;
    email: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Appointment {
  _id: string;
  tripNumber: string;
  loadConfirmationNumber: string;
  shipmentNumber: string;
  carrierName: string;
  carrierAddress: string;
  carrierPhone: string;
  carrierEmail: string;
  equipmentType: string;
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTime: string;
  pickupNumber: string;
  dropOffNumber: string;
  commodityDescription: string;
  weight: number;
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperProvince: string;
  shipperPostalCode: string;
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeProvince: string;
  consigneePostalCode: string;
  chargeDescription: string;
  rateAmount: number;
  totalAmount: number;
  currency: string;
  signature: string;
  signatureDate: string;
  carrierProNumber: string;
  driverCellNumber: string;
  notesTerms: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdByUser?: {
    name: string;
    email: string;
  };
}
