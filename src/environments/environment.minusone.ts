/**
 * Minus One (Staging) Environment Configuration
 *
 * Pre-production environment for final testing and validation.
 */

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  enableAuth: true, // Enable Keycloak for staging
  apiUrl: 'https://api-minusone.example.com/api',
  keycloak: {
    url: 'https://keycloak-minusone.example.com',
    realm: 'selfservices-minusone',
    clientId: 'selfservices-app-minusone',
  },
};
