# API Module

Centralized API service for all HTTP operations. **Features should use `BaseApiService` instead of directly injecting `HttpClient`.**

## Overview

The API module provides:

- **BaseApiService**: Typed HTTP methods (GET, POST, PUT, DELETE, PATCH)
- **API_ENDPOINTS**: Centralized endpoint definitions
- **Type Safety**: Typed request/response models
- **Automatic Token Injection**: Via Keycloak interceptor
- **Environment Configuration**: Automatic base URL from environment

## Architecture

```
core/api/
├── base-api.service.ts       # Main API service (wraps HttpClient)
├── api-endpoints.ts           # Centralized endpoint definitions
├── models/
│   └── api-response.model.ts  # Common response types
├── index.ts                   # Public API exports
└── README.md                  # This file
```

## BaseApiService

### Purpose

Central service that wraps `HttpClient` with:
- Type-safe HTTP methods
- Automatic base URL handling
- Environment-based configuration
- Consistent API patterns

### Why Not Use HttpClient Directly?

**Rules:**
1. ❌ **Never** inject `HttpClient` directly in feature services
2. ✅ **Always** use `BaseApiService` instead
3. ✅ **Always** define endpoints in `api-endpoints.ts`

**Benefits:**
- Centralized API URL management
- Type safety enforced
- Easier to mock in tests
- Consistent error handling
- Single point for API configuration changes

## Usage

### 1. Basic Usage

```typescript
import { Injectable } from '@angular/core';
import { BaseApiService } from '@core/api';
import { Observable } from 'rxjs';

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: BaseApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>('/users');
  }

  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(`/users/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.apiService.post<User>('/users', user);
  }

  updateUser(id: string, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(`/users/${id}`);
  }
}
```

### 2. Using Centralized Endpoints

```typescript
import { Injectable } from '@angular/core';
import { BaseApiService, API_ENDPOINTS } from '@core/api';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: BaseApiService) {}

  getUsers() {
    return this.apiService.get<User[]>(API_ENDPOINTS.users.list);
  }

  getUserById(id: string) {
    return this.apiService.get<User>(API_ENDPOINTS.users.byId(id));
  }

  createUser(user: Omit<User, 'id'>) {
    return this.apiService.post<User>(API_ENDPOINTS.users.create, user);
  }

  updateUser(id: string, user: Partial<User>) {
    return this.apiService.put<User>(API_ENDPOINTS.users.update(id), user);
  }

  deleteUser(id: string) {
    return this.apiService.delete<void>(API_ENDPOINTS.users.delete(id));
  }
}
```

### 3. With Response Types

```typescript
import { BaseApiService, ApiResponse, PaginatedResponse } from '@core/api';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private apiService: BaseApiService) {}

  // Standard response wrapper
  getProduct(id: string): Observable<ApiResponse<Product>> {
    return this.apiService.get<ApiResponse<Product>>(`/products/${id}`);
  }

  // Paginated response
  getProducts(page: number = 1): Observable<PaginatedResponse<Product>> {
    return this.apiService.get<PaginatedResponse<Product>>('/products', {
      params: { page: page.toString() }
    });
  }
}
```

### 4. With Request Options

```typescript
import { BaseApiService } from '@core/api';

@Injectable({ providedIn: 'root' })
export class FileService {
  constructor(private apiService: BaseApiService) {}

  // Download file as blob
  downloadFile(fileId: string): Observable<Blob> {
    return this.apiService.get<Blob>(`/files/${fileId}`, {
      responseType: 'blob'
    });
  }

  // Upload file with progress
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.apiService.post('/files/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  // Custom headers
  getWithCustomHeaders(): Observable<any> {
    return this.apiService.get('/data', {
      headers: {
        'X-Custom-Header': 'value'
      }
    });
  }

  // Query parameters
  searchProducts(query: string): Observable<Product[]> {
    return this.apiService.get<Product[]>('/products/search', {
      params: { q: query }
    });
  }
}
```

## API Methods

### get<T>(endpoint, options?)

HTTP GET request

```typescript
// Simple GET
this.apiService.get<User[]>('/users');

// With query params
this.apiService.get<User[]>('/users', {
  params: { status: 'active', limit: 10 }
});

// With custom headers
this.apiService.get<User[]>('/users', {
  headers: { 'X-Custom': 'value' }
});
```

### post<T>(endpoint, body, options?)

HTTP POST request

```typescript
// Create resource
this.apiService.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
});

// With custom headers
this.apiService.post<User>('/users', userData, {
  headers: { 'Content-Type': 'application/json' }
});
```

### put<T>(endpoint, body, options?)

HTTP PUT request (full update)

```typescript
// Update resource
this.apiService.put<User>(`/users/${id}`, {
  name: 'John Updated',
  email: 'john.updated@example.com'
});
```

### patch<T>(endpoint, body, options?)

HTTP PATCH request (partial update)

```typescript
// Partial update
this.apiService.patch<User>(`/users/${id}`, {
  name: 'John'  // Only update name
});
```

### delete<T>(endpoint, options?)

HTTP DELETE request

```typescript
// Delete resource
this.apiService.delete<void>(`/users/${id}`);

