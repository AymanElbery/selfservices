/**
 * Auth Guard
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to Keycloak login.
 */

import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakService } from './keycloak.service';

/**
 * Auth Guard Function
 *
 * Checks if the user is authenticated before allowing access to a route.
 * If not authenticated, redirects to Keycloak login.
 *
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'protected',
 *   component: ProtectedComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isLoggedIn()) {
    return true;
  }

  // Save the attempted URL for redirecting after login
  const returnUrl = state.url;

  // Redirect to login
  keycloakService.login(window.location.origin + returnUrl);

  return false;
};
