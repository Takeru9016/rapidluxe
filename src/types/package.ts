export type PackageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  meals: string[];
}

export interface Hotel {
  name: string;
  stars: number;
  location: string;
  imageUrl: string;
  included: boolean;
  description?: string;
}

export interface Activity {
  name: string;
  duration: string;
  included: boolean;
  description?: string;
  imageUrl?: string;
  price?: number;
}

export interface CancellationPolicy {
  daysBeforeDeparture: number;
  refundPercent: number;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  description: string;
  destinationId: string;
  durationNights: number;
  pricePerPerson: number;
  originalPrice?: number;
  minGroupSize: number;
  maxGroupSize: number;
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryDay[];
  hotels: Hotel[];
  activities: Activity[];
  images: string[];
  tags: string[];
  cancellationPolicy?: CancellationPolicy[];
  isFeatured: boolean;
  includesFlights: boolean;
  status: PackageStatus;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}
