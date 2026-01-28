# Selfservices2

An Angular 20 application built with feature-based architecture, NgRx state management, and multi-environment support.

## Architecture

This project follows a **feature-based architecture** with:
- **NgRx Store + Effects** for state management with Signals integration
- **Lazy-loaded features** for optimal performance
- **Multi-environment configuration** (dev, staging, production)
- **Type-safe environment configuration** with Keycloak integration

📖 [View Architecture Documentation](src/app/ARCHITECTURE.md)

## Project Structure

```
src/app/
├── core/        # Singleton services, guards, interceptors
│   ├── api/    # Centralized API service (BaseApiService)
│   └── auth/   # Keycloak authentication
├── shared/      # Reusable components, directives, pipes
├── features/    # Business domain modules (lazy-loaded)
├── store/       # Global NgRx state management
└── environments/ # Environment configurations
```

## Quick Start

### Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Environment Configuration

This project supports three environments: **dev**, **minusone** (staging), and **prod**.

### Build for Different Environments

```bash
# Development
npm run build:dev

# Minus One (Staging)
npm run build:minusone

# Production
npm run build:prod
```

### Serve Different Environments

```bash
# Development (default)
npm start

# Minus One (Staging)
npm run start:minusone

# Production
npm run start:prod
```

📖 [Environment Configuration Guide](ENVIRONMENTS.md)

## Authentication & Authorization

This project uses **Keycloak 26** for authentication and authorization:

```typescript
// Protect routes
{
  path: 'admin',
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin'] }
}

// Use in components
export class MyComponent {
  isAuthenticated$ = this.keycloakService.isAuthenticated$;
  user$ = this.keycloakService.user$;
}
```

**Features:**
- Automatic initialization via APP_INITIALIZER
- HTTP interceptor for token injection
- Route guards (authGuard, roleGuard)
- Automatic token refresh
- Role-based access control

📖 [Authentication Guide](AUTHENTICATION.md)

## API Service

All HTTP operations use the centralized `BaseApiService`:

```typescript
// Feature service example
@Injectable()
export class UsersService {
  constructor(private apiService: BaseApiService) {}

  getUsers() {
    return this.apiService.get<User[]>('/users');
  }
}
```

**Rules:**
- ❌ Never inject `HttpClient` directly
- ✅ Always use `BaseApiService`
- ✅ Define endpoints in `api-endpoints.ts`

📖 [API Service Guide](src/app/core/api/README.md)

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## State Management (NgRx)

This project uses **NgRx Store + Effects** with **Signals integration**:

```typescript
// Using NgRx with signals in components
export class MyComponent {
  data = this.store.selectSignal(selectData);

  constructor(private store: Store) {}
}
```

📖 [NgRx Guide](src/app/NGRX_GUIDE.md)

## Key Features

- ✅ **Feature-based architecture** with lazy loading
- ✅ **NgRx Store + Effects** with signals integration
- ✅ **Centralized API service** with typed methods
- ✅ **Keycloak 26 authentication** with automatic token management
- ✅ **Role-based access control** with guards
- ✅ **Multi-environment support** (dev, minusone, prod)
- ✅ **Type-safe configuration** with interfaces
- ✅ **HTTP interceptor** for automatic token injection
- ✅ **Redux DevTools** support
- ✅ **Standalone components** (Angular 20+)

## Documentation

- [Application Architecture](src/app/ARCHITECTURE.md) - Architecture overview and patterns
- [API Service Guide](src/app/core/api/README.md) - Centralized HTTP service usage
- [Authentication Guide](AUTHENTICATION.md) - Keycloak integration and usage
- [Environment Configuration](ENVIRONMENTS.md) - Environment setup and usage
- [NgRx Quick Guide](src/app/NGRX_GUIDE.md) - State management examples
- [Features Guide](src/app/features/README.md) - Creating new features
- [Store Guide](src/app/store/README.md) - Global state management
- [Auth Module](src/app/core/auth/README.md) - Detailed Keycloak documentation

## Example Feature

The project includes a complete example feature (`users`) demonstrating:
- Feature-level NgRx store
- Lazy-loaded routes
- Components using signals with `selectSignal`
- CRUD operations with effects

View it at: [src/app/features/users/](src/app/features/users/)

## Additional Resources

- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev/)
- [NgRx Documentation](https://ngrx.io/)
- [Angular Signals](https://angular.dev/guide/signals)
