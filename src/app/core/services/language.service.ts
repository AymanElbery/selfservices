/**
 * Language Service
 *
 * Manages application language, direction (RTL/LTR), and persistence.
 * Integrates with ngx-translate and LayoutService.
 */

import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LayoutService } from '../layout/layout.service';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

const STORAGE_KEY = 'app-language';
const DEFAULT_LANGUAGE: Language = 'en';

// Language configuration
const LANGUAGE_CONFIG: Record<Language, { dir: Direction; name: string }> = {
  en: { dir: 'ltr', name: 'English' },
  ar: { dir: 'rtl', name: 'العربية' },
};

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translate = inject(TranslateService);
  private layoutService = inject(LayoutService);

  private currentLanguageSubject = new BehaviorSubject<Language>(DEFAULT_LANGUAGE);
  private currentDirectionSubject = new BehaviorSubject<Direction>('ltr');

  /**
   * Observable of current language
   */
  currentLanguage$: Observable<Language> = this.currentLanguageSubject.asObservable();

  /**
   * Observable of current direction
   */
  currentDirection$: Observable<Direction> = this.currentDirectionSubject.asObservable();

  constructor() {
    // Initialize supported languages
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang(DEFAULT_LANGUAGE);

    // Load saved language or use default
    const savedLang = this.getSavedLanguage();
    this.setLanguage(savedLang);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  /**
   * Get current direction
   */
  getCurrentDirection(): Direction {
    return this.currentDirectionSubject.value;
  }

  /**
   * Set language
   */
  setLanguage(lang: Language): void {
    if (!this.isValidLanguage(lang)) {
      console.warn(`Invalid language: ${lang}. Using default.`);
      lang = DEFAULT_LANGUAGE;
    }

    const direction = LANGUAGE_CONFIG[lang].dir;

    // Update translate service
    this.translate.use(lang);

    // Update subjects
    this.currentLanguageSubject.next(lang);
    this.currentDirectionSubject.next(direction);

    // Sync with LayoutService (for sidebar and other layout components)
    this.layoutService.setDirection(direction);

    // Update document attributes
    document.documentElement.setAttribute('lang', lang);

    // Persist to localStorage
    this.saveLanguage(lang);
  }

  /**
   * Toggle between languages
   */
  toggleLanguage(): void {
    const current = this.getCurrentLanguage();
    const next: Language = current === 'en' ? 'ar' : 'en';
    this.setLanguage(next);
  }

  /**
   * Get language name
   */
  getLanguageName(lang: Language): string {
    return LANGUAGE_CONFIG[lang]?.name || lang;
  }

  /**
   * Check if RTL
   */
  isRTL(): boolean {
    return this.getCurrentDirection() === 'rtl';
  }

  /**
   * Get all available languages
   */
  getAvailableLanguages(): Array<{ code: Language; name: string; dir: Direction }> {
    return Object.entries(LANGUAGE_CONFIG).map(([code, config]) => ({
      code: code as Language,
      name: config.name,
      dir: config.dir,
    }));
  }

  /**
   * Save language to localStorage
   */
  private saveLanguage(lang: Language): void {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error('Failed to save language to localStorage:', error);
    }
  }

  /**
   * Get saved language from localStorage
   */
  private getSavedLanguage(): Language {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return this.isValidLanguage(saved as Language) ? (saved as Language) : DEFAULT_LANGUAGE;
    } catch (error) {
      console.error('Failed to load language from localStorage:', error);
      return DEFAULT_LANGUAGE;
    }
  }

  /**
   * Validate language code
   */
  private isValidLanguage(lang: string): lang is Language {
    return lang === 'en' || lang === 'ar';
  }
}
