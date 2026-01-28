# Authentication & Authorization (Keycloak 26)

Quick reference for Keycloak authentication integration.

## Overview

This application uses **Keycloak 26** for authentication and authorization with:
- Automatic initialization via `APP_INITIALIZER`
- HTTP interceptor for token injection
- Route guards for protection
- Automatic token refresh
- Role-based access control

All Keycloak code is isolated in [src/app/core/auth/](src/app/core/auth/)

## Quick Start

### 1. Configure Environment

Update Keycloak settings in environment files:

```typescript
// src/environments/environment.ts
export const environment = {
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'selfservices-dev',
    clientId: 'selfservices-app-dev',
  },
};
```

### 2. Protect Routes

```typescript
// app.routes.ts
import { authGuard, roleGuard } from './core/auth';

export const routes: Routes = [
  // Require authentication
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },

  // Require specific role
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin']
    }
  },

  // Require ANY of multiple roles
  {
    path: 'management',
    component: ManagementComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin', 'manager'],
      requireAll: false  // default
    }
  },

  // Require ALL roles
  {
    path: 'super-admin',
    component: SuperAdminComponent,
    canActivate: [authGuard, roleGuard],
    data: {
      roles: ['admin', 'superadmin'],
      requireAll: true
    }
  },
];
```

### 3. Use in Components

```typescript
import { Component } from '@angular/core';
import { KeycloakService } from './core/auth';

@Component({
  selector: 'app-header',
  template: `
    @if (isAuthenticated$ | async) {
      <p>{{ (user$ | async)?.name }}</p>
      <button (click)="logout()">Logout</button>
    } @else {
      <button (click)="login()">Login</button>
    }
  `,
})
export class HeaderComponent {
  isAuthenticated$ = this.keycloakService.isAuthenticated$;
  user$ = this.keycloakService.user$;

  constructor(private keycloakService: KeycloakService) {}

  login() {
    this.keycloakService.login();
  }

  logout() {
    this.keycloakService.logout();
  }
}
```

## Features

### Automatic Token Injection

All HTTP requests automatically include the access token:

```typescript
// No configuration needed - works automatically
this.http.get('/api/users').subscribe(...);
// Request includes: Authorization: Bearer <token>
```

### Token Refresh

Tokens refresh automatically:
- Every 60 seconds (if expiring soon)
- Before HTTP requests (if expiring in < 30s)
- On token expiration events

### Role Checks

```typescript
// Check single role
if (this.keycloakService.hasRole('admin')) {
  // User is admin
}

// Check multiple roles (ANY)
if (this.keycloakService.hasAnyRole(['admin', 'moderator'])) {
  // User has at least one role
}

// Check multiple roles (ALL)
if (this.keycloakService.hasAllRoles(['admin', 'superuser'])) {
  // User has both roles
}

// Get all roles
const roles = this.keycloakService.getUserRoles();
```

### User Information

```typescript
// Get current user
const user = this.keycloakService.getUser();
console.log(user?.name, user?.email);

// Get token
const token = this.keycloakService.getToken();

// Check login status
const isLoggedIn = this.keycloakService.isLoggedIn();
```

## Configuration

### Environment Setup

| Environment | Keycloak URL | Realm | Client ID |
|------------|--------------|-------|-----------|
| **Dev** | `http://localhost:8080` | `selfservices-dev` | `selfservices-app-dev` |
| **Minusone** | *Configure in env file* | `selfservices-minusone` | `selfservices-app-minusone` |
| **Prod** | *Configure in env file* | `selfservices` | `selfservices-app` |

### HTTP Interceptor Exclusions

To exclude URLs from token injection, edit [src/app/core/auth/keycloak.interceptor.ts](src/app/core/auth/keycloak.interceptor.ts):

```typescript
const EXCLUDED_URLS: string[] = [
  '/public/api',
  '/assets/',
];
```

## Keycloak Setup

### Client Configuration

1. **Create Client** in Keycloak admin console
2. **Client ID**: `selfservices-app-dev` (or appropriate for environment)
3. **Client Protocol**: openid-connect
4. **Access Type**: public
5. **Valid Redirect URIs**: `http://localhost:4200/*`
6. **Web Origins**: `http://localhost:4200`

### Required Settings

- ✅ Standard Flow Enabled
- ✅ Implicit Flow Enabled (optional)
- ✅ Direct Access Grants Enabled
- ❌ Service Accounts Enabled

### PKCE Configuration

The app uses PKCE (Proof Key for Code Exchange) for enhanced security:
- **Method**: S256
- **Required**: Enabled in Keycloak client settings

