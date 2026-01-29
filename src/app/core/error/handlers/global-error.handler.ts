import { ErrorHandler, Injectable, inject, NgZone } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { ErrorLoggingService } from '../services/error-logging.service';
import { AppError } from '../models/error.model';

/**
 * GlobalErrorHandler
 *
 * Catches all uncaught errors in the application including:
 * - Unhandled promise rejections
 * - Runtime errors in components
 * - Template errors
 * - Lifecycle hook errors
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly errorService = inject(ErrorService);
  private readonly loggingService = inject(ErrorLoggingService);
  private readonly zone = inject(NgZone);

  handleError(error: unknown): void {
    // Run outside Angular zone to prevent change detection issues
    this.zone.runOutsideAngular(() => {
      this.processError(error);
    });
  }

  private processError(error: unknown): void {
    // Unwrap zone.js wrapped errors
    const unwrappedError = this.unwrapError(error);

    // Skip if already an AppError (already processed by interceptor)
    if (this.isAppError(unwrappedError)) {
      this.loggingService.log(unwrappedError);
      this.logToConsole(unwrappedError);
      return;
    }

    // Create structured error
    const appError = this.errorService.createAppError(unwrappedError, {
      componentName: this.extractComponentName(error),
    });

    // Log the error
    this.loggingService.log(appError);

    // Always log to console in development
    this.logToConsole(appError);
  }

  private unwrapError(error: unknown): unknown {
    // Handle zone.js error wrapping
    if (error && typeof error === 'object') {
      const err = error as Record<string, unknown>;

      // Zone.js wraps errors in rejection property
      if ('rejection' in err) {
        return err['rejection'];
      }

      // Angular wraps some errors in ngOriginalError
      if ('ngOriginalError' in err) {
        return err['ngOriginalError'];
      }
    }

    return error;
  }

  private isAppError(error: unknown): error is AppError {
    return (
      error !== null &&
      typeof error === 'object' &&
      'id' in error &&
      'code' in error &&
      'category' in error &&
      'severity' in error
    );
  }

  private extractComponentName(error: unknown): string | undefined {
    if (!error || typeof error !== 'object') return undefined;

    const err = error as Record<string, unknown>;

    // Try to extract from error context
    if (err['ngDebugContext']) {
      const ctx = err['ngDebugContext'] as Record<string, unknown>;
      if (ctx['component']) {
        const component = ctx['component'] as { constructor?: { name?: string } };
        return component.constructor?.name;
      }
    }

    // Try to extract from stack trace
    if (err instanceof Error && err.stack) {
      const match = err.stack.match(/at\s+(\w+Component)/);
      if (match) {
        return match[1];
      }
    }

    return undefined;
  }

  private logToConsole(appError: AppError): void {
    const style = this.getConsoleStyle(appError.severity);

    console.groupCollapsed(
      `%c[${appError.severity.toUpperCase()}] ${appError.code}`,
      style
    );
    console.error('Message:', appError.message);
    console.error('User Message:', appError.userMessage);
    console.error('Category:', appError.category);
    console.error('Timestamp:', appError.timestamp.toISOString());

    if (appError.context) {
      console.error('Context:', appError.context);
    }

    if (appError.originalError) {
      console.error('Original Error:', appError.originalError);
    }

    console.groupEnd();
  }

  private getConsoleStyle(severity: string): string {
    const styles: Record<string, string> = {
      info: 'color: #2196F3; font-weight: bold',
      warning: 'color: #FF9800; font-weight: bold',
      error: 'color: #F44336; font-weight: bold',
      critical: 'color: #9C27B0; font-weight: bold; text-decoration: underline',
    };

    return styles[severity] || styles['error'];
  }
}
