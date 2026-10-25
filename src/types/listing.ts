export type ItemCategory =
  | 'Textbooks'
  | 'Calculators'
  | 'Lab Equipment'
  | 'Stationery'
  | 'Accessories'
  | 'Other';

export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair';

export type ItemStatus = 'ACTIVE' | 'SOLD' | 'RESERVED' | 'INACTIVE';

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  price: number;
  condition: ItemCondition;
  imagePath: string;
  s3Key?: string;
  status: ItemStatus;
  contactEmail?: string;
  contactPhone?: string;
  owner: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-asc' | 'price-desc';
}

export interface AuthUser {
  userId: string;
  email: string;
  username?: string;
  isAuthenticated: boolean;
}
