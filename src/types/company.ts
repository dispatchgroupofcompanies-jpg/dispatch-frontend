export interface CompanyProfile {
  _id?: string;
  companyName?: string;
  carrierIdentifier?: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  province?: string;
  nsc?: string;
  ifta?: string;
  [key: string]: unknown;
}
