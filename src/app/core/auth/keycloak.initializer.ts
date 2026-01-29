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
  return async () => {
    console.log('[Keycloak] APP_INITIALIZER started, enableAuth:', environment.enableAuth);

    // Skip Keycloak initialization if auth is disabled
    if (!environment.enableAuth) {
      console.log('[Keycloak] Authentication is disabled in this environment');
      return false;
    }

    try {
      const result = await keycloakService.init();
      console.log('[Keycloak] APP_INITIALIZER completed, authenticated:', result);
      return result;
    } catch (error) {
      console.error('[Keycloak] APP_INITIALIZER failed:', error);
      return false;
    }
  };
}
