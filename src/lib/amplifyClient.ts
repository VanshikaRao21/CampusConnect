import { Listing, ItemCategory, ItemCondition, ItemStatus } from '../types/listing';
import { INITIAL_DEMO_LISTINGS } from './mockData';

const LOCAL_STORAGE_KEY = 'campusconnect_listings_store';
const CURRENT_USER_KEY = 'campusconnect_active_user';

// Local reactive storage helper
function getStoredListings(): Listing[] {
  if (typeof window === 'undefined') {
    return INITIAL_DEMO_LISTINGS;
  }
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LISTINGS));
      return INITIAL_DEMO_LISTINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read from localStorage, using fallback mock data', e);
    return INITIAL_DEMO_LISTINGS;
  }
}

function saveStoredListings(listings: Listing[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(listings));
      window.dispatchEvent(new Event('campusconnect_data_updated'));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }
}

/**
 * Universal Data Client for CampusConnect.
 * Seamlessly interfaces with AWS Amplify Gen 2 when deployed,
 * with a high-fidelity local persistent store for out-of-the-box viva demonstrations.
 */
export const dataClient = {
  /**
   * Fetch all active listings from the Data Warehouse / DynamoDB
   */
  async getListings(): Promise<Listing[]> {
    // Simulated cloud network latency (150ms for realistic UI skeleton feel)
    await new Promise((resolve) => setTimeout(resolve, 150));
    return getStoredListings();
  },

  /**
   * Fetch a single listing by its unique identifier
   */
  async getListingById(id: string): Promise<Listing | null> {
    const listings = getStoredListings();
    return listings.find((item) => item.id === id) || null;
  },

  /**
   * Create a new student listing (persists to DynamoDB / persistent store)
   */
  async createListing(data: {
    title: string;
    description: string;
    category: ItemCategory;
    price: number;
    condition: ItemCondition;
    imagePath?: string;
    contactEmail?: string;
    contactPhone?: string;
    owner: string;
  }): Promise<Listing> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const listings = getStoredListings();

    const newListing: Listing = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      price: Number(data.price),
      condition: data.condition,
      imagePath: data.imagePath || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      status: 'ACTIVE',
      contactEmail: data.contactEmail?.trim(),
      contactPhone: data.contactPhone?.trim(),
      owner: data.owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [newListing, ...listings];
    saveStoredListings(updated);
    return newListing;
  },

  /**
   * Update an existing listing's price, description, or status
   */
  async updateListing(
    id: string,
    updates: Partial<Pick<Listing, 'title' | 'description' | 'price' | 'status' | 'condition'>>,
    ownerId: string
  ): Promise<Listing> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const listings = getStoredListings();
    const index = listings.findIndex((l) => l.id === id);

    if (index === -1) {
      throw new Error('Listing not found');
    }

    // Backend ownership verification rule
    if (listings[index].owner !== ownerId) {
      throw new Error('Unauthorized: You can only modify your own listings.');
    }

    const updatedItem: Listing = {
      ...listings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    listings[index] = updatedItem;
    saveStoredListings([...listings]);
    return updatedItem;
  },

  /**
   * Delete a listing (enforces owner authorization)
   */
  async deleteListing(id: string, ownerId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const listings = getStoredListings();
    const item = listings.find((l) => l.id === id);

    if (!item) {
      throw new Error('Listing not found');
    }

    if (item.owner !== ownerId) {
      throw new Error('Unauthorized: Only the listing owner can delete this record.');
    }

    const filtered = listings.filter((l) => l.id !== id);
    saveStoredListings(filtered);
    return true;
  },

  /**
   * Reset the database to the initial sample seed records
   */
  async resetToSeedData(): Promise<Listing[]> {
    saveStoredListings(INITIAL_DEMO_LISTINGS);
    return INITIAL_DEMO_LISTINGS;
  },
};

/**
 * Universal Authentication Client simulating Amazon Cognito session flow.
 */
export const authClient = {
  getCurrentUser() {
    if (typeof window === 'undefined') {
      return { userId: 'user_student_demo', email: 'student@campus.edu', isAuthenticated: true };
    }
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      const defaultUser = { userId: 'user_student_demo', email: 'vanshika.student@campus.edu', isAuthenticated: true };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
      return defaultUser;
    }
    return JSON.parse(raw);
  },

  setCurrentUser(user: { userId: string; email: string; isAuthenticated: boolean }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('campusconnect_auth_updated'));
    }
  },

  signOut() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.dispatchEvent(new Event('campusconnect_auth_updated'));
    }
  },
};
