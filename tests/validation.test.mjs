import test from 'node:test';
import assert from 'node:assert/strict';

// Validation logic directly tested
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

test('validateListingInput: accepts valid academic listing', () => {
  const result = validateListingInput({
    title: 'Advanced Engineering Mathematics by Erwin Kreyszig',
    description: '10th edition in like new condition with all chapters intact.',
    category: 'Textbooks',
    price: 450,
    condition: 'Like New',
  });

  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('validateListingInput: rejects negative price', () => {
  const result = validateListingInput({
    title: 'Casio fx-991EX Calculator',
    description: 'Scientific calculator for engineering exams.',
    category: 'Calculators',
    price: -150,
    condition: 'Good',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.price, 'Price cannot be negative.');
});

test('validateListingInput: rejects invalid category and condition', () => {
  const result = validateListingInput({
    title: 'Random Item',
    description: 'Some random description text.',
    category: 'InvalidCategory',
    price: 200,
    condition: 'Broken',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.category);
  assert.ok(result.errors.condition);
});

test('validateImage: accepts standard JPEG/PNG under 5MB', () => {
  assert.equal(validateImage('image/jpeg', 2 * 1024 * 1024).isValid, true);
  assert.equal(validateImage('image/png', 1 * 1024 * 1024).isValid, true);
  assert.equal(validateImage('image/webp', 500 * 1024).isValid, true);
});

test('validateImage: rejects oversized images and executable files', () => {
  assert.equal(validateImage('image/jpeg', 6 * 1024 * 1024).isValid, false);
  assert.equal(validateImage('application/octet-stream', 1000).isValid, false);
  assert.equal(validateImage('image/svg+xml', 1000).isValid, false);
});
