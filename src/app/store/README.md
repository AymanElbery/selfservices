# Global Store (NgRx)

This folder contains **global application state only** using NgRx Store + Effects with Signals integration.

## What Belongs Here

- **Global UI state**: Theme, language, layout settings
- **Shared user state**: Current user, authentication status
- **Cross-cutting state**: Notifications, loading indicators that affect multiple features

## What Does NOT Belong Here

- **Feature-specific state**: Should be managed within `features/<feature>/store`
- **Component-local state**: Should use component state or signals
- **Form state**: Should use reactive forms or local component state

## Structure

```
store/
├── state/           # State interfaces and initial state
│   ├── app.state.ts         # Root state interface
│   └── theme.state.ts       # Example: Theme state slice
├── actions/         # Action creators using createActionGroup
│   ├── index.ts
│   └── theme.actions.ts     # Example: Theme actions
├── reducers/        # Reducers using createReducer
│   ├── index.ts             # Root reducer map
│   └── theme.reducer.ts     # Example: Theme reducer
├── effects/         # Side effects using createEffect
│   ├── index.ts
│   └── theme.effects.ts     # Example: Theme effects
├── selectors/       # Memoized selectors
│   ├── index.ts
│   └── theme.selectors.ts   # Example: Theme selectors
└── index.ts         # Public API (exports all)
```

## Using NgRx with Signals

Components can use the `selectSignal` method to create signals from selectors:

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectThemeMode } from './store';

@Component({
  selector: 'app-root',
  template: `<p>Current theme: {{ theme() }}</p>`,
})
export class AppComponent {
  // Create a signal from a selector
  theme = this.store.selectSignal(selectThemeMode);

  constructor(private store: Store) {}
}
```

## Adding New Global State

1. **Create state interface**:
   ```typescript
   // state/feature.state.ts
   export interface FeatureState {
     data: any[];
     isLoading: boolean;
   }

   export const initialFeatureState: FeatureState = {
     data: [],
     isLoading: false,
   };
   ```

2. **Define actions**:
   ```typescript
   // actions/feature.actions.ts
   import { createActionGroup, props } from '@ngrx/store';

   export const FeatureActions = createActionGroup({
     source: 'Feature',
     events: {
       'Load Data': emptyProps(),
       'Load Data Success': props<{ data: any[] }>(),
     },
   });
   ```

3. **Create reducer**:
   ```typescript
   // reducers/feature.reducer.ts
   import { createReducer, on } from '@ngrx/store';

   export const featureReducer = createReducer(
     initialFeatureState,
     on(FeatureActions.loadData, (state) => ({ ...state, isLoading: true })),
     on(FeatureActions.loadDataSuccess, (state, { data }) => ({
       ...state,
       data,
       isLoading: false,
     }))
   );
   ```

4. **Add selectors**:
   ```typescript
   // selectors/feature.selectors.ts
   import { createFeatureSelector, createSelector } from '@ngrx/store';

   export const selectFeatureState = createFeatureSelector<FeatureState>('feature');
   export const selectData = createSelector(
     selectFeatureState,
     (state) => state.data
   );
   ```

5. **Add effects** (if needed):
   ```typescript
   // effects/feature.effects.ts
   import { Injectable } from '@angular/core';
   import { Actions, createEffect, ofType } from '@ngrx/effects';

   @Injectable()
   export class FeatureEffects {
     constructor(private actions$: Actions) {}

     loadData$ = createEffect(() =>
       this.actions$.pipe(
         ofType(FeatureActions.loadData),
         // ... effect logic
       )
     );
   }
   ```

6. **Register in root reducer and effects**:
   ```typescript
   // reducers/index.ts
   export const reducers: ActionReducerMap<AppState> = {
     feature: featureReducer,
   };

   // effects/index.ts
   export const globalEffects = [FeatureEffects];
   ```

## Guidelines

- Keep global state minimal - most state should be feature-level
- Use `createActionGroup` for type-safe action creators
- Use `createReducer` with `on` for immutable state updates
- Use `createSelector` for memoized, derived state
- Use `createEffect` for side effects (API calls, localStorage, etc.)
- Leverage signals integration with `selectSignal` in components
- Enable NgRx DevTools in development (already configured)

## DevTools

NgRx DevTools is configured in [app.config.ts](../../app.config.ts) and provides:
- Time-travel debugging
- State inspection
- Action history
- Performance monitoring

Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) in your browser to use these features.
