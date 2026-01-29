/**
 * Development Environment Configuration
 *
 * This is the default environment used during development.
 * File will be replaced during build based on the target environment.
 */

import { Environment } from './environment.interface';

export const environment: Environment = {
  production: false,
  enableAuth: true, // Enable Keycloak authentication
  apiUrl: 'http://localhost:3000/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'selfservices-dev',
    clientId: 'selfservices-app-dev',
  },
};
