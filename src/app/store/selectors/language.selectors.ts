/**
 * Language Selectors
 *
 * Selectors for language state.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LanguageState } from '../state/language.state';

export const selectLanguageState = createFeatureSelector<LanguageState>('language');

export const selectCurrentLanguage = createSelector(
  selectLanguageState,
  (state) => state.current
);

export const selectCurrentDirection = createSelector(
  selectLanguageState,
  (state) => state.direction
);

export const selectIsRTL = createSelector(
  selectLanguageState,
  (state) => state.direction === 'rtl'
);
