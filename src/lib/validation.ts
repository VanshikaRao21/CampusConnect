import { ItemCategory, ItemCondition } from '../types/listing';

export const VALID_CATEGORIES: ItemCategory[] = [
  'Textbooks',
  'Calculators',
  'Lab Equipment',
  'Stationery',
  'Accessories',
  'Other',
];

export const VALID_CONDITIONS: ItemCondition[] = ['New', 'Like New', 'Good', 'Fair'];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateListingInput(input: {
  title?: string;
  description?: string;
  category?: string;
  price?: number | string;
  condition?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  // Title validation
  if (!input.title || input.title.trim().length === 0) {
    errors.title = 'Item title is required.';
  } else if (input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  } else if (input.title.trim().length > 100) {
    errors.title = 'Title cannot exceed 100 characters.';
  }

  // Description validation
  if (!input.description || input.description.trim().length === 0) {
    errors.description = 'Item description is required.';
  } else if (input.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long.';
  } else if (input.description.trim().length > 1500) {
    errors.description = 'Description cannot exceed 1500 characters.';
  }

  // Category validation
  if (!input.category || !VALID_CATEGORIES.includes(input.category as ItemCategory)) {
    errors.category = `Please select a valid category (${VALID_CATEGORIES.join(', ')}).`;
  }

  // Price validation (INR)
  const numericPrice = typeof input.price === 'string' ? parseFloat(input.price) : input.price;
  if (numericPrice === undefined || isNaN(numericPrice)) {
    errors.price = 'Please enter a valid price.';
  } else if (numericPrice < 0) {
    errors.price = 'Price cannot be negative.';
  } else if (numericPrice > 100000) {
    errors.price = 'Price exceeds maximum allowed limit (₹1,00,000).';
  }

  // Condition validation
  if (!input.condition || !VALID_CONDITIONS.includes(input.condition as ItemCondition)) {
    errors.condition = `Please select a valid condition (${VALID_CONDITIONS.join(', ')}).`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateImage(type: string, size: number): { isValid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(type)) {
    return { isValid: false, error: 'Invalid format' };
  }
  if (size > MAX_IMAGE_SIZE_BYTES) {
    return { isValid: false, error: 'Exceeds 5MB' };
  }
  return { isValid: true };
}

export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file format. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'File size exceeds 5MB limit. Please choose a smaller image.',
    };
  }

  return { isValid: true };
}
