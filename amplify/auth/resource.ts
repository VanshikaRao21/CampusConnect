import { defineAuth } from '@aws-amplify/backend';

/**
 * Amazon Cognito Authentication definition using Amplify Gen 2.
 * Configured for email-based student signup, authentication, and session management.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: {
      required: false,
      mutable: true,
    },
  },
});
