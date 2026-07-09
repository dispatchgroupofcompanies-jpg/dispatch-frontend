export interface Load {
  tripNumber: string;
  loadConfirmationNumber: string;
  shipmentNumber: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  cancelledAt?: Date;
}

export interface CarrierInfo {
  carrierName: string;
  carrierAddress: string;
  carrierPhone: string;
  carrierEmail: string;
  equipmentType: string;
  carrierProNumber: string;
  driverCellNumber: string;
}

export interface ShipmentSchedule {
  pickupDate: string;
  pickupTimeStart: string;
  pickupTimeEnd: string;
  deliveryDate: string;
  deliveryTime: string;
  pickupNumber: string;
  dropOffNumber: string;
}

export interface LocationInfo {
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
}

export interface ChargesInfo {
  chargeDescription: string;
  rateAmount: number;
  totalAmount: number;
  currency: string;
  commodityDescription: string;
  weight: number;
}

export interface Appointment {
  _id: string;
  userId?: string;
  loads: Load[];
  carrierInfo: CarrierInfo;
  shipmentSchedule: ShipmentSchedule;
  locationInfo: LocationInfo;
  chargesInfo: ChargesInfo;
  signature: string;
  signatureDate: string;
  notesTerms: string;
  status: string;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
