import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * AWS AppSync & Amazon DynamoDB Data schema definition using Amplify Gen 2.
 * The Listing model represents second-hand student academic items.
 *
 * Security & Authorization:
 * - Guests and authenticated students can read active listings.
 * - Authenticated users can create listings, which automatically assigns them as the owner.
 * - Only the verified owner can edit, mark as sold, or delete their listing.
 */
const schema = a.schema({
  Listing: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      category: a.string().required(), // Textbooks, Calculators, Lab Equipment, Stationery, Accessories, Other
      price: a.float().required(),     // Price in INR (₹)
      condition: a.string().required(), // New, Like New, Good, Fair
      imagePath: a.string(),           // Amazon S3 object key or public URL
      status: a.string().default('ACTIVE'), // ACTIVE, SOLD, RESERVED, INACTIVE
      contactEmail: a.string(),
      contactPhone: a.string(),
      owner: a.string(),               // Cognito identity of listing owner
    })
    .authorization((allow) => [
      // Anyone can browse listings in the public marketplace
      allow.guest().to(['read']),
      allow.authenticated().to(['read']),
      // Authenticated owners have full CRUD on their listings
      allow.ownerDefinedIn('owner').identityClaim('sub'),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
