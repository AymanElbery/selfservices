/**
 * Layout Service
 *
 * Manages layout state including sidebar, theme, and direction.
 */

import { Injectable, signal, computed } from '@angular/core';

export type Direction = 'rtl' | 'ltr';
export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // Sidebar state
  private sidebarOpenSignal = signal(true);
  private sidebarCollapsedSignal = signal(false);

  // Direction state (RTL/LTR)
  private directionSignal = signal<Direction>('rtl');

  // Theme state
  private themeSignal = signal<Theme>('light');

  // Public readonly signals
  readonly sidebarOpen = this.sidebarOpenSignal.asReadonly();
  readonly sidebarCollapsed = this.sidebarCollapsedSignal.asReadonly();
  readonly direction = this.directionSignal.asReadonly();
  readonly theme = this.themeSignal.asReadonly();

  // Computed values
  readonly isRTL = computed(() => this.direction() === 'rtl');
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    // Load saved preferences
    this.loadPreferences();
    // Apply initial state
    this.applyDirection();
    this.applyTheme();
  }

  /**
   * Toggle sidebar visibility (mobile)
   */
  toggleSidebar(): void {
    this.sidebarOpenSignal.update((open) => !open);
  }

  /**
   * Toggle sidebar collapsed state (desktop)
   */
  toggleSidebarCollapse(): void {
    this.sidebarCollapsedSignal.update((collapsed) => !collapsed);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(!this.sidebarCollapsed()));
  }

  /**
   * Set sidebar open state
   */
  setSidebarOpen(open: boolean): void {
    this.sidebarOpenSignal.set(open);
  }

  /**
   * Toggle direction (LTR/RTL)
   */
  toggleDirection(): void {
    const newDirection = this.direction() === 'ltr' ? 'rtl' : 'ltr';
    this.setDirection(newDirection);
  }

  /**
   * Set direction
   */
  setDirection(direction: Direction): void {
    this.directionSignal.set(direction);
    this.applyDirection();
    localStorage.setItem('direction', direction);
  }

  /**
   * Toggle theme (light/dark)
   */
  toggleTheme(): void {
    const newTheme = this.theme() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    this.applyTheme();
    localStorage.setItem('theme', theme);
  }

  /**
   * Apply direction to document
   */
  private applyDirection(): void {
    document.documentElement.setAttribute('dir', this.direction());
  }

  /**
   * Apply theme to document
   */
  private applyTheme(): void {
    if (this.theme() === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  /**
   * Load preferences from localStorage
   */
  private loadPreferences(): void {
    // Load sidebar collapsed state
    const savedCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsed) {
      this.sidebarCollapsedSignal.set(JSON.parse(savedCollapsed));
    }

    // Load direction
    const savedDirection = localStorage.getItem('direction') as Direction | null;
    if (savedDirection && (savedDirection === 'ltr' || savedDirection === 'rtl')) {
      this.directionSignal.set(savedDirection);
    }

    // Load theme
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.themeSignal.set(savedTheme);
    }
  }
}
