/**
 * Global Reducers
 *
 * Combine and export all global reducers here.
 */

import { ActionReducerMap } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { themeReducer } from './theme.reducer';
import { languageReducer } from './language.reducer';

/**
 * Root reducer map for global state
 */
export const reducers: ActionReducerMap<AppState> = {
  theme: themeReducer,
  language: languageReducer,
  // Add more reducers here
  // auth: authReducer,
};

// Export individual reducers
export * from './theme.reducer';
export * from './language.reducer';
// export * from './auth.reducer';
