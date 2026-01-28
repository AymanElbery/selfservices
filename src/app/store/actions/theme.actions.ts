/**
 * Theme Actions
 *
 * Example actions for theme management.
 */

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ThemeMode } from '../state/theme.state';

export const ThemeActions = createActionGroup({
  source: 'Theme',
  events: {
    'Set Theme': props<{ mode: ThemeMode }>(),
    'Toggle Theme': emptyProps(),
    'Load Theme': emptyProps(),
    'Load Theme Success': props<{ mode: ThemeMode }>(),
    'Load Theme Failure': props<{ error: string }>(),
  },
});
