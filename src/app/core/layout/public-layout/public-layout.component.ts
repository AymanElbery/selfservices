/**
 * Public Layout Component
 *
 * Minimal layout for public pages (login, register, forgot password, etc.).
 * No sidebar or header, focused on authentication flows.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutService } from '../layout.service';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TranslateModule],
  templateUrl: './public-layout.component.html',
  styleUrls: ['./public-layout.component.scss'],
})
export class PublicLayoutComponent {
  private readonly layoutService = inject(LayoutService);
  private readonly languageService = inject(LanguageService);

  readonly isRTL = this.layoutService.isRTL;
  readonly isDark = this.layoutService.isDark;
  readonly currentYear = new Date().getFullYear();
  readonly currentLanguage$ = this.languageService.currentLanguage$;

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  toggleTheme(): void {
    this.layoutService.toggleTheme();
  }
}
