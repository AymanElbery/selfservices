# Features

This folder contains feature modules organized by business domain. Each feature should be:

- **Self-contained**: Contains all components, services, and logic specific to that feature
- **Lazy-loaded**: Loaded on-demand via routing for better performance
- **Domain-focused**: Represents a specific business capability or area
- **State-managed**: Uses feature-level NgRx store when needed

## Feature Structure

Each feature should follow this structure:

```
feature-name/
├── components/              # Feature-specific components
│   └── component-name/
│       └── component-name.component.ts
├── services/                # Feature-specific services (optional)
├── models/                  # Feature-specific models (optional)
├── store/                   # Feature-level NgRx store
│   ├── state/              # State interfaces and initial state
│   ├── actions/            # Action creators
│   ├── reducers/           # Reducers
│   ├── effects/            # Side effects
│   ├── selectors/          # Memoized selectors
│   └── index.ts            # Store exports
├── feature-name.routes.ts  # Feature routes configuration
└── index.ts                # Feature public API
```

## Creating a New Feature

### 1. Create Feature Folder Structure

```bash
features/
└── my-feature/
    ├── components/
    ├── store/
    ├── my-feature.routes.ts
    └── index.ts
```

### 2. Set Up Feature-Level Store

Create the store structure following the same pattern as global store:

```typescript
// store/state/my-feature.state.ts
export interface MyFeatureState {
  data: any[];
  isLoading: boolean;
  error: string | null;
}

export const initialMyFeatureState: MyFeatureState = {
  data: [],
  isLoading: false,
  error: null,
};
```

```typescript
// store/actions/my-feature.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const MyFeatureActions = createActionGroup({
  source: 'MyFeature',
  events: {
    'Load Data': emptyProps(),
    'Load Data Success': props<{ data: any[] }>(),
    'Load Data Failure': props<{ error: string }>(),
  },
});
```

### 3. Configure Feature Routes with Store

```typescript
// my-feature.routes.ts
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { myFeatureReducer } from './store/reducers/my-feature.reducer';
import { MyFeatureEffects } from './store/effects/my-feature.effects';

export const MY_FEATURE_ROUTES: Routes = [
  {
    path: '',
    providers: [
      // Feature-level state and effects are loaded with the feature
      provideState('myFeature', myFeatureReducer),
      provideEffects([MyFeatureEffects]),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/my-list/my-list.component').then(
            (m) => m.MyListComponent
          ),
      },
    ],
  },
];
```

### 4. Use Store in Components with Signals

```typescript
// components/my-list/my-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MyFeatureActions, selectAllData, selectIsLoading } from '../../store';

@Component({
  selector: 'app-my-list',
  standalone: true,
  template: `
    @if (isLoading()) {
      <p>Loading...</p>
    } @else {
      <ul>
        @for (item of data(); track item.id) {
          <li>{{ item.name }}</li>
        }
      </ul>
    }
  `,
})
export class MyListComponent implements OnInit {
  // NgRx with signals integration
  data = this.store.selectSignal(selectAllData);
  isLoading = this.store.selectSignal(selectIsLoading);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(MyFeatureActions.loadData());
  }
}
```

### 5. Register Feature in App Routes

```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'my-feature',
    loadChildren: () => import('./features/my-feature').then(m => m.MY_FEATURE_ROUTES)
  }
];
```

## Example Feature: Users

See the [users feature](./users/) for a complete example of:
- Feature-level NgRx store (actions, reducers, effects, selectors)
- Components using signals with `selectSignal`
- Lazy-loaded routes with feature state
- CRUD operations with optimistic updates

## Guidelines

### Feature Independence
- Features should NOT depend on each other directly
- Use `shared/` for common components/services
- Use `core/` for singleton services
- Keep features focused on a single business domain

### State Management
- **Feature state** belongs in `features/<feature>/store/`
- **Global state** belongs in `app/store/`
- Use feature-level store for domain-specific state
- Use global store only for cross-cutting concerns

### Lazy Loading
- All features must be lazy-loaded via routing
- Feature state/effects are registered when the feature loads
- This keeps the initial bundle small and improves performance

### TypeScript & Type Safety
- Define strong TypeScript interfaces for all state
- Use `createActionGroup` for type-safe actions
- Use selectors for derived/computed state
- Leverage signals for reactive UI updates

## When to Use Feature Store

Use feature-level NgRx store when:
- State needs to be shared across multiple components in the feature
- Complex state transformations or derived state
- Side effects like API calls, caching, or persistence
- Need for time-travel debugging or state history
- State needs to survive route navigation within the feature

Use component-level signals/state when:
- State is only used within a single component
- Simple UI state (toggles, form inputs)
- No side effects or async operations
