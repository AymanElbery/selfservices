/**
 * Users Feature Selectors
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from '../state/users.state';

// Feature selector
export const selectUsersState = createFeatureSelector<UsersState>('users');

// Memoized selectors
export const selectAllUsers = createSelector(
  selectUsersState,
  (state: UsersState) => state.users
);

export const selectUsersLoading = createSelector(
  selectUsersState,
  (state: UsersState) => state.isLoading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state: UsersState) => state.error
);

export const selectSelectedUserId = createSelector(
  selectUsersState,
  (state: UsersState) => state.selectedUserId
);

export const selectSelectedUser = createSelector(
  selectAllUsers,
  selectSelectedUserId,
  (users, selectedId) => users.find((user) => user.id === selectedId) || null
);

export const selectUsersCount = createSelector(
  selectAllUsers,
  (users) => users.length
);

export const selectUserById = (userId: string) =>
  createSelector(selectAllUsers, (users) => users.find((user) => user.id === userId) || null);
