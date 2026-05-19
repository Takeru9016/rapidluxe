export type UserRole = "USER" | "ADMIN";

export interface UserProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface TravelPreference {
  type: string;
  budget: string;
  groupSize: string;
  preferredDestinations: string[];
}
