export interface TripForm {
  tripDate?: Date | string | null;
  vrid?: string;
  route?: string;
  pickup?: string;
  drop?: string;
  totalCharges?: number;
  dispatchPercent?: number;
  loadId1?: string;
  loadId2?: string;
  driverName?: string;
}

export interface InvoiceFormValues {
  invoiceType?: string;
  currency?: string;
  trips?: TripForm[];
  invoicePeriod?: [Date, Date] | null;
  subtotal?: number;
  tax?: number;
  grandTotal?: number;
  payee?: Record<string, unknown>;
  [key: string]: unknown;
}
