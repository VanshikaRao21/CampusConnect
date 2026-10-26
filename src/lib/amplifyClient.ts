import { Listing, ItemCategory, ItemCondition, ItemStatus } from '../types/listing';
import { INITIAL_DEMO_LISTINGS } from './mockData';

// Dynamic lazy loader for AWS Amplify packages
async function loadAmplify() {
  try {
    const [core, auth, data] = await Promise.all([
      import('aws-amplify'),
      import('aws-amplify/auth'),
      import('aws-amplify/data'),
    ]);
    return {
      Amplify: core.Amplify,
      auth,
      data,
    };
  } catch (err) {
    return null;
  }
}

let authConfigured = false;
let outputsPromise: Promise<boolean> | undefined;

async function ensureAmplifyConfigured(): Promise<boolean> {
  if (authConfigured) return true;
  if (!outputsPromise) outputsPromise = (async () => {
    try {
      const aws = await loadAmplify();
      if (!aws) return false;

      const poolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
      const clientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;
      if (poolId && clientId) {
        aws.Amplify.configure({ Auth: { Cognito: { userPoolId: poolId, userPoolClientId: clientId } } });
        authConfigured = true;
        return true;
      }

      const response = await fetch('/amplify_outputs.json');
      if (!response.ok) return false;
      aws.Amplify.configure(await response.json(), { ssr: true });
      authConfigured = true;
      return true;
    } catch {
      return false;
    }
  })();
  return outputsPromise;
}

