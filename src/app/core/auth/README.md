# Keycloak Authentication Module

This module provides complete Keycloak 26 integration for the application. All Keycloak-related code is isolated in this `core/auth` folder.

## Overview

The authentication module includes:

- **KeycloakService**: Central service for authentication operations
- **APP_INITIALIZER**: Bootstraps Keycloak before Angular app starts
- **HTTP Interceptor**: Automatically injects access tokens into requests
- **AuthGuard**: Protects routes requiring authentication
- **RoleGuard**: Protects routes based on user roles
- **Token Refresh**: Automatic token refresh handling
- **User Management**: User profile and role management

## Architecture

```
core/auth/
├── keycloak.service.ts         # Main Keycloak service
├── keycloak.initializer.ts     # APP_INITIALIZER factory
├── keycloak.interceptor.ts     # HTTP interceptor for token injection
├── auth.guard.ts               # Authentication guard
├── role.guard.ts               # Role-based guard
├── models/
│   └── keycloak-user.model.ts  # User type definitions
├── index.ts                    # Public API exports
└── README.md                   # This file
```

## Configuration

Keycloak configuration is loaded from environment files:

```typescript
// environment.ts
export const environment = {
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'selfservices-dev',
    clientId: 'selfservices-app-dev',
  },
};
```

See [Environment Configuration](../../../../ENVIRONMENTS.md) for details.

## Features

### 1. Automatic Initialization

Keycloak initializes automatically on app startup via `APP_INITIALIZER`:

```typescript
// Configured in app.config.ts
{
  provide: APP_INITIALIZER,
  useFactory: initializeKeycloak,
  deps: [KeycloakService],
  multi: true,
}
```

**Initialization Options:**
- `onLoad: 'check-sso'` - Silent SSO check
- `pkceMethod: 'S256'` - PKCE for enhanced security
- `checkLoginIframe: false` - Disabled for better compatibility

### 2. Automatic Token Injection

The HTTP interceptor automatically adds the access token to outgoing requests:

```typescript
// Configured in app.config.ts
provideHttpClient(
  withInterceptors([keycloakInterceptor])
)
```

**Features:**
- Automatic token refresh before requests (if expiring in < 30s)
- Configurable excluded URLs
- Bearer token format

### 3. Automatic Token Refresh

Token refresh happens automatically:
- Every 60 seconds (if token expires in < 70s)
- Before HTTP requests (if token expires in < 30s)
- On token expiration event

### 4. Route Protection

#### Basic Authentication

Protect routes requiring login:

```typescript
// app.routes.ts
{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
}
```

#### Role-Based Protection

Protect routes based on user roles:

```typescript
// app.routes.ts
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin', 'superadmin'],
    requireAll: false  // Has ANY of the roles (default)
  }
}

// Require ALL roles
{
  path: 'super-admin',
  component: SuperAdminComponent,
  canActivate: [authGuard, roleGuard],
  data: {
    roles: ['admin', 'superadmin'],
    requireAll: true  // Must have ALL roles
  }
}
```

## Using KeycloakService

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { KeycloakService } from './core/auth';

