/**
 * User Detail Component
 *
 * Example component for displaying user details.
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UsersActions, selectSelectedUser } from '../../store';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-detail">
      @if (user(); as user) {
        <h2>{{ user.name }}</h2>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>ID:</strong> {{ user.id }}</p>
        <button (click)="goBack()">Back to List</button>
      } @else {
        <p>User not found</p>
      }
    </div>
  `,
  styles: [`
    .user-detail {
      padding: 20px;
    }

    button {
      padding: 8px 16px;
      cursor: pointer;
      margin-top: 10px;
    }
  `],
})
export class UserDetailComponent implements OnInit {
  // Inject dependencies
  private store = inject(Store);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Select user from store
  user = this.store.selectSignal(selectSelectedUser);

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.store.dispatch(UsersActions.selectUser({ userId }));
    }
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
