/**
 * Login Component
 *
 * Handles user authentication via Keycloak.
 * Supports RTL and i18n for Arabic/English.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { KeycloakService } from '../../../../core/auth';
import { ToastService } from '../../../../core/notifications';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly keycloakService = inject(KeycloakService);
  private readonly toastService = inject(ToastService);

  isLoading = false;

  async login(): Promise<void> {
    this.isLoading = true;

    try {
      await this.keycloakService.login(window.location.origin + '/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      this.toastService.error('Failed to connect to authentication server. Please try again.');
      this.isLoading = false;
    }
  }
}
