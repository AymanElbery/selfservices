import { Routes } from '@angular/router';
import { authGuard } from './core/auth';
import { guestGuard } from './core/guards';

export const routes: Routes = [
  // ===========================
  // Public Routes (Guest Layout)
  // ===========================
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layout/public-layout/public-layout.component').then(
        (m) => m.PublicLayoutComponent
      ),
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // ===========================
  // Private Routes (Main Layout)
  // ===========================
  {
    path: '',
    loadComponent: () =>
      import('./core/layout/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    canActivate: [authGuard],
    children: [
      // Dashboard / Home
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/home/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      // Users feature (lazy-loaded with feature store)
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users').then((m) => m.USERS_ROUTES),
      },
      // Default redirect to dashboard
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // ===========================
  // Fallback Routes
  // ===========================
  {
    path: '**',
    redirectTo: '',
  },
];
