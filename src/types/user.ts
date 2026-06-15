export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  clerkId?: string;
  name: string | null;
  email: string;
  phone: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  passportNumber: string | null;
  role: UserRole;
  createdAt: string;
}

export interface TravelPreference {
  type: string;
  budget: string;
  groupSize: string;
  preferredDestinations: string[];
}

export interface AdminUser {
  id: string;
  clerkId: string;
  name: string | null;
  email: string;
  phone: string | null;
  role: UserRole;
  bookingsCount: number;
  createdAt: string;
  banned: boolean;
}
