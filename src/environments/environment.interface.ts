/**
 * Environment Configuration Interface
 *
 * Defines the structure for all environment configurations.
 * Ensures type safety across all environment files.
 */

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}

export interface Environment {
  production: boolean;
  enableAuth: boolean; // Set to false to disable Keycloak in development
  apiUrl: string;
  keycloak: KeycloakConfig;
}
