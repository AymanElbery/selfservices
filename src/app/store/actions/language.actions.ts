/**
 * Language Actions
 *
 * NgRx actions for language state management.
 */

import { createActionGroup, emptyProps, props } from '@ngrx/store';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

export const LanguageActions = createActionGroup({
  source: 'Language',
  events: {
    'Set Language': props<{ language: Language; direction: Direction }>(),
    'Toggle Language': emptyProps(),
  },
});
