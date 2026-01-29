import { Injectable, InjectionToken, inject, Optional } from '@angular/core';
import { AppError, ErrorLogEntry, ErrorSeverity } from '../models/error.model';

/**
 * Error logging hook interface
 *
 * Implement this interface to create custom error loggers
 * (e.g., Sentry, LogRocket, custom backend)
 */
export interface ErrorLoggingHook {
  name: string;
  log(entry: ErrorLogEntry): void | Promise<void>;
  shouldLog?(error: AppError): boolean;
}

/**
 * Injection token for error logging hooks
 */
export const ERROR_LOGGING_HOOKS = new InjectionToken<ErrorLoggingHook[]>(
  'ERROR_LOGGING_HOOKS'
);

/**
 * ErrorLoggingService
 *
 * Centralized logging service with pluggable hooks.
 * Supports multiple logging backends via dependency injection.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorLoggingService {
  private readonly hooks = inject(ERROR_LOGGING_HOOKS, { optional: true }) || [];
  private readonly errorBuffer: ErrorLogEntry[] = [];
  private readonly maxBufferSize = 100;

  /**
   * Log an error through all registered hooks
   */
  log(error: AppError, metadata?: Record<string, unknown>): void {
    const entry = this.createLogEntry(error, metadata);

    // Buffer for retrieval
    this.addToBuffer(entry);

    // Process through all hooks
    for (const hook of this.hooks) {
      if (this.shouldLogToHook(hook, error)) {
        try {
          hook.log(entry);
        } catch (hookError) {
          console.warn(`Error logging hook "${hook.name}" failed:`, hookError);
        }
      }
    }
  }

  /**
   * Log with specific severity override
   */
  logWithSeverity(
    error: AppError,
    severity: ErrorSeverity,
    metadata?: Record<string, unknown>
  ): void {
    this.log({ ...error, severity }, metadata);
  }

  /**
   * Get recent errors from buffer
   */
  getRecentErrors(count?: number): ErrorLogEntry[] {
    const limit = count || this.maxBufferSize;
    return this.errorBuffer.slice(-limit);
  }

  /**
   * Clear the error buffer
   */
  clearBuffer(): void {
    this.errorBuffer.length = 0;
  }

  /**
   * Get error count by category
   */
  getErrorStats(): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const entry of this.errorBuffer) {
      const category = entry.error.category;
      stats[category] = (stats[category] || 0) + 1;
    }

    return stats;
  }

  private createLogEntry(
    error: AppError,
    metadata?: Record<string, unknown>
  ): ErrorLogEntry {
    return {
      error,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      metadata,
    };
  }

  private addToBuffer(entry: ErrorLogEntry): void {
    this.errorBuffer.push(entry);

    // Trim buffer if too large
    if (this.errorBuffer.length > this.maxBufferSize) {
      this.errorBuffer.shift();
    }
  }

  private shouldLogToHook(hook: ErrorLoggingHook, error: AppError): boolean {
    if (hook.shouldLog) {
      return hook.shouldLog(error);
    }
    return true;
  }
}

/**
 * Console logging hook (default)
 *
 * Logs errors to browser console with formatted output.
 */
export class ConsoleLoggingHook implements ErrorLoggingHook {
  name = 'console';

  log(entry: ErrorLogEntry): void {
    // Console logging handled by GlobalErrorHandler
    // This hook exists for consistency with the hook pattern
  }

  shouldLog(error: AppError): boolean {
    // Only log in development
    return typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
       window.location.hostname === '127.0.0.1');
  }
}

/**
 * Example: Remote logging hook
 *
 * Template for implementing remote error logging.
 * Extend this for services like Sentry, LogRocket, etc.
 */
export abstract class RemoteLoggingHook implements ErrorLoggingHook {
  abstract name: string;
  abstract endpoint: string;

  async log(entry: ErrorLogEntry): Promise<void> {
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.transformEntry(entry)),
      });
    } catch {
      // Silent fail for logging - don't cause cascading errors
    }
  }

  shouldLog(error: AppError): boolean {
    // Only log errors and critical to remote by default
    return error.severity === 'error' || error.severity === 'critical';
  }

  protected transformEntry(entry: ErrorLogEntry): Record<string, unknown> {
    return {
      errorId: entry.error.id,
      code: entry.error.code,
      message: entry.error.message,
      category: entry.error.category,
      severity: entry.error.severity,
      timestamp: entry.error.timestamp.toISOString(),
      context: entry.error.context,
      userAgent: entry.userAgent,
      metadata: entry.metadata,
    };
  }
}
