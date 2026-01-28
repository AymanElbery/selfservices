/**
 * Users List Component
 *
 * Example component demonstrating NgRx with signals integration.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { UsersActions, selectAllUsers, selectUsersLoading } from '../../store';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="users-list">
      <h2>Users</h2>

      @if (isLoading()) {
        <p>Loading users...</p>
      } @else {
        <ul>
          @for (user of users(); track user.id) {
            <li>
              <strong>{{ user.name }}</strong> - {{ user.email }}
            </li>
          } @empty {
            <li>No users found</li>
          }
        </ul>
      }

      <button (click)="loadUsers()">Reload Users</button>
    </div>
  `,
  styles: [`
    .users-list {
      padding: 20px;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 10px;
      margin: 5px 0;
      background: #f5f5f5;
      border-radius: 4px;
    }

    button {
      margin-top: 10px;
      padding: 8px 16px;
      cursor: pointer;
    }
  `],
})
export class UsersListComponent implements OnInit {
  // Inject store
  private store = inject(Store);

  // NgRx with signals integration
  users = this.store.selectSignal(selectAllUsers);
  isLoading = this.store.selectSignal(selectUsersLoading);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.store.dispatch(UsersActions.loadUsers());
  }
}
