/**
 * Users Feature Reducer
 */

import { createReducer, on } from '@ngrx/store';
import { UsersActions } from '../actions/users.actions';
import { UsersState, initialUsersState } from '../state/users.state';

export const usersReducer = createReducer(
  initialUsersState,

  // Load Users
  on(UsersActions.loadUsers, (state): UsersState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }): UsersState => ({
    ...state,
    users,
    isLoading: false,
    error: null,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }): UsersState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Select User
  on(UsersActions.selectUser, (state, { userId }): UsersState => ({
    ...state,
    selectedUserId: userId,
  })),

  on(UsersActions.clearSelection, (state): UsersState => ({
    ...state,
    selectedUserId: null,
  })),

  // Add User
  on(UsersActions.addUser, (state): UsersState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.addUserSuccess, (state, { user }): UsersState => ({
    ...state,
    users: [...state.users, user],
    isLoading: false,
  })),

  on(UsersActions.addUserFailure, (state, { error }): UsersState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Update User
  on(UsersActions.updateUser, (state): UsersState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }): UsersState => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    isLoading: false,
  })),

  on(UsersActions.updateUserFailure, (state, { error }): UsersState => ({
    ...state,
    isLoading: false,
    error,
  })),

  // Delete User
  on(UsersActions.deleteUser, (state): UsersState => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, { userId }): UsersState => ({
    ...state,
    users: state.users.filter((u) => u.id !== userId),
    selectedUserId: state.selectedUserId === userId ? null : state.selectedUserId,
    isLoading: false,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }): UsersState => ({
    ...state,
    isLoading: false,
    error,
  }))
);
