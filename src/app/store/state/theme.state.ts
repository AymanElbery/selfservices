/**
 * Theme State
 *
 * Example of a global state slice for theme management.
 */

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeState {
  mode: ThemeMode;
  isLoading: boolean;
}

export const initialThemeState: ThemeState = {
  mode: 'light',
  isLoading: false,
};
