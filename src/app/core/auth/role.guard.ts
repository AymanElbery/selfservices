/**
 * Role Guard
 *
 * Protects routes based on user roles.
 * Checks if the authenticated user has required roles to access a route.
 */

import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { KeycloakService } from './keycloak.service';

/**
 * Role Guard Function
 *
 * Checks if the user has the required roles to access a route.
 * Requires route data with 'roles' array.
 *
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, roleGuard],
 *   data: {
 *     roles: ['admin', 'superadmin'],
 *     requireAll: false  // Optional: require all roles (default: false)
 *   }
 * }
 * ```
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  // Check if user is authenticated first
  if (!keycloakService.isLoggedIn()) {
    keycloakService.login(window.location.origin + state.url);
    return false;
  }

  // Get required roles from route data
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    console.warn('RoleGuard: No roles specified in route data');
    return true;
  }

  // Check if all roles are required or just one
  const requireAll = route.data['requireAll'] === true;

  // Check user roles
  const hasAccess = requireAll
    ? keycloakService.hasAllRoles(requiredRoles)
    : keycloakService.hasAnyRole(requiredRoles);

  if (!hasAccess) {
    console.warn('RoleGuard: User does not have required roles', {
      required: requiredRoles,
      user: keycloakService.getUserRoles(),
      requireAll,
    });

    // Redirect to unauthorized page or home
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
