/**
 * Language Reducer
 *
 * Manages language state.
 */

import { createReducer, on } from '@ngrx/store';
import { LanguageActions } from '../actions/language.actions';
import { LanguageState, initialLanguageState } from '../state/language.state';

export const languageReducer = createReducer(
  initialLanguageState,
  on(LanguageActions.setLanguage, (state, { language, direction }) => ({
    ...state,
    current: language,
    direction,
  })),
  on(LanguageActions.toggleLanguage, (state) => ({
    ...state,
    current: state.current === 'en' ? 'ar' : 'en',
    direction: state.current === 'en' ? 'rtl' : 'ltr',
  }))
);
