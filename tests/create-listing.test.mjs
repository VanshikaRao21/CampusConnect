import test from 'node:test';
import assert from 'node:assert/strict';

// Test constants
const VALID_CATEGORIES = [
  'Textbooks',
  'Calculators',
  'Lab Equipment',
  'Stationery',
  'Accessories',
  'Other',
];
const VALID_CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function validateListingInput(input) {
  const errors = {};

  if (!input.title || input.title.trim().length === 0) {
    errors.title = 'Item title is required.';
  } else if (input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (input.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters.';
  }

  if (!input.description || input.description.trim().length === 0) {
    errors.description = 'Item description is required.';
  } else if (input.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long.';
  } else if (input.description.trim().length > 1500) {
    errors.description = 'Description cannot exceed 1500 characters.';
  }

  if (!input.category || !VALID_CATEGORIES.includes(input.category)) {
    errors.category = 'Invalid category';
  }

  const numericPrice = typeof input.price === 'string' ? parseFloat(input.price) : input.price;
  if (numericPrice === undefined || isNaN(numericPrice)) {
    errors.price = 'Please enter a valid price.';
  } else if (numericPrice < 0) {
    errors.price = 'Price cannot be negative.';
  } else if (numericPrice > 100000) {
    errors.price = 'Price exceeds maximum allowed limit.';
  }

  if (!input.condition || !VALID_CONDITIONS.includes(input.condition)) {
    errors.condition = 'Invalid condition';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateImage(type, size) {
  if (!ALLOWED_IMAGE_TYPES.includes(type)) {
    return { isValid: false, error: 'Invalid format' };
  }
  if (size > MAX_IMAGE_SIZE_BYTES) {
    return { isValid: false, error: 'Exceeds 5MB' };
  }
  return { isValid: true };
}

// Simulated data layer listing creation
function createMockListing(data) {
  const s3Key = data.s3Key || `product-images/${data.owner}/${Date.now()}-photo.jpg`;
  return {
    id: `item-${Date.now()}-test`,
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    price: Number(data.price),
    condition: data.condition,
    imagePath: data.imagePath,
    s3Key: s3Key,
    status: 'ACTIVE',
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone,
    owner: data.owner,
    createdAt: new Date().toISOString(),
  };
}

test('create listing flow: validates valid listing and links S3 image key', () => {
  const input = {
    title: 'Texas Instruments TI-84 Plus CE Graphing Calculator',
    description: 'Rechargeable battery, full color backlit display, pre-loaded apps for Calculus.',
    category: 'Calculators',
    price: 1850,
    condition: 'Like New',
    contactEmail: 'student@college.edu',
    contactPhone: '+91 98765 43210',
    owner: 'user_student_demo',
    imagePath: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...',
    s3Key: 'product-images/user_student_demo/ti84-calculator.jpg',
  };

  const validation = validateListingInput(input);
  assert.equal(validation.isValid, true);

  const imageValidation = validateImage('image/jpeg', 2.4 * 1024 * 1024);
  assert.equal(imageValidation.isValid, true);

  const listing = createMockListing(input);
  assert.ok(listing.id);
  assert.equal(listing.title, input.title);
  assert.equal(listing.s3Key, 'product-images/user_student_demo/ti84-calculator.jpg');
  assert.equal(listing.imagePath, input.imagePath);
  assert.equal(listing.status, 'ACTIVE');
});

test('create listing flow: rejects invalid image type or oversized file', () => {
  const oversizedResult = validateImage('image/jpeg', 6 * 1024 * 1024);
  assert.equal(oversizedResult.isValid, false);
  assert.equal(oversizedResult.error, 'Exceeds 5MB');

  const invalidTypeResult = validateImage('application/pdf', 1024);
  assert.equal(invalidTypeResult.isValid, false);
  assert.equal(invalidTypeResult.error, 'Invalid format');
});

test('create listing flow: rejects missing fields and negative price', () => {
  const invalidListing = validateListingInput({
    title: 'ab', // too short
    description: 'short', // too short
    category: 'FakeCategory',
    price: -50,
    condition: 'Unknown',
  });

  assert.equal(invalidListing.isValid, false);
  assert.ok(invalidListing.errors.title);
  assert.ok(invalidListing.errors.description);
  assert.ok(invalidListing.errors.category);
  assert.ok(invalidListing.errors.price);
  assert.ok(invalidListing.errors.condition);
});
