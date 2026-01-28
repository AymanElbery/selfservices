/**
 * Keycloak HTTP Interceptor
 *
 * Automatically injects the Keycloak access token into HTTP requests.
 * Also handles token refresh before requests if the token is about to expire.
 */

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { from, Observable, switchMap } from 'rxjs';
import { KeycloakService } from './keycloak.service';
import { environment } from '../../../environments/environment';

/**
 * URLs that should be excluded from token injection
 */
const EXCLUDED_URLS: string[] = [
  // Add URLs that should not have the token injected
  // Example: '/public/api', '/assets/'
];

/**
 * Check if URL should be excluded from token injection
 */
function shouldExclude(url: string): boolean {
  return EXCLUDED_URLS.some((excludedUrl) => url.includes(excludedUrl));
}

/**
 * Keycloak Interceptor Function
 *
 * Injects the access token into outgoing HTTP requests.
 */
export const keycloakInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const keycloakService = inject(KeycloakService);

  // Skip if auth is disabled
  if (!environment.enableAuth) {
    return next(req);
  }

  // Skip token injection for excluded URLs
  if (shouldExclude(req.url)) {
    return next(req);
  }

  // Skip if user is not authenticated
  if (!keycloakService.isLoggedIn()) {
    return next(req);
  }

  // Update token if needed, then add to request
  return from(keycloakService.updateToken(30)).pipe(
    switchMap((tokenRefreshed) => {
      const token = keycloakService.getToken();

      if (!token) {
        return next(req);
      }

      // Clone request and add Authorization header
      const clonedReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      return next(clonedReq);
    })
  );
};
