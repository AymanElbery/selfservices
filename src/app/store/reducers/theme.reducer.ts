/**
 * Theme Reducer
 *
 * Example reducer for theme management.
 */

import { createReducer, on } from '@ngrx/store';
import { ThemeActions } from '../actions/theme.actions';
import { ThemeState, initialThemeState } from '../state/theme.state';

export const themeReducer = createReducer(
  initialThemeState,

  on(ThemeActions.setTheme, (state, { mode }): ThemeState => ({
    ...state,
    mode,
  })),

  on(ThemeActions.toggleTheme, (state): ThemeState => ({
    ...state,
    mode: state.mode === 'light' ? 'dark' : 'light',
  })),

  on(ThemeActions.loadTheme, (state): ThemeState => ({
    ...state,
    isLoading: true,
  })),

  on(ThemeActions.loadThemeSuccess, (state, { mode }): ThemeState => ({
    ...state,
    mode,
    isLoading: false,
  })),

  on(ThemeActions.loadThemeFailure, (state): ThemeState => ({
    ...state,
    isLoading: false,
  }))
);
