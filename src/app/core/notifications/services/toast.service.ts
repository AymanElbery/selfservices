import { Injectable, signal, computed } from '@angular/core';
import {
  Notification,
  NotificationType,
  NotificationOptions,
  ToastConfig,
  DEFAULT_TOAST_CONFIG,
  TOAST_DURATIONS,
} from '../models/notification.model';

/**
 * ToastService
 *
 * Centralized notification service for displaying toast messages.
 * Designed to be triggered from Effects, Guards, and Interceptors.
 *
 * @example
 * // In an Effect
 * this.toastService.error('Failed to load users');
 *
 * // In a Guard
 * this.toastService.warning('You need to log in first');
 *
 * // With options
 * this.toastService.success('Item saved', {
 *   title: 'Success',
 *   duration: 3000,
 *   action: { label: 'Undo', callback: () => this.undo() }
 * });
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _config = signal<ToastConfig>(DEFAULT_TOAST_CONFIG);
  private readonly timeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

  /** Read-only notifications signal */
  readonly notifications = this._notifications.asReadonly();

  /** Current configuration */
  readonly config = this._config.asReadonly();

  /** Count of active notifications */
  readonly count = computed(() => this._notifications().length);

  /**
   * Show a success notification
   */
  success(message: string, options?: NotificationOptions): string {
    return this.show('success', message, options);
  }

  /**
   * Show an error notification
   */
  error(message: string, options?: NotificationOptions): string {
    return this.show('error', message, {
      duration: TOAST_DURATIONS.long,
      ...options,
    });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, options?: NotificationOptions): string {
    return this.show('warning', message, options);
  }

  /**
   * Show an info notification
   */
  info(message: string, options?: NotificationOptions): string {
    return this.show('info', message, options);
  }

  /**
   * Show a notification with custom type
   */
  show(
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ): string {
    const config = this._config();
    const id = this.generateId();

    const notification: Notification = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? config.defaultDuration,
      dismissible: options?.dismissible ?? true,
      timestamp: new Date(),
      action: options?.action,
    };

    this._notifications.update((current) => {
      const updated = [notification, ...current];
      // Limit max toasts
      if (updated.length > config.maxToasts) {
        const removed = updated.pop();
        if (removed) {
          this.clearTimeout(removed.id);
        }
      }
      return updated;
    });

    // Auto-dismiss if duration > 0
    if (notification.duration > 0) {
      this.scheduleRemoval(id, notification.duration);
    }

    return id;
  }

  /**
   * Dismiss a notification by ID
   */
  dismiss(id: string): void {
    this.clearTimeout(id);
    this._notifications.update((current) =>
      current.filter((n) => n.id !== id)
    );
  }

  /**
   * Dismiss all notifications
   */
  dismissAll(): void {
    this.timeoutMap.forEach((_, id) => this.clearTimeout(id));
    this._notifications.set([]);
  }

  /**
   * Pause auto-dismiss for a notification (e.g., on hover)
   */
  pause(id: string): void {
    this.clearTimeout(id);
  }

  /**
   * Resume auto-dismiss for a notification
   */
  resume(id: string): void {
    const notification = this._notifications().find((n) => n.id === id);
    if (notification && notification.duration > 0) {
      // Resume with remaining time (simplified: use half duration)
      this.scheduleRemoval(id, notification.duration / 2);
    }
  }

  /**
   * Update the toast configuration
   */
  configure(config: Partial<ToastConfig>): void {
    this._config.update((current) => ({ ...current, ...config }));
  }

  private scheduleRemoval(id: string, duration: number): void {
    const timeout = setTimeout(() => {
      this.dismiss(id);
    }, duration);
    this.timeoutMap.set(id, timeout);
  }

  private clearTimeout(id: string): void {
    const timeout = this.timeoutMap.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeoutMap.delete(id);
    }
  }

  private generateId(): string {
    return `toast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
