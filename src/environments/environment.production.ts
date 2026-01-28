/**
 * Production Environment Configuration
 *
 * Live production environment settings.
 */

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: true,
  enableAuth: true, // Enable Keycloak for production
  apiUrl: 'https://api.example.com/api',
  keycloak: {
    url: 'https://keycloak.example.com',
    realm: 'selfservices',
    clientId: 'selfservices-app',
  },
};
