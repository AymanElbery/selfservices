/**
 * Theme Effects
 *
 * Example effects for theme side effects (e.g., localStorage persistence).
 */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import { ThemeActions } from '../actions/theme.actions';

@Injectable()
export class ThemeEffects {
  // Inject dependencies
  private actions$ = inject(Actions);

  // Persist theme to localStorage when changed
  persistTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeActions.setTheme, ThemeActions.toggleTheme),
        tap((action) => {
          if ('mode' in action) {
            localStorage.setItem('theme', action.mode);
          }
        })
      ),
    { dispatch: false }
  );

  // Load theme from localStorage on app init
  loadTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ThemeActions.loadTheme),
      map(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const mode = savedTheme || 'light';
        return ThemeActions.loadThemeSuccess({ mode });
      })
    )
  );
}
