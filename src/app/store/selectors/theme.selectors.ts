/**
 * Theme Selectors
 *
 * Example selectors for theme state with signals integration.
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ThemeState } from '../state/theme.state';

// Feature selector
export const selectThemeState = createFeatureSelector<ThemeState>('theme');

// Memoized selectors
export const selectThemeMode = createSelector(
  selectThemeState,
  (state: ThemeState) => state.mode
);

export const selectThemeIsLoading = createSelector(
  selectThemeState,
  (state: ThemeState) => state.isLoading
);

export const selectIsDarkMode = createSelector(
  selectThemeMode,
  (mode) => mode === 'dark'
);