@Component({
  selector: 'app-user-profile',
  template: `
    @if (isAuthenticated$ | async) {
      <p>Welcome, {{ (user$ | async)?.name }}</p>
      <button (click)="logout()">Logout</button>
    } @else {
      <button (click)="login()">Login</button>
    }
  `,
})
export class UserProfileComponent {
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

### Check Authentication Status

```typescript
// Synchronous check
const isLoggedIn = this.keycloakService.isLoggedIn();

// Observable
this.keycloakService.isAuthenticated$.subscribe(authenticated => {
  console.log('Authenticated:', authenticated);
});
```

### Get User Information

```typescript
// Get current user
const user = this.keycloakService.getUser();
console.log('User:', user?.name, user?.email);

// Observable
this.keycloakService.user$.subscribe(user => {
  console.log('User:', user);
});

// Get user roles
const roles = this.keycloakService.getUserRoles();
console.log('Roles:', roles);
```

### Role Checks

```typescript
// Check single role
if (this.keycloakService.hasRole('admin')) {
  // User has admin role
}

// Check if user has ANY of the roles
if (this.keycloakService.hasAnyRole(['admin', 'moderator'])) {
  // User has at least one of these roles
}

// Check if user has ALL roles
if (this.keycloakService.hasAllRoles(['admin', 'superuser'])) {
  // User has both roles
}
```

### Token Management

```typescript
// Get access token
const token = this.keycloakService.getToken();

// Get parsed token
const tokenParsed = this.keycloakService.getTokenParsed();
console.log('Token expires at:', new Date(tokenParsed.exp * 1000));

// Manually refresh token
await this.keycloakService.updateToken(60);
```

### Login/Logout

```typescript
// Login with optional redirect
this.keycloakService.login('/dashboard');

// Logout with optional redirect
this.keycloakService.logout('/');
```

## Role-Based UI

### Using Directives (Custom)

Create a custom directive for role-based UI:

```typescript
// shared/directives/has-role.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { KeycloakService } from '../../core/auth';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private keycloakService: KeycloakService
  ) {}

  @Input() set appHasRole(roles: string | string[]) {
    const roleArray = Array.isArray(roles) ? roles : [roles];
    const hasRole = this.keycloakService.hasAnyRole(roleArray);

    if (hasRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
```

Usage:

```typescript
<button *appHasRole="'admin'">Admin Panel</button>
<div *appHasRole="['admin', 'moderator']">Admin or Moderator Content</div>
```

### Using Signals

```typescript
import { Component, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

export class MyComponent {
  user = toSignal(this.keycloakService.user$);
  isAdmin = computed(() =>
    this.keycloakService.hasRole('admin')
  );

  constructor(private keycloakService: KeycloakService) {}
}
```

## HTTP Interceptor Configuration

### Excluding URLs from Token Injection

Edit `keycloak.interceptor.ts`:

```typescript
const EXCLUDED_URLS: string[] = [
  '/public/api',
  '/assets/',
  'https://external-api.com',
];
```

### Customizing Token Refresh

The interceptor refreshes tokens before requests if they expire in < 30 seconds. Adjust in `keycloak.interceptor.ts`:

```typescript
// Current: refresh if expires in < 30s
return from(keycloakService.updateToken(30))

// Change to 60s
return from(keycloakService.updateToken(60))
```

## Error Handling

The service handles various error scenarios:

### Token Expiration
- Automatically refreshes tokens before expiration
- Redirects to login if refresh fails

### Authentication Errors
- Logs errors and redirects to login
- Clears authentication state

### Network Errors
- HTTP interceptor allows requests to fail naturally
- Token refresh failures trigger logout

## Events

Keycloak events are handled automatically:

```typescript
// Token expired
onTokenExpired: () => {
  // Attempts refresh automatically
}

// Authentication error
onAuthError: () => {
  // Logs out user
}

// User logged out
onAuthLogout: () => {
  // Clears auth state
}
```

## Security Considerations

### PKCE Flow
- Uses PKCE (Proof Key for Code Exchange) for enhanced security
- Configured with S256 method

### Token Storage
- Tokens stored in memory only (not localStorage)
- Automatically cleared on logout or error

### Silent SSO
- Uses hidden iframe for silent authentication checks
- File: `/assets/silent-check-sso.html`

### Token Refresh
- Automatic refresh before expiration
- Prevents unnecessary re-authentication

## Troubleshooting

### Infinite Redirect Loop
- Check Keycloak client redirect URIs
- Ensure `onLoad: 'check-sso'` is set
- Verify environment configuration

### Token Not Injected
- Check if URL is in EXCLUDED_URLS
- Verify user is authenticated
- Check HTTP interceptor is registered

### Roles Not Working
- Verify roles exist in Keycloak realm
- Check token contains role claims
- Ensure role mapping is configured

### CORS Errors
- Configure Keycloak client CORS settings
- Add application origin to allowed origins

## Development vs Production

### Development
- Keycloak URL: `http://localhost:8080`
- Realm: `selfservices-dev`
- Token refresh: Verbose logging enabled

### Production
- Keycloak URL: Production server
- Realm: `selfservices`
- Token refresh: Silent mode
- Error handling: User-friendly messages

## Testing

### Mock KeycloakService

```typescript
// test.spec.ts
const mockKeycloakService = {
  isLoggedIn: () => true,
  hasRole: (role: string) => role === 'admin',
  getUser: () => ({ name: 'Test User', email: 'test@example.com' }),
  // ... other methods
};

TestBed.configureTestingModule({
  providers: [
    { provide: KeycloakService, useValue: mockKeycloakService }
  ]
});
```

### Testing Guards

```typescript
it('should allow access with valid role', () => {
  spyOn(keycloakService, 'hasAnyRole').and.returnValue(true);
  const result = TestBed.runInInjectionContext(() =>
    roleGuard(mockRoute, mockState)
  );
  expect(result).toBe(true);
});
```

## API Reference

See inline documentation in:
- [keycloak.service.ts](./keycloak.service.ts)
- [auth.guard.ts](./auth.guard.ts)
- [role.guard.ts](./role.guard.ts)

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/docs/26.0/)
- [keycloak-js Adapter](https://www.keycloak.org/docs/26.0/securing_apps/#_javascript_adapter)
- [Environment Configuration](../../../../ENVIRONMENTS.md)
