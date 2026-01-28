import { Routes } from '@angular/router';

export const routes: Routes = [
  // Example: Lazy-loaded feature with feature-level store
  {
    path: 'users',
    loadChildren: () => import('./features/users').then((m) => m.USERS_ROUTES),
  },
  // Add more feature routes here
];
