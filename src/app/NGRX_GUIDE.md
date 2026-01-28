# NgRx Quick Reference Guide

This guide provides quick examples for working with NgRx Store + Effects with Signals integration.

## Table of Contents
- [Installation](#installation)
- [Global Store Setup](#global-store-setup)
- [Feature Store Setup](#feature-store-setup)
- [Using Store in Components](#using-store-in-components)
- [Common Patterns](#common-patterns)

## Installation

NgRx packages are already installed:
- `@ngrx/store` - State management
- `@ngrx/effects` - Side effects
- `@ngrx/store-devtools` - Time-travel debugging

## Global Store Setup

Global store is configured in [app.config.ts](app.config.ts):

```typescript
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { reducers } from './store/reducers';
import { globalEffects } from './store/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore(reducers),
    provideEffects(globalEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
```

### Adding Global State

Example: Theme state

**1. Define State** (`store/state/theme.state.ts`):
```typescript
export interface ThemeState {
  mode: 'light' | 'dark';
  isLoading: boolean;
}

export const initialThemeState: ThemeState = {
  mode: 'light',
  isLoading: false,
};
```

**2. Create Actions** (`store/actions/theme.actions.ts`):
```typescript
import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const ThemeActions = createActionGroup({
  source: 'Theme',
  events: {
    'Set Theme': props<{ mode: 'light' | 'dark' }>(),
    'Toggle Theme': emptyProps(),
  },
});
```

**3. Implement Reducer** (`store/reducers/theme.reducer.ts`):
```typescript
import { createReducer, on } from '@ngrx/store';
import { ThemeActions } from '../actions/theme.actions';

export const themeReducer = createReducer(
  initialThemeState,
  on(ThemeActions.setTheme, (state, { mode }) => ({ ...state, mode })),
  on(ThemeActions.toggleTheme, (state) => ({
    ...state,
    mode: state.mode === 'light' ? 'dark' : 'light',
  }))
);
```

**4. Create Selectors** (`store/selectors/theme.selectors.ts`):
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectThemeState = createFeatureSelector<ThemeState>('theme');

export const selectThemeMode = createSelector(
  selectThemeState,
  (state) => state.mode
);

export const selectIsDarkMode = createSelector(
  selectThemeMode,
  (mode) => mode === 'dark'
);
```

**5. Add Effects** (optional) (`store/effects/theme.effects.ts`):
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { ThemeActions } from '../actions/theme.actions';

@Injectable()
export class ThemeEffects {
  constructor(private actions$: Actions) {}

  persistTheme$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ThemeActions.setTheme),
        tap(({ mode }) => localStorage.setItem('theme', mode))
      ),
    { dispatch: false }
  );
}
```

**6. Register** in `store/reducers/index.ts` and `store/effects/index.ts`.

## Feature Store Setup

Feature stores are registered with lazy-loaded routes.

### Example: Users Feature

**1. Create Store Structure**:
```
features/users/store/
├── state/users.state.ts
├── actions/users.actions.ts
├── reducers/users.reducer.ts
├── effects/users.effects.ts
├── selectors/users.selectors.ts
└── index.ts
```

**2. Configure Routes** (`features/users/users.routes.ts`):
```typescript
import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './store/reducers/users.reducer';
import { UsersEffects } from './store/effects/users.effects';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      // Feature state is loaded with the feature
      provideState('users', usersReducer),
      provideEffects([UsersEffects]),
    ],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/users-list/users-list.component').then(
            (m) => m.UsersListComponent
          ),
      },
    ],
  },
];
```

**3. Register Feature Route** (`app.routes.ts`):
```typescript
export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./features/users').then((m) => m.USERS_ROUTES),
  },
];
```

## Using Store in Components

### With Signals (Recommended)

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UsersActions, selectAllUsers, selectIsLoading } from '../../store';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    @if (isLoading()) {
      <p>Loading...</p>
    } @else {
      <ul>
        @for (user of users(); track user.id) {
          <li>{{ user.name }}</li>
        }
      </ul>
    }
    <button (click)="loadUsers()">Reload</button>
  `,
})
export class UsersListComponent implements OnInit {
  // Create signals from selectors
  users = this.store.selectSignal(selectAllUsers);
  isLoading = this.store.selectSignal(selectIsLoading);

  constructor(private store: Store) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
```

### With Observables (Alternative)

```typescript
import { AsyncPipe } from '@angular/common';

export class UsersListComponent {
  users$ = this.store.select(selectAllUsers);
  isLoading$ = this.store.select(selectIsLoading);

  constructor(private store: Store) {}
}
```

## Common Patterns

### CRUD Operations

**Actions**:
```typescript
export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    // Read
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Create
    'Add User': props<{ user: User }>(),
    'Add User Success': props<{ user: User }>(),

    // Update
    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),

    // Delete
    'Delete User': props<{ userId: string }>(),
    'Delete User Success': props<{ userId: string }>(),
  },
});
```

**Effects with API calls**:
```typescript
@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersService.getUsers().pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UsersActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      switchMap(({ user }) =>
        this.usersService.addUser(user).pipe(
          map((newUser) => UsersActions.addUserSuccess({ user: newUser })),
          catchError((error) =>
            of(UsersActions.addUserFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
```

### Derived/Computed State

Use selectors to create derived state:

```typescript
export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users
);

export const selectActiveUsers = createSelector(
  selectUsers,
  (users) => users.filter((u) => u.isActive)
);

export const selectUserCount = createSelector(
  selectUsers,
  (users) => users.length
);

export const selectUserById = (id: string) =>
  createSelector(
    selectUsers,
    (users) => users.find((u) => u.id === id)
  );
```

### Loading States

```typescript
export interface LoadableState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

// Reducer
on(Actions.load, (state) => ({
  ...state,
  isLoading: true,
  error: null,
})),

on(Actions.loadSuccess, (state, { data }) => ({
  ...state,
  data,
  isLoading: false,
})),

on(Actions.loadFailure, (state, { error }) => ({
  ...state,
  isLoading: false,
  error,
})),
```

### Optimistic Updates

```typescript
// Reducer: Update immediately
on(UsersActions.deleteUser, (state, { userId }) => ({
  ...state,
  users: state.users.filter((u) => u.id !== userId),
})),

// Reducer: Rollback on failure
on(UsersActions.deleteUserFailure, (state, { userId, user }) => ({
  ...state,
  users: [...state.users, user], // Add back the deleted user
  error: 'Failed to delete user',
})),

// Effect: Trigger API call
deleteUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(UsersActions.deleteUser),
    switchMap(({ userId, user }) =>
      this.service.deleteUser(userId).pipe(
        map(() => UsersActions.deleteUserSuccess({ userId })),
        catchError(() =>
          of(UsersActions.deleteUserFailure({ userId, user }))
        )
      )
    )
  )
);
```

## DevTools

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open DevTools in browser (F12)
3. Navigate to "Redux" tab
4. Features:
   - View state snapshots
   - Time-travel debugging
   - Action history
   - Dispatch actions manually
   - Export/import state

## Best Practices

1. **Keep State Normalized**: Store entities by ID for easy updates
2. **Use Selectors**: Never access state directly, always use selectors
3. **Leverage Signals**: Use `selectSignal()` for reactive components
4. **Immutable Updates**: Always return new objects in reducers
5. **Handle Errors**: Always have failure actions and error states
6. **Type Safety**: Define strong TypeScript interfaces
7. **Feature Isolation**: Keep feature state in feature folders
8. **Minimal Global State**: Only truly cross-cutting concerns

## Resources

- [NgRx Documentation](https://ngrx.io/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Angular Signals](https://angular.dev/guide/signals)
- [Users Feature Example](features/users/) - Complete working example
