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
  createdAt?: string;
}
