/**
 * Error Models
 *
 * Typed error definitions for centralized error handling.
 */

/**
 * HTTP error codes enumeration
 */
export enum HttpErrorCode {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}

/**
 * Error severity levels
 */
export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

/**
 * Error category for grouping
 */
export type ErrorCategory =
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'server'
  | 'client'
  | 'unknown';

/**
 * Structured application error
 */
export interface AppError {
  id: string;
  code: string;
  message: string;
  userMessage: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: Date;
  context?: ErrorContext;
  originalError?: unknown;
}

/**
 * Error context for debugging
 */
export interface ErrorContext {
  url?: string;
  method?: string;
  statusCode?: number;
  statusText?: string;
  requestBody?: unknown;
  responseBody?: unknown;
  headers?: Record<string, string>;
  stack?: string;
  componentName?: string;
  actionType?: string;
}

/**
 * HTTP error response structure
 */
export interface HttpErrorPayload {
  status: number;
  statusText: string;
  url: string | null;
  message: string;
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
}

/**
 * Validation error structure
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Validation error response
 */
export interface ValidationErrorResponse {
  errors: ValidationError[];
  message: string;
}

/**
 * Error log entry for logging service
 */
export interface ErrorLogEntry {
  error: AppError;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Error handler configuration
 */
export interface ErrorHandlerConfig {
  enableLogging: boolean;
  logLevel: ErrorSeverity;
  showNotifications: boolean;
  retryableStatusCodes: number[];
  excludedUrls: string[];
}

/**
 * Default error handler configuration
 */
export const DEFAULT_ERROR_CONFIG: ErrorHandlerConfig = {
  enableLogging: true,
  logLevel: 'error',
  showNotifications: true,
  retryableStatusCodes: [408, 429, 502, 503, 504],
  excludedUrls: [],
};
