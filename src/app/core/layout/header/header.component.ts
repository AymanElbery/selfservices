/**
 * Header Component
 *
 * Top navigation bar with responsive design and RTL support.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutService } from '../layout.service';
import { KeycloakService } from '../../auth';
import { LanguageService } from '../../services/language.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // Inject services
  public layoutService = inject(LayoutService);
  private keycloakService = inject(KeycloakService);
  public languageService = inject(LanguageService);

  // Layout state
  isRTL = this.layoutService.isRTL;
  isDark = this.layoutService.isDark;
  sidebarCollapsed = this.layoutService.sidebarCollapsed;

  // Language state
  currentLanguage$ = this.languageService.currentLanguage$;

  // Auth state
  isAuthenticated$ = this.keycloakService.isAuthenticated$;
  user$ = this.keycloakService.user$;
  enableAuth = environment.enableAuth;

  /**
   * Toggle mobile sidebar
   */
  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  /**
   * Toggle sidebar collapse (desktop)
   */
  toggleSidebarCollapse(): void {
    this.layoutService.toggleSidebarCollapse();
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    this.layoutService.toggleTheme();
  }

  /**
   * Toggle direction
   */
  toggleDirection(): void {
    this.layoutService.toggleDirection();
  }

  /**
   * Toggle language
   */
  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  /**
   * Login
   */
  login(): void {
    this.keycloakService.login();
  }

  /**
   * Logout
   */
  logout(): void {
    this.keycloakService.logout();
  }
}
