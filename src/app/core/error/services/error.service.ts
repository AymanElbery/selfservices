import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {
  AppError,
  ErrorCategory,
  ErrorSeverity,
  ErrorContext,
  HttpErrorCode,
  ValidationError,
} from '../models/error.model';

/**
 * ErrorService
 *
 * Centralized service for error transformation and user-friendly messages.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly translate = inject(TranslateService);

  /**
   * Transform any error into a structured AppError
   */
  createAppError(
    error: unknown,
    context?: Partial<ErrorContext>
  ): AppError {
    const id = this.generateErrorId();
    const timestamp = new Date();

    if (error instanceof HttpErrorResponse) {
      return this.fromHttpError(error, id, timestamp, context);
    }

    if (error instanceof Error) {
      return this.fromNativeError(error, id, timestamp, context);
    }

    return this.fromUnknownError(error, id, timestamp, context);
  }

  /**
   * Get user-friendly message for HTTP status code
   */
  getUserMessage(statusCode: number): string {
    const messageKey = this.getMessageKey(statusCode);
    const translated = this.translate.instant(messageKey);

    // Return translated message or fallback
    if (translated !== messageKey) {
      return translated;
    }

    return this.getDefaultMessage(statusCode);
  }

  /**
   * Extract validation errors from HTTP response
   */
  extractValidationErrors(error: HttpErrorResponse): ValidationError[] {
    const body = error.error;

    if (!body) return [];

    // Handle array of errors
    if (Array.isArray(body.errors)) {
      return body.errors.map((e: any) => ({
        field: e.field || e.path || 'unknown',
        message: e.message || e.msg || 'Validation error',
        code: e.code,
      }));
    }

    // Handle object with field-keyed errors
    if (body.errors && typeof body.errors === 'object') {
      return Object.entries(body.errors).map(([field, messages]) => ({
        field,
        message: Array.isArray(messages) ? messages[0] : String(messages),
      }));
    }

    return [];
  }

  /**
   * Determine error category from HTTP status
   */
  getCategoryFromStatus(status: number): ErrorCategory {
    if (status === 0) return 'network';
    if (status === HttpErrorCode.Unauthorized) return 'authentication';
    if (status === HttpErrorCode.Forbidden) return 'authorization';
    if (status === HttpErrorCode.UnprocessableEntity || status === HttpErrorCode.BadRequest) {
      return 'validation';
    }
    if (status >= 500) return 'server';
    if (status >= 400) return 'client';
    return 'unknown';
  }

  /**
   * Determine severity from HTTP status
   */
  getSeverityFromStatus(status: number): ErrorSeverity {
    if (status === 0) return 'error';
    if (status === HttpErrorCode.Unauthorized) return 'warning';
    if (status === HttpErrorCode.Forbidden) return 'warning';
    if (status >= 500) return 'critical';
    if (status >= 400) return 'error';
    return 'info';
  }

  /**
   * Check if error is retryable
   */
  isRetryable(statusCode: number): boolean {
    const retryableCodes = [408, 429, 502, 503, 504];
    return retryableCodes.includes(statusCode);
  }

  /**
   * Check if error is a network error
   */
  isNetworkError(error: HttpErrorResponse): boolean {
    return error.status === 0;
  }

  /**
   * Check if error is an authentication error
   */
  isAuthError(error: HttpErrorResponse): boolean {
    return error.status === HttpErrorCode.Unauthorized;
  }

  private fromHttpError(
    error: HttpErrorResponse,
    id: string,
    timestamp: Date,
    context?: Partial<ErrorContext>
  ): AppError {
    const category = this.getCategoryFromStatus(error.status);
    const severity = this.getSeverityFromStatus(error.status);
    const userMessage = this.getUserMessage(error.status);

    // Try to extract server message
    const serverMessage =
      error.error?.message ||
      error.error?.error?.message ||
      error.message;

    return {
      id,
      code: `HTTP_${error.status}`,
      message: serverMessage,
      userMessage,
      category,
      severity,
      timestamp,
      context: {
        url: error.url || undefined,
        statusCode: error.status,
        statusText: error.statusText,
        responseBody: error.error,
        ...context,
      },
      originalError: error,
    };
  }

  private fromNativeError(
    error: Error,
    id: string,
    timestamp: Date,
    context?: Partial<ErrorContext>
  ): AppError {
    return {
      id,
      code: 'CLIENT_ERROR',
      message: error.message,
      userMessage: this.translate.instant('errors.unexpected') || 'An unexpected error occurred',
      category: 'client',
      severity: 'error',
      timestamp,
      context: {
        stack: error.stack,
        ...context,
      },
      originalError: error,
    };
  }

  private fromUnknownError(
    error: unknown,
    id: string,
    timestamp: Date,
    context?: Partial<ErrorContext>
  ): AppError {
    return {
      id,
      code: 'UNKNOWN_ERROR',
      message: String(error),
      userMessage: this.translate.instant('errors.unexpected') || 'An unexpected error occurred',
      category: 'unknown',
      severity: 'error',
      timestamp,
      context,
      originalError: error,
    };
  }

  private getMessageKey(statusCode: number): string {
    const keyMap: Record<number, string> = {
      0: 'errors.network',
      400: 'errors.badRequest',
      401: 'errors.unauthorized',
      403: 'errors.forbidden',
      404: 'errors.notFound',
      405: 'errors.methodNotAllowed',
      409: 'errors.conflict',
      422: 'errors.validation',
      429: 'errors.tooManyRequests',
      500: 'errors.serverError',
      502: 'errors.badGateway',
      503: 'errors.serviceUnavailable',
      504: 'errors.gatewayTimeout',
    };

    return keyMap[statusCode] || 'errors.unexpected';
  }

  private getDefaultMessage(statusCode: number): string {
    const messageMap: Record<number, string> = {
      0: 'Unable to connect. Please check your internet connection.',
      400: 'Invalid request. Please check your input and try again.',
      401: 'Your session has expired. Please log in again.',
      403: 'You do not have permission to perform this action.',
      404: 'The requested resource was not found.',
      405: 'This operation is not allowed.',
      409: 'This operation conflicts with existing data.',
      422: 'Please correct the validation errors and try again.',
      429: 'Too many requests. Please wait a moment and try again.',
      500: 'A server error occurred. Please try again later.',
      502: 'The server is temporarily unavailable. Please try again.',
      503: 'The service is currently unavailable. Please try again later.',
      504: 'The request timed out. Please try again.',
    };

    return messageMap[statusCode] || 'An unexpected error occurred. Please try again.';
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
