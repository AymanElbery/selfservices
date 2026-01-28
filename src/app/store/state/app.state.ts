/**
 * Global Application State Interface
 *
 * Define the shape of your global state here.
 * Only include cross-cutting, application-wide state.
 */

import { ThemeState } from './theme.state';
import { LanguageState } from './language.state';

export interface AppState {
  theme: ThemeState;
  language: LanguageState;
  // Add more global state slices here
  // auth: AuthState;
  // notifications: NotificationState;
}
