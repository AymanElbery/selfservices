/**
 * Language State
 *
 * Global language state interface.
 */

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export interface LanguageState {
  current: Language;
  direction: Direction;
}

export const initialLanguageState: LanguageState = {
  current: 'en',
  direction: 'ltr',
};
