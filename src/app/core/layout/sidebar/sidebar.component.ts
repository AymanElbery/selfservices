/**
 * Sidebar Component
 *
 * Side navigation with responsive design and RTL support.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LayoutService } from '../layout.service';
import { KeycloakService } from '../../auth';
import { TranslateModule } from '@ngx-translate/core';

export interface NavItem {
  label: string;
  route: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  // Inject services
  public layoutService = inject(LayoutService);
  private keycloakService = inject(KeycloakService);

  // Layout state
  sidebarOpen = this.layoutService.sidebarOpen;
  sidebarCollapsed = this.layoutService.sidebarCollapsed;
  isRTL = this.layoutService.isRTL;

  // Auth state
  isAuthenticated$ = this.keycloakService.isAuthenticated$;
  user$ = this.keycloakService.user$;

  // Navigation items
  navItems: NavItem[] = [
    {
      label: 'الصفحة الرئيسية',
      route: '/dashboard',
      icon: 'home',
    },
    {
      label: 'خدماتي',
      route: '/users',
      icon: 'users',
    },
    {
      label: 'روابط تُهمك',
      route: '/links',
      icon: 'link',
    },
  ];

  /**
   * Close sidebar (mobile)
   */
  closeSidebar(): void {
    this.layoutService.setSidebarOpen(false);
  }

  /**
   * Toggle sidebar collapse (desktop)
   */
  toggleCollapse(): void {
    this.layoutService.toggleSidebarCollapse();
  }
}
