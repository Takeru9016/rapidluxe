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

export type CrowdLevel = "LOW" | "MEDIUM" | "HIGH";
export type AvailabilityStatus = "Open" | "Closed" | "Limited";
export type VisitRecommendation = "Recommended" | "Not recommended";
export type TransportType =
  | "Bus"
  | "Metro"
  | "Train"
  | "Car"
  | "Taxi"
  | "Walking"
  | "Shuttle"
  | "Ferry"
  | "Cable Car";

export interface WhenToVisitMonth {
  month: string;
  crowdLevel: CrowdLevel;
  weather: string;
  availability: AvailabilityStatus;
  recommendation: VisitRecommendation;
}

export interface TransportOption {
  name: string;
  type: TransportType;
  description: string;
  isRecommended?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  continent: Continent;
  description?: string;
  imageUrl?: string;
  images?: string[];
  bestTimeFrom?: string;
  bestTimeTo?: string;
  visaType?: VisaType;
  currency?: string;
  language?: string;
  whenToVisit?: WhenToVisitMonth[];
  howToGetThere?: TransportOption[];
  createdAt: Date;
}
