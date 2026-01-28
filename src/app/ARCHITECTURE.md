# Application Architecture

This project follows a **feature-based architecture** with clear separation of concerns.

## Folder Structure

```
src/app/
├── core/                 # Singleton services, guards, interceptors
│   ├── auth/            # Authentication module
│   ├── guards/          # Route guards
│   ├── interceptors/    # HTTP interceptors
│   ├── layout/          # Layout components (header, sidebar, etc.)
│   └── services/        # Core singleton services
│
├── shared/              # Reusable components, directives, pipes
│   ├── components/      # Shared UI components
│   ├── directives/      # Shared directives
│   ├── pipes/           # Shared pipes
│   └── models/          # Shared interfaces/types
│
├── features/            # Business domains (lazy-loaded)
│   ├── feature-name/    # Individual feature modules
│   │   ├── components/
│   │   ├── services/
│   │   ├── store/       # Feature-level NgRx store
│   │   │   ├── state/
│   │   │   ├── actions/
│   │   │   ├── reducers/
│   │   │   ├── effects/
│   │   │   ├── selectors/
│   │   │   └── index.ts
│   │   ├── feature-name.routes.ts
│   │   └── index.ts
│   └── ...
│
└── store/               # Global application state (NgRx)
    ├── state/           # State interfaces
    ├── actions/         # Action creators
    ├── reducers/        # Reducers
    ├── effects/         # Side effects
    ├── selectors/       # Memoized selectors
    └── index.ts
```

## Module Guidelines

### Core (`core/`)
- **Purpose**: Application-wide singleton services and utilities
- **Provided**: Once at the root level
- **Contains**:
  - Authentication services
  - HTTP interceptors
  - Route guards
  - Core layout components
  - API services
  - Error handling services
- **Rule**: Should be imported only in `app.config.ts` or used via tree-shakeable providers

### Shared (`shared/`)
- **Purpose**: Reusable presentational components and utilities
- **Imported**: By any feature module that needs them
- **Contains**:
  - UI components (buttons, cards, modals)
  - Directives (tooltip, highlight)
  - Pipes (date formatting, text transforms)
  - Common models/interfaces
- **Rule**: No business logic, only presentation and utility code

### Features (`features/`)
- **Purpose**: Business domain modules
- **Loaded**: Lazy-loaded via routing
- **Contains**:
  - Feature-specific components
  - Feature-specific services
  - Feature-specific models
  - **Feature-level NgRx store** (`features/<feature>/store/`)
  - Feature routing configuration
- **Rules**:
  - Each feature is self-contained
  - Features should NOT import from each other
  - Use `shared/` for common components
  - Use `core/` for singleton services
  - Use feature-level store for domain-specific state
  - Feature state is registered when the feature loads (lazy)

### Store (`store/`)
- **Purpose**: Global application state management using NgRx
- **Scope**: Cross-cutting state only
- **Technology**: NgRx Store + Effects with Signals integration
- **Contains**:
  - Global UI state (theme, language)
  - Authentication state
  - Shared notifications/alerts
- **Structure**:
  - `state/` - State interfaces and initial state
  - `actions/` - Action creators using `createActionGroup`
  - `reducers/` - Reducers using `createReducer`
  - `effects/` - Side effects using `createEffect`
  - `selectors/` - Memoized selectors using `createSelector`
- **Rule**: Keep minimal - prefer feature-level state when possible

## Dependency Flow

```
┌─────────┐
│  Core   │ ← Singleton services, provided at root
└────┬────┘
     │
┌────▼────┐
│ Shared  │ ← Imported by features as needed
└────┬────┘
     │
┌────▼────┐
│Features │ ← Lazy-loaded, self-contained
└─────────┘
     │
┌────▼────┐
│  Store  │ ← Global state (optional)
└─────────┘
```

**Allowed Dependencies:**
- Features → Shared ✓
- Features → Core ✓
- Features → Store ✓
- Shared → Core ✓
- Features → Features ✗ (NOT allowed)

## Best Practices

