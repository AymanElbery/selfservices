/**
 * Development Environment Configuration
 *
 * Used for local development and testing.
 */

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  enableAuth: false, // Disable Keycloak for local development
  apiUrl: 'http://localhost:3000/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'selfservices-dev',
    clientId: 'selfservices-app-dev',
  },
};
