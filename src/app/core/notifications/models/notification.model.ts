/**
 * Notification Models
 *
 * Type definitions for the toast notification system.
 */

/**
 * Notification types
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Notification position on screen
 */
export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

/**
 * Notification data structure
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration: number;
  dismissible: boolean;
  timestamp: Date;
  action?: NotificationAction;
}

/**
 * Optional action button for notification
 */
export interface NotificationAction {
  label: string;
  callback: () => void;
}

/**
 * Options for creating a notification
 */
export interface NotificationOptions {
  title?: string;
  duration?: number;
  dismissible?: boolean;
  action?: NotificationAction;
}

/**
 * Toast service configuration
 */
export interface ToastConfig {
  position: NotificationPosition;
  maxToasts: number;
  defaultDuration: number;
  pauseOnHover: boolean;
}

/**
 * Default toast configuration
 */
export const DEFAULT_TOAST_CONFIG: ToastConfig = {
  position: 'top-right',
  maxToasts: 5,
  defaultDuration: 5000,
  pauseOnHover: true,
};

/**
 * Duration presets (in milliseconds)
 */
export const TOAST_DURATIONS = {
  short: 3000,
  medium: 5000,
  long: 8000,
  persistent: 0,
} as const;
