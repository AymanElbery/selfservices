import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { KeycloakService } from '../auth';

/**
 * GuestGuard
 *
 * Functional guard for public routes (login, register, etc.).
 * Redirects authenticated users to dashboard/home.
 *
 * @example
 * // In routes
 * {
 *   path: 'login',
 *   canActivate: [guestGuard],
 *   component: LoginComponent
 * }
 */
export const guestGuard: CanActivateFn = (): boolean | UrlTree => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);

  if (keycloakService.isLoggedIn()) {
    // User is already authenticated, redirect to dashboard
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
