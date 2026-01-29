import { Component, input, output, computed } from '@angular/core';
import { Notification, NotificationType } from '../../models/notification.model';

/**
 * ToastItemComponent
 *
 * Individual toast notification with Tailwind styling.
 * Supports success, error, warning, and info types.
 */
@Component({
  selector: 'app-toast-item',
  standalone: true,
  template: `
    <div
      [class]="toastClasses()"
      role="alert"
      [attr.aria-labelledby]="'toast-title-' + notification().id"
    >
      <!-- Icon -->
      <div class="flex-shrink-0">
        <svg
          class="w-5 h-5"
          [class]="iconColorClass()"
          fill="currentColor"
          viewBox="0 0 20 20"
          [innerHTML]="iconPath()"
        ></svg>
      </div>

      <!-- Content -->
      <div class="flex-1 ms-3">
        @if (notification().title) {
          <p
            [id]="'toast-title-' + notification().id"
            class="text-sm font-semibold"
            [class]="textColorClass()"
          >
            {{ notification().title }}
          </p>
        }
        <p
          class="text-sm"
          [class]="notification().title ? 'mt-1 opacity-90' : ''"
          [class.font-medium]="!notification().title"
        >
          {{ notification().message }}
        </p>

        <!-- Action Button -->
        @if (notification().action) {
          <button
            type="button"
            class="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
            [class]="actionColorClass()"
            (click)="onAction()"
          >
            {{ notification().action!.label }}
          </button>
        }
      </div>

      <!-- Dismiss Button -->
      @if (notification().dismissible) {
        <button
          type="button"
          class="flex-shrink-0 ms-4 inline-flex justify-center items-center w-8 h-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors"
          [class]="dismissButtonClass()"
          (click)="onDismiss()"
          aria-label="Dismiss notification"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      }
    </div>
  `,
})
export class ToastItemComponent {
  readonly notification = input.required<Notification>();
  readonly dismiss = output<string>();

  readonly toastClasses = computed(() => {
    const type = this.notification().type;
    const baseClasses =
      'pointer-events-auto flex items-start w-full max-w-sm p-4 rounded-lg shadow-lg border animate-slide-in';

    const typeClasses: Record<NotificationType, string> = {
      success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-200',
      error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-800 dark:text-yellow-200',
      info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/50 dark:border-blue-800 dark:text-blue-200',
    };

    return `${baseClasses} ${typeClasses[type]}`;
  });

  readonly iconColorClass = computed(() => {
    const type = this.notification().type;
    const colors: Record<NotificationType, string> = {
      success: 'text-green-500 dark:text-green-400',
      error: 'text-red-500 dark:text-red-400',
      warning: 'text-yellow-500 dark:text-yellow-400',
      info: 'text-blue-500 dark:text-blue-400',
    };
    return colors[type];
  });

  readonly textColorClass = computed(() => {
    const type = this.notification().type;
    const colors: Record<NotificationType, string> = {
      success: 'text-green-800 dark:text-green-200',
      error: 'text-red-800 dark:text-red-200',
      warning: 'text-yellow-800 dark:text-yellow-200',
      info: 'text-blue-800 dark:text-blue-200',
    };
    return colors[type];
  });

  readonly actionColorClass = computed(() => {
    const type = this.notification().type;
    const colors: Record<NotificationType, string> = {
      success: 'text-green-700 hover:text-green-900 dark:text-green-300 focus:ring-green-500',
      error: 'text-red-700 hover:text-red-900 dark:text-red-300 focus:ring-red-500',
      warning: 'text-yellow-700 hover:text-yellow-900 dark:text-yellow-300 focus:ring-yellow-500',
      info: 'text-blue-700 hover:text-blue-900 dark:text-blue-300 focus:ring-blue-500',
    };
    return colors[type];
  });

  readonly dismissButtonClass = computed(() => {
    const type = this.notification().type;
    const colors: Record<NotificationType, string> = {
      success: 'text-green-500 hover:bg-green-100 dark:hover:bg-green-800/50 focus:ring-green-500',
      error: 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800/50 focus:ring-red-500',
      warning: 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800/50 focus:ring-yellow-500',
      info: 'text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800/50 focus:ring-blue-500',
    };
    return colors[type];
  });

  readonly iconPath = computed(() => {
    const type = this.notification().type;
    const paths: Record<NotificationType, string> = {
      success: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />`,
      error: `<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />`,
      warning: `<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />`,
      info: `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />`,
    };
    return paths[type];
  });

  onDismiss(): void {
    this.dismiss.emit(this.notification().id);
  }

  onAction(): void {
    const action = this.notification().action;
    if (action?.callback) {
      action.callback();
    }
    this.onDismiss();
  }
}
