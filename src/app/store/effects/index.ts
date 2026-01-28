/**
 * Global Effects
 *
 * Export all global side effects here.
 */

export * from './theme.effects';
// Add more effect exports here
// export * from './auth.effects';

import { ThemeEffects } from './theme.effects';

/**
 * Array of all global effects for registration
 */
export const globalEffects = [
  ThemeEffects,
  // Add more effect classes here
  // AuthEffects,
];
