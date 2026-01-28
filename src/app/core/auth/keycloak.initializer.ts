/**
 * Keycloak Initializer
 *
 * APP_INITIALIZER factory function to bootstrap Keycloak
 * before the Angular application starts.
 */

import { KeycloakService } from './keycloak.service';
import { environment } from '../../../environments/environment';

/**
 * Initialize Keycloak during app bootstrap
 * This function is called by Angular's APP_INITIALIZER
 */
export function initializeKeycloak(keycloakService: KeycloakService): () => Promise<boolean> {
  return () => {
    // Skip Keycloak initialization if auth is disabled
    if (!environment.enableAuth) {
      console.log('Keycloak authentication is disabled in this environment');
      return Promise.resolve(false);
    }
    return keycloakService.init();
  };
}
