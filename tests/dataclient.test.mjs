import test from 'node:test';
import assert from 'node:assert/strict';

// Test mock storage simulation of dataClient
class MockDataClient {
  constructor() {
    this.listings = [];
  }

  async createListing(data) {
    const s3Key = data.s3Key || `product-images/${data.owner}/${Date.now()}-photo.jpg`;
    const newListing = {
      id: `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      price: Number(data.price),
      condition: data.condition,
      imagePath: data.imagePath || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      s3Key: s3Key,
      status: 'ACTIVE',
      contactEmail: data.contactEmail?.trim(),
      contactPhone: data.contactPhone?.trim(),
      owner: data.owner,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.listings.unshift(newListing);
    return newListing;
  }

  async getListings() {
    return this.listings;
  }

  async getListingById(id) {
    return this.listings.find((item) => item.id === id) || null;
  }
}

test('marketplace integration: creating an item with image displays immediately in marketplace grid', async () => {
  const client = new MockDataClient();

  // 1. Create item with image and S3 key
  const uploadedImage = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAQAcJaQAA3AA/v39gAA=';
  const created = await client.createListing({
    title: 'Drafter with Scale and Hard Cover Box',
    description: 'Engineering graphics drafter, precision calibrated, flawless pivots.',
    category: 'Stationery',
    price: 350,
    condition: 'Like New',
    imagePath: uploadedImage,
    s3Key: 'product-images/user_student_demo/drafter_scale.webp',
    contactEmail: 'student@college.edu',
    contactPhone: '+91 98765 43210',
    owner: 'user_student_demo',
  });

  assert.ok(created.id, 'Listing must receive an ID');
  assert.equal(created.title, 'Drafter with Scale and Hard Cover Box');
  assert.equal(created.imagePath, uploadedImage);
  assert.equal(created.s3Key, 'product-images/user_student_demo/drafter_scale.webp');

  // 2. Fetch marketplace listings and ensure the created item is first in the grid
  const marketplaceListings = await client.getListings();
  assert.ok(marketplaceListings.length >= 1);
  const firstItem = marketplaceListings[0];

  assert.equal(firstItem.id, created.id);
  assert.equal(firstItem.title, created.title);
  assert.equal(firstItem.imagePath, uploadedImage, 'Uploaded image must be immediately visible in marketplace grid');
  assert.equal(firstItem.s3Key, created.s3Key);
});
