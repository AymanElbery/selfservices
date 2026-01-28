/**
 * Users Feature Effects
 */

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { UsersActions } from '../actions/users.actions';
// import { UsersService } from '../../services/users.service';

@Injectable()
export class UsersEffects {
  // Inject dependencies
  private actions$ = inject(Actions);
  // private usersService = inject(UsersService);

  // Load users from API
  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        // Replace with actual API call: this.usersService.getUsers()
        of([
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        ]).pipe(
          map((users) => UsersActions.loadUsersSuccess({ users })),
          catchError((error) =>
            of(UsersActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Add user to API
  addUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.addUser),
      switchMap(({ user }) =>
        // Replace with actual API call: this.usersService.addUser(user)
        of(user).pipe(
          map((newUser) => UsersActions.addUserSuccess({ user: newUser })),
          catchError((error) =>
            of(UsersActions.addUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Update user via API
  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ user }) =>
        // Replace with actual API call: this.usersService.updateUser(user)
        of(user).pipe(
          map((updatedUser) => UsersActions.updateUserSuccess({ user: updatedUser })),
          catchError((error) =>
            of(UsersActions.updateUserFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Delete user via API
  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ userId }) =>
        // Replace with actual API call: this.usersService.deleteUser(userId)
        of(userId).pipe(
          map(() => UsersActions.deleteUserSuccess({ userId })),
          catchError((error) =>
            of(UsersActions.deleteUserFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
