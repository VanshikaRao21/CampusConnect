import { defineStorage } from '@aws-amplify/backend';

/**
 * Amazon S3 Storage definition using Amplify Gen 2.
 * Stores product photos uploaded by college students.
 *
 * Security:
 * - Authenticated students can upload product photos to their own folder.
 * - Public guests can view/read product photos so they render on marketplace cards.
 */
export const storage = defineStorage({
  name: 'campusConnectMedia',
  access: (allow) => ({
    'product-images/{entity_id}/*': [
      allow.entity('identity').to(['read', 'write', 'delete']),
      allow.authenticated.to(['read']),
      allow.guest.to(['read']),
    ],
    'public/*': [
      allow.authenticated.to(['read', 'write']),
      allow.guest.to(['read']),
    ],
  }),
});
