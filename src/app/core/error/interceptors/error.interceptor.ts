import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ErrorService } from '../services/error.service';
import { ErrorLoggingService } from '../services/error-logging.service';
import { DEFAULT_ERROR_CONFIG } from '../models/error.model';

/**
 * URLs to exclude from error interception
 */
const EXCLUDED_URL_PATTERNS: RegExp[] = [
  /\/assets\//i,
  /\.json$/i,
];

/**
 * Check if URL should be excluded from error handling
 */
function shouldExcludeUrl(url: string | null): boolean {
  if (!url) return false;
  return EXCLUDED_URL_PATTERNS.some(pattern => pattern.test(url));
}

/**
 * Extract request context for logging
 */
function getRequestContext(req: HttpRequest<unknown>) {
  return {
    url: req.urlWithParams,
    method: req.method,
    headers: Object.fromEntries(
      req.headers.keys().map(key => [key, req.headers.get(key) || ''])
    ),
  };
}

/**
 * HTTP Error Interceptor
 *
 * Functional interceptor that:
 * - Catches HTTP errors
 * - Transforms them into structured AppErrors
 * - Logs errors via the logging service
 * - Re-throws for downstream handling
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);
  const loggingService = inject(ErrorLoggingService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Skip excluded URLs
      if (shouldExcludeUrl(req.url)) {
        return throwError(() => error);
      }

      // Create structured error
      const appError = errorService.createAppError(error, getRequestContext(req));

      // Log the error
      if (DEFAULT_ERROR_CONFIG.enableLogging) {
        loggingService.log(appError);
      }

      // Re-throw for component/effect handling
      return throwError(() => appError);
    })
  );
};
