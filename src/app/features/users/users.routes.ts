/**
 * Users Feature Routes
 *
 * Lazy-loaded routes for the users feature.
 */

import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { usersReducer } from './store/reducers/users.reducer';
import { UsersEffects } from './store/effects/users.effects';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    providers: [
      // Feature-level state and effects
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
      {
        path: ':id',
        loadComponent: () =>
          import('./components/user-detail/user-detail.component').then(
            (m) => m.UserDetailComponent
          ),
      },
    ],
  },
];
