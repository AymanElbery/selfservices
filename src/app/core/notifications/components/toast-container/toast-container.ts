import { Component, inject, computed } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { ToastItemComponent } from '../toast-item/toast-item';

/**
 * ToastContainerComponent
 *
 * Root container for toast notifications.
 * Place this component in your app root (app.html).
 */
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [ToastItemComponent],
  template: `
    <div
      [class]="containerClasses()"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      @for (notification of notifications(); track notification.id) {
        <app-toast-item
          [notification]="notification"
          (dismiss)="onDismiss($event)"
          (mouseenter)="onMouseEnter(notification.id)"
          (mouseleave)="onMouseLeave(notification.id)"
        />
      }
    </div>
  `,
})
export class ToastContainerComponent {
  private readonly toastService = inject(ToastService);

  readonly notifications = this.toastService.notifications;
  readonly config = this.toastService.config;

  readonly containerClasses = computed(() => {
    const position = this.config().position;
    const baseClasses = 'fixed z-50 flex flex-col gap-3 p-4 pointer-events-none';

    const positionClasses: Record<string, string> = {
      'top-right': 'top-0 right-0',
      'top-left': 'top-0 left-0',
      'top-center': 'top-0 left-1/2 -translate-x-1/2',
      'bottom-right': 'bottom-0 right-0',
      'bottom-left': 'bottom-0 left-0',
      'bottom-center': 'bottom-0 left-1/2 -translate-x-1/2',
    };

    return `${baseClasses} ${positionClasses[position]}`;
  });

  onDismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  onMouseEnter(id: string): void {
    if (this.config().pauseOnHover) {
      this.toastService.pause(id);
    }
  }

  onMouseLeave(id: string): void {
    if (this.config().pauseOnHover) {
      this.toastService.resume(id);
    }
  }
}