## Architecture

```
Application Startup
       ↓
APP_INITIALIZER (keycloak.initializer.ts)
       ↓
KeycloakService.init()
       ↓
Keycloak Authentication Check
       ↓
Load User Profile (if authenticated)
       ↓
Setup Token Refresh
       ↓
Angular App Starts
```

### Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **KeycloakService** | Main auth service | `core/auth/keycloak.service.ts` |
| **APP_INITIALIZER** | Bootstrap function | `core/auth/keycloak.initializer.ts` |
| **HTTP Interceptor** | Token injection | `core/auth/keycloak.interceptor.ts` |
| **AuthGuard** | Route protection | `core/auth/auth.guard.ts` |
| **RoleGuard** | Role-based protection | `core/auth/role.guard.ts` |

## Guards Usage

### AuthGuard

Protects routes requiring authentication:

```typescript
{
  path: 'protected',
  canActivate: [authGuard],
  component: ProtectedComponent
}
```

If user is not authenticated, they're redirected to Keycloak login.

### RoleGuard

Protects routes based on roles:

```typescript
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin'],
    requireAll: false  // Has ANY role (default)
  },
  component: AdminComponent
}
```

**Always use `authGuard` before `roleGuard`** to ensure user is authenticated.

## Common Use Cases

### Login Button

```typescript
login() {
  this.keycloakService.login();
  // Redirects to Keycloak login page
}
```

### Logout Button

```typescript
logout() {
  this.keycloakService.logout();
  // Clears session and redirects
}
```

### Show Content Based on Role

```typescript
@Component({
  template: `
    @if (isAdmin) {
      <button>Admin Panel</button>
    }
  `
})
export class MyComponent {
  get isAdmin() {
    return this.keycloakService.hasRole('admin');
  }

  constructor(private keycloakService: KeycloakService) {}
}
```

### Programmatic Navigation with Auth

```typescript
navigateToProtectedPage() {
  if (!this.keycloakService.isLoggedIn()) {
    this.keycloakService.login('/protected-page');
    return;
  }
  this.router.navigate(['/protected-page']);
}
```

## Security

### Token Storage
- Tokens stored in memory only (not localStorage/sessionStorage)
- Automatically cleared on logout

### Token Refresh
- Automatic refresh prevents session expiration
- Refresh fails = automatic logout

### PKCE Flow
- Enhanced security with code challenge/verifier
- Protects against authorization code interception

### Silent SSO
- Uses hidden iframe for background auth checks
- File: `/assets/silent-check-sso.html`

## Troubleshooting

### Login Redirect Loop
**Problem**: App keeps redirecting to login
**Solutions**:
- Verify Keycloak client redirect URIs
- Check environment configuration
- Ensure `onLoad: 'check-sso'` in service

### Token Not Added to Requests
**Problem**: HTTP requests missing Authorization header
**Solutions**:
- Check if user is authenticated
- Verify URL not in EXCLUDED_URLS
- Confirm interceptor is registered in app.config.ts

### Role Checks Failing
**Problem**: Role checks return false for valid roles
**Solutions**:
- Verify roles exist in Keycloak realm
- Check role mappings in Keycloak client
- Inspect token: `keycloakService.getTokenParsed()`

### CORS Errors
**Problem**: CORS errors when accessing Keycloak
**Solutions**:
- Add app origin to Keycloak client "Web Origins"
- Enable CORS in Keycloak realm settings
- Check Keycloak reverse proxy configuration

## Testing

### Mock Service

```typescript
const mockKeycloakService = jasmine.createSpyObj('KeycloakService', [
  'isLoggedIn',
  'hasRole',
  'getUser',
  'login',
  'logout'
]);

mockKeycloakService.isLoggedIn.and.returnValue(true);
mockKeycloakService.hasRole.and.returnValue(true);

TestBed.configureTestingModule({
  providers: [
    { provide: KeycloakService, useValue: mockKeycloakService }
  ]
});
```

## Documentation

- **Detailed Guide**: [src/app/core/auth/README.md](src/app/core/auth/README.md)
- **Environment Config**: [ENVIRONMENTS.md](ENVIRONMENTS.md)
- **Architecture**: [src/app/ARCHITECTURE.md](src/app/ARCHITECTURE.md)

## Related

- [Keycloak 26 Documentation](https://www.keycloak.org/docs/26.0/)
- [keycloak-js Adapter](https://www.keycloak.org/docs/26.0/securing_apps/#_javascript_adapter)
