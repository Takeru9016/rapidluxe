export type Continent =
  | "ASIA"
  | "EUROPE"
  | "AFRICA"
  | "AMERICAS"
  | "MIDDLE_EAST"
  | "OCEANIA";

export type VisaType =
  | "VISA_FREE"
  | "VISA_ON_ARRIVAL"
  | "E_VISA"
  | "VISA_REQUIRED";

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: Continent;
  description?: string;
  imageUrl?: string;
  bestTimeFrom?: string;
  bestTimeTo?: string;
  visaType?: VisaType;
  currency?: string;
  language?: string;
  createdAt: Date;
}