let cloudClientPromise: Promise<any | null> | undefined;
async function getCloudClient(): Promise<any | null> {
  if (process.env.NEXT_PUBLIC_DATA_MODE === 'local') return null;
  if (!cloudClientPromise) cloudClientPromise = (async () => {
    try {
      const isConfigured = await ensureAmplifyConfigured();
      if (!isConfigured) return null;
      const aws = await loadAmplify();
      if (!aws) return null;
      return aws.data.generateClient();
    } catch {
      return null;
    }
  })();
  return cloudClientPromise;
}

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
    const cloud = await getCloudClient();
    if (cloud) {
      const { data, errors } = await cloud.models.Listing.list();
      if (errors?.length) throw new Error(errors[0].message);
      return (data || []).map((item: any) => ({ ...item, id: item.id, imagePath: item.imagePath || '', status: item.status || 'ACTIVE' }));
    }
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
    s3Key?: string;
    contactEmail?: string;
    contactPhone?: string;
    owner: string;
  }): Promise<Listing> {
    const activeUser = authClient.getCurrentUser();
    if (!activeUser.isAuthenticated || activeUser.userId !== data.owner) {
      throw new Error('Sign in as the listing owner before creating a listing.');
    }
    const cloud = await getCloudClient();
    if (cloud) {
      const { data: created, errors } = await cloud.models.Listing.create(data);
      if (errors?.length || !created) throw new Error(errors?.[0]?.message || 'Could not create listing');
      return { ...created, imagePath: created.imagePath || '', status: created.status || 'ACTIVE' } as Listing;
    }
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
      s3Key: data.s3Key || `product-images/${data.owner}/${Date.now()}-photo.jpg`,
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
    const cloud = await getCloudClient();
    if (cloud) {
      const { data: existing, errors: readErrors } = await cloud.models.Listing.get({ id });
      if (readErrors?.length || !existing) throw new Error(readErrors?.[0]?.message || 'Listing not found');
      if (existing.owner !== ownerId) throw new Error('Unauthorized: You can only modify your own listings.');
      const { data: updated, errors } = await cloud.models.Listing.update({ id, ...updates });
      if (errors?.length || !updated) throw new Error(errors?.[0]?.message || 'Could not update listing');
      window.dispatchEvent(new Event('campusconnect_data_updated'));
      return { ...updated, imagePath: updated.imagePath || '', status: updated.status || 'ACTIVE' } as Listing;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    const listings = getStoredListings();
    const index = listings.findIndex((l) => l.id === id);

    if (index === -1) {
      throw new Error('Listing not found');
    }

    // Backend ownership verification rule
    const activeUser = authClient.getCurrentUser();
    if (!activeUser.isAuthenticated || activeUser.userId !== ownerId || listings[index].owner !== ownerId) {
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

  async getListingsByOwner(ownerId: string): Promise<Listing[]> {
    return (await this.getListings()).filter((listing) => listing.owner === ownerId);
  },

  /**
   * Delete a listing (enforces owner authorization)
   */
  async deleteListing(id: string, ownerId: string): Promise<boolean> {
    const cloud = await getCloudClient();
    if (cloud) {
      const { data: existing, errors: readErrors } = await cloud.models.Listing.get({ id });
      if (readErrors?.length || !existing) throw new Error(readErrors?.[0]?.message || 'Listing not found');
      if (existing.owner !== ownerId) throw new Error('Unauthorized: Only the listing owner can delete this record.');
      const { errors } = await cloud.models.Listing.delete({ id });
      if (errors?.length) throw new Error(errors[0].message);
      window.dispatchEvent(new Event('campusconnect_data_updated'));
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
    const listings = getStoredListings();
    const item = listings.find((l) => l.id === id);

    if (!item) {
      throw new Error('Listing not found');
    }

    const activeUser = authClient.getCurrentUser();
    if (!activeUser.isAuthenticated || activeUser.userId !== ownerId || item.owner !== ownerId) {
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
    if (typeof window === 'undefined') return { userId: '', email: '', isAuthenticated: false };
    try {
      const raw = localStorage.getItem(CURRENT_USER_KEY);
      return raw ? JSON.parse(raw) : { userId: 'user_student_demo', email: 'student@college.edu', isAuthenticated: true };
    } catch {
      return { userId: 'user_student_demo', email: 'student@college.edu', isAuthenticated: true };
    }
  },

  async restoreSession() {
    if (typeof window === 'undefined') return this.getCurrentUser();
    if (!(await ensureAmplifyConfigured())) return this.getCurrentUser();
    try {
      const aws = await loadAmplify();
      if (!aws) return this.getCurrentUser();
      const [user, session] = await Promise.all([
        aws.auth.getCurrentUser(),
        aws.auth.fetchAuthSession()
      ]);
      if (!session.tokens) throw new Error('No active session');
      const email = user.signInDetails?.loginId || '';
      const restored = { userId: user.userId, email, isAuthenticated: true };
      this.setCurrentUser(restored);
      return restored;
    } catch {
      this.signOutLocal();
      return this.getCurrentUser();
    }
  },

  async signIn(email: string, password: string) {
    if (!(await ensureAmplifyConfigured())) {
      const user = { userId: `user_${email.split('@')[0]}`, email, isAuthenticated: true };
      this.setCurrentUser(user);
      return { isSignedIn: true, nextStep: { signInStep: 'DONE' } };
    }
    const aws = await loadAmplify();
    const result = await aws.auth.signIn({ username: email, password });
    if (result.isSignedIn) await this.restoreSession();
    return result;
  },

  async signUp(email: string, password: string) {
    if (!(await ensureAmplifyConfigured())) {
      const user = { userId: `user_${email.split('@')[0]}`, email, isAuthenticated: true };
      this.setCurrentUser(user);
      return { isSignUpComplete: true, nextStep: { signUpStep: 'DONE' } };
    }
    const aws = await loadAmplify();
    return aws.auth.signUp({ username: email, password, options: { userAttributes: { email } } });
  },

  async confirmSignUp(email: string, code: string) {
    if (!(await ensureAmplifyConfigured())) return { isSignUpComplete: true };
    const aws = await loadAmplify();
    return aws.auth.confirmSignUp({ username: email, confirmationCode: code });
  },

  setCurrentUser(user: { userId: string; email: string; isAuthenticated: boolean }) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('campusconnect_auth_updated'));
    }
  },

  signOutLocal() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_USER_KEY);
      window.dispatchEvent(new Event('campusconnect_auth_updated'));
    }
  },

  async signOut() {
    try {
      if (authConfigured) {
        const aws = await loadAmplify();
        if (aws) await aws.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out note:', e);
    }
    this.signOutLocal();
  },
};
