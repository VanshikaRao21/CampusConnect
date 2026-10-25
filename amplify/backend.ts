import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';

/**
 * CampusConnect AWS Amplify Gen 2 Unified Cloud Backend.
 * Integrates:
 * - Amazon Cognito (Authentication)
 * - AWS AppSync + Amazon DynamoDB (GraphQL Data Layer)
 * - Amazon S3 (Media Storage for Product Images)
 */
export const backend = defineBackend({
  auth,
  data,
  storage,
});
