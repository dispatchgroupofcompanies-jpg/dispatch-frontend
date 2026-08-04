export interface Load {
  vrid: string;
  load1Id: string;
  load2Id?: string;
  tripCharges: number;
  dispatcher: string;
  driverName: string;
  dispatchCharges: number;
  tonu: boolean;
  date: string;
  mgCharges: number;
}

export interface LoadBoardRecord {
  _id?: string;
  carrierName: string;
  thirdPartyCarrierName: string;
  date: string;
  mgCharges: number;
  vrid: string;
  legs: number;
  load1Id: string;
  load2Id?: string;
  pickupTime: string;
  deliveryTime: string;
  tripCharges: number;
  dispatcher: string;
  dispatchCharges: number;
  driverName: string;
  tonu: boolean;
  status: "active" | "cancelled";
  invoiceStatus: "generated" | "pending";
  paymentStatus: "paid" | "pending";
  screenshotUrl?: string;
  screenshotPublicId?: string;
  createdAt?: string;
  loads?: Load[];
}
