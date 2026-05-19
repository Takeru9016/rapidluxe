export interface Review {
  id: string;
  packageId: string;
  userId: string;
  rating: number;
  title?: string;
  body: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
}
