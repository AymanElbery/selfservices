/**
 * Keycloak User Models
 *
 * Type definitions for Keycloak user information.
 */

export interface KeycloakUser {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  preferred_username?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

export interface KeycloakTokenParsed {
  exp?: number;
  iat?: number;
  iss?: string;
  sub?: string;
  typ?: string;
  azp?: string;
  session_state?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
  scope?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}