// Delete with response
this.apiService.delete<{ success: boolean }>(`/users/${id}`);
```

## Adding New Endpoints

### 1. Define in api-endpoints.ts

```typescript
// src/app/core/api/api-endpoints.ts
export const API_ENDPOINTS = {
  // ... existing endpoints

  products: {
    list: '/products',
    byId: (id: string | number) => `/products/${id}`,
    search: '/products/search',
    categories: '/products/categories',
  },
} as const;
```

### 2. Create Feature Service

```typescript
// src/app/features/products/services/products.service.ts
import { Injectable } from '@angular/core';
import { BaseApiService, API_ENDPOINTS } from '@core/api';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private apiService: BaseApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(API_ENDPOINTS.products.list);
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(API_ENDPOINTS.products.byId(id));
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.apiService.get<Product[]>(API_ENDPOINTS.products.search, {
      params: { q: query }
    });
  }
}
```

## Response Models

### Standard Response

```typescript
import { ApiResponse } from '@core/api';

interface User {
  id: string;
  name: string;
}

// API returns: { data: User, success: true, message: "User found" }
this.apiService.get<ApiResponse<User>>('/users/123').subscribe(response => {
  const user = response.data;
  console.log(response.message);
});
```

### Paginated Response

```typescript
import { PaginatedResponse } from '@core/api';

// API returns paginated data
this.apiService.get<PaginatedResponse<User>>('/users').subscribe(response => {
  const users = response.data;
  const { page, pageSize, total } = response.pagination;
});
```

### List Response

```typescript
import { ListResponse } from '@core/api';

// API returns items with total count
this.apiService.get<ListResponse<User>>('/users').subscribe(response => {
  const users = response.items;
  const total = response.total;
});
```

## Environment Configuration

The base API URL is automatically loaded from environment:

```typescript
// environment.development.ts
export const environment = {
  apiUrl: 'http://localhost:3000/api',
  // ... other config
};

// environment.production.ts
export const environment = {
  apiUrl: 'https://api.example.com/api',
  // ... other config
};
```

The service automatically uses the correct URL:

```typescript
// In development: http://localhost:3000/api/users
// In production: https://api.example.com/api/users
this.apiService.get('/users');
```

## Full URL Override

If you need to call an external API:

```typescript
// Use full URL to bypass baseUrl
this.apiService.get<any>('https://external-api.com/data');
```

## Error Handling

```typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

this.apiService.get<User[]>('/users').pipe(
  catchError(error => {
    console.error('API Error:', error);
    // Handle error
    return throwError(() => error);
  })
).subscribe({
  next: users => console.log('Users:', users),
  error: err => console.error('Error:', err)
});
```

## Integration with NgRx

```typescript
// effects/users.effects.ts
@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private apiService: BaseApiService
  ) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.apiService.get<User[]>(API_ENDPOINTS.users.list).pipe(
          map(users => UsersActions.loadUsersSuccess({ users })),
          catchError(error =>
            of(UsersActions.loadUsersFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
```

## Testing

### Mock BaseApiService

```typescript
// test.spec.ts
import { TestBed } from '@angular/core/testing';
import { BaseApiService } from '@core/api';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let apiServiceSpy: jasmine.SpyObj<BaseApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BaseApiService', ['get', 'post', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: BaseApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(UserService);
    apiServiceSpy = TestBed.inject(BaseApiService) as jasmine.SpyObj<BaseApiService>;
  });

  it('should get users', () => {
    const mockUsers = [{ id: '1', name: 'Test' }];
    apiServiceSpy.get.and.returnValue(of(mockUsers));

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/users');
  });
});
```

## Best Practices

### ✅ DO

- Use `BaseApiService` for all HTTP operations
- Define endpoints in `api-endpoints.ts`
- Use TypeScript interfaces for request/response types
- Handle errors appropriately
- Use query parameters for filtering/pagination

### ❌ DON'T

- Don't inject `HttpClient` directly in feature services
- Don't hardcode API URLs in components/services
- Don't skip type definitions for responses
- Don't ignore error handling

## Migration from HttpClient

### Before (❌)

```typescript
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get('http://localhost:3000/api/users');
  }
}
```

### After (✅)

```typescript
import { BaseApiService, API_ENDPOINTS } from '@core/api';

@Injectable()
export class UserService {
  constructor(private apiService: BaseApiService) {}

  getUsers() {
    return this.apiService.get<User[]>(API_ENDPOINTS.users.list);
  }
}
```

## Common Patterns

### CRUD Operations

```typescript
@Injectable({ providedIn: 'root' })
export class CrudService<T> {
  constructor(private apiService: BaseApiService) {}

  getAll(endpoint: string): Observable<T[]> {
    return this.apiService.get<T[]>(endpoint);
  }

  getById(endpoint: string, id: string): Observable<T> {
    return this.apiService.get<T>(`${endpoint}/${id}`);
  }

  create(endpoint: string, item: T): Observable<T> {
    return this.apiService.post<T>(endpoint, item);
  }

  update(endpoint: string, id: string, item: Partial<T>): Observable<T> {
    return this.apiService.put<T>(`${endpoint}/${id}`, item);
  }

  delete(endpoint: string, id: string): Observable<void> {
    return this.apiService.delete<void>(`${endpoint}/${id}`);
  }
}
```

### Caching with RxJS

```typescript
@Injectable({ providedIn: 'root' })
export class CachedUserService {
  private cache$ = new BehaviorSubject<User[] | null>(null);

  constructor(private apiService: BaseApiService) {}

  getUsers(forceRefresh = false): Observable<User[]> {
    if (!forceRefresh && this.cache$.value) {
      return of(this.cache$.value);
    }

    return this.apiService.get<User[]>('/users').pipe(
      tap(users => this.cache$.next(users))
    );
  }
}
```

## Related Documentation

- [Environment Configuration](../../../../ENVIRONMENTS.md)
- [Authentication](../../auth/README.md)
- [Application Architecture](../../../ARCHITECTURE.md)
