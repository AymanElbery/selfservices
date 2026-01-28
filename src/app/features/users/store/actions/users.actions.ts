/**
 * Users Feature Actions
 */

import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User } from '../state/users.state';

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Select User': props<{ userId: string }>(),
    'Clear Selection': emptyProps(),

    'Add User': props<{ user: User }>(),
    'Add User Success': props<{ user: User }>(),
    'Add User Failure': props<{ error: string }>(),

    'Update User': props<{ user: User }>(),
    'Update User Success': props<{ user: User }>(),
    'Update User Failure': props<{ error: string }>(),

    'Delete User': props<{ userId: string }>(),
    'Delete User Success': props<{ userId: string }>(),
    'Delete User Failure': props<{ error: string }>(),
  },
});
