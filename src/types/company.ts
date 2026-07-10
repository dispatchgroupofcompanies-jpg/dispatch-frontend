export interface CompanyProfile {
  _id?: string;
  companyName?: string;
  carrierIdentifier?: string;
  email?: string;
  eTransfer?: string;
  countryCode?: string;
  phone?: string;
  province?: string;
  nsc?: string;
  gstHst?: string;
  institutionNumber?: string;
  ifta?: string;
  [key: string]: unknown;
}
