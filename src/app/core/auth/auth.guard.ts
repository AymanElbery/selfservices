/**
 * Auth Guard
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to login page.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { KeycloakService } from './keycloak.service';
import { ToastService } from '../notifications';

/**
 * Auth Guard Function
 *
 * Checks if the user is authenticated before allowing access to a route.
 * If not authenticated, redirects to login page with toast notification.
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
export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  const toastService = inject(ToastService);

  console.log(keycloakService.getKeycloakInstance());
  if (keycloakService.isLoggedIn()) {
    return true;
  }

  toastService.warning('Please log in to access this page', {
    title: 'Authentication Required',
  });

  return router.createUrlTree(['/auth/login']);
};

/**
 * Auth Guard with role check
 *
 * Factory function that creates a guard requiring specific roles.
 *
 * @example
 * {
 *   path: 'admin',
 *   canActivate: [authGuardWithRoles(['admin'])],
 *   component: AdminComponent
 * }
 */
export function authGuardWithRoles(requiredRoles: string[]): CanActivateFn {
  return (): boolean | UrlTree => {
    const keycloakService = inject(KeycloakService);
    const router = inject(Router);
    const toastService = inject(ToastService);

    if (!keycloakService.isLoggedIn()) {
      toastService.warning('Please log in to access this page', {
        title: 'Authentication Required',
      });
      return router.createUrlTree(['/auth/login']);
    }

    if (!keycloakService.hasAnyRole(requiredRoles)) {
      toastService.error('You do not have permission to access this page', {
        title: 'Access Denied',
      });
      return router.createUrlTree(['/']);
    }

    return true;
  };
}