1. **Lazy Load Features**: All feature modules should be lazy-loaded via routing
2. **Keep Shared Dumb**: Shared components should be presentational with no business logic
3. **Minimize Global State**: Only truly global, cross-cutting state belongs in `store/`
4. **Feature Independence**: Features should not depend on each other
5. **Use Barrel Exports**: Each folder has an `index.ts` for clean imports
6. **Type Safety**: Use TypeScript interfaces for all models and state

## Adding a New Feature

1. **Create folder structure** in `features/`:
   ```
   features/my-feature/
   ├── components/
   ├── store/
   │   ├── state/
   │   ├── actions/
   │   ├── reducers/
   │   ├── effects/
   │   ├── selectors/
   │   └── index.ts
   ├── my-feature.routes.ts
   └── index.ts
   ```

2. **Set up feature store** (see [store README](store/README.md) for details):
   - Define state interface in `store/state/`
   - Create actions in `store/actions/`
   - Implement reducer in `store/reducers/`
   - Add effects in `store/effects/` (if needed)
   - Create selectors in `store/selectors/`

3. **Configure routes** with feature state:
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
         provideState('myFeature', myFeatureReducer),
         provideEffects([MyFeatureEffects]),
       ],
       children: [
         {
           path: '',
           loadComponent: () => import('./components/list/list.component')
             .then(m => m.ListComponent),
         },
       ],
     },
   ];
   ```

4. **Register in app routes**:
   ```typescript
   // app.routes.ts
   {
     path: 'my-feature',
     loadChildren: () => import('./features/my-feature').then(m => m.MY_FEATURE_ROUTES)
   }
   ```

5. **Use store in components**:
   ```typescript
   import { Store } from '@ngrx/store';
   import { MyFeatureActions, selectData } from '../../store';

   export class MyComponent {
     data = this.store.selectSignal(selectData);

     constructor(private store: Store) {}

     loadData() {
       this.store.dispatch(MyFeatureActions.loadData());
     }
   }
   ```

## State Management Strategy (NgRx + Signals)

This project uses **NgRx Store + Effects** with **Signals integration** for state management.

### State Levels

1. **Component State** (Signals/Local)
   - Use for: UI-only state, toggles, form inputs
   - Example: `isOpen = signal(false)`

2. **Feature State** (`features/<feature>/store/`)
   - Use for: Domain-specific state shared across feature components
   - Registered: Lazy-loaded with the feature via `provideState()`
   - Example: Users list, selected user, loading states
   - See [users feature](features/users/) for complete example

3. **Global State** (`app/store/`)
   - Use for: Cross-cutting concerns (theme, auth, notifications)
   - Registered: At app startup in `app.config.ts`
   - Example: Current theme, authenticated user, global notifications

### NgRx with Signals Integration

Components use `selectSignal()` to create signals from selectors:

```typescript
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllUsers, selectIsLoading } from './store';

@Component({
  template: `
    @if (isLoading()) {
      <p>Loading...</p>
    } @else {
      @for (user of users(); track user.id) {
        <div>{{ user.name }}</div>
      }
    }
  `,
})
export class UsersComponent {
  // Signals created from NgRx selectors
  users = this.store.selectSignal(selectAllUsers);
  isLoading = this.store.selectSignal(selectIsLoading);

  constructor(private store: Store) {}

  addUser(user: User) {
    this.store.dispatch(UsersActions.addUser({ user }));
  }
}
```

### NgRx DevTools

- Configured in [app.config.ts](app.config.ts)
- Enabled only in development mode
- Provides time-travel debugging, action history, and state inspection
- Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) for your browser

### When to Use Each Approach

| Scenario | Solution |
|----------|----------|
| Toggle button state | Component signal |
| Form validation state | Reactive Forms + component state |
| Feature data (users list) | Feature-level NgRx store |
| API data with caching | Feature-level NgRx store with effects |
| Current theme/language | Global NgRx store |
| Authentication status | Global NgRx store |
| Cross-feature notifications | Global NgRx store |

## Testing Strategy

- **Unit Tests**: Co-located with components/services (`.spec.ts`)
- **Integration Tests**: Test feature modules as a whole
- **E2E Tests**: Test critical user flows

---

For more details, see README files in each folder:
- [Core README](core/)
- [Shared README](shared/)
- [Features README](features/README.md)
- [Store README](store/README.md)
