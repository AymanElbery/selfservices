/**
 * Users Feature State
 *
 * State specific to the users feature module.
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface UsersState {
  users: User[];
  selectedUserId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUsersState: UsersState = {
  users: [],
  selectedUserId: null,
  isLoading: false,
  error: null,
};
