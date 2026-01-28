# API Service Quick Reference

Centralized HTTP service for all API operations.

## Overview

**BaseApiService** wraps HttpClient with typed methods and centralized configuration.

**Rules:**
- ❌ **Never** inject `HttpClient` directly in features
- ✅ **Always** use `BaseApiService`
- ✅ **Always** define endpoints in `api-endpoints.ts`

## Quick Start

### 1. Define Endpoints

```typescript
// core/api/api-endpoints.ts
export const API_ENDPOINTS = {
  products: {
    list: '/products',
    byId: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
};
```

### 2. Create Service

```typescript
// features/products/services/products.service.ts
import { Injectable } from '@angular/core';
import { BaseApiService, API_ENDPOINTS } from '@core/api';

interface Product {
  id: string;
  name: string;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private apiService: BaseApiService) {}

  getProducts() {
    return this.apiService.get<Product[]>(API_ENDPOINTS.products.list);
  }

  getProductById(id: string) {
    return this.apiService.get<Product>(API_ENDPOINTS.products.byId(id));
  }

  createProduct(product: Omit<Product, 'id'>) {
    return this.apiService.post<Product>(API_ENDPOINTS.products.create, product);
  }

  updateProduct(id: string, product: Partial<Product>) {
    return this.apiService.put<Product>(API_ENDPOINTS.products.update(id), product);
  }

  deleteProduct(id: string) {
    return this.apiService.delete<void>(API_ENDPOINTS.products.delete(id));
  }
}
```

### 3. Use in Components

```typescript
export class ProductsComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }
}
```

## Available Methods

### GET

```typescript
apiService.get<T>(endpoint, options?)

// Examples:
apiService.get<User[]>('/users')
apiService.get<User>('/users/123')
apiService.get<User[]>('/users', { params: { status: 'active' } })
```

### POST

```typescript
apiService.post<T>(endpoint, body, options?)

// Example:
apiService.post<User>('/users', {
  name: 'John',
  email: 'john@example.com'
})
```

### PUT

```typescript
apiService.put<T>(endpoint, body, options?)

// Example:
apiService.put<User>('/users/123', {
  name: 'John Updated'
})
```

### PATCH

```typescript
apiService.patch<T>(endpoint, body, options?)

// Example:
apiService.patch<User>('/users/123', {
  name: 'John'  // Partial update
})
```

### DELETE

```typescript
apiService.delete<T>(endpoint, options?)

// Examples:
apiService.delete<void>('/users/123')
apiService.delete<{ success: boolean }>('/users/123')
```

## Common Patterns

### With Query Parameters

```typescript
searchProducts(query: string) {
  return this.apiService.get<Product[]>('/products/search', {
    params: { q: query, limit: 10 }
  });
}
```

### With Custom Headers

```typescript
getWithAuth() {
  return this.apiService.get<Data>('/data', {
    headers: { 'X-Custom-Header': 'value' }
  });
}
```

### Pagination

```typescript
import { PaginatedResponse } from '@core/api';

getProducts(page: number) {
  return this.apiService.get<PaginatedResponse<Product>>('/products', {
    params: { page, pageSize: 10 }
  });
}
```

### File Upload

```typescript
uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return this.apiService.post('/files/upload', formData, {
    reportProgress: true
  });
}
```

### File Download

```typescript
downloadFile(id: string) {
  return this.apiService.get<Blob>(`/files/${id}`, {
    responseType: 'blob'
  });
}
```

## Response Types

```typescript
// Simple response
interface User {
  id: string;
  name: string;
}

// Wrapped response
import { ApiResponse } from '@core/api';
apiService.get<ApiResponse<User>>('/users/123')

// Paginated response
import { PaginatedResponse } from '@core/api';
apiService.get<PaginatedResponse<User>>('/users')

// List response
import { ListResponse } from '@core/api';
apiService.get<ListResponse<User>>('/users')
```

## Integration with NgRx

```typescript
// effects/products.effects.ts
loadProducts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(ProductsActions.loadProducts),
    switchMap(() =>
      this.apiService.get<Product[]>(API_ENDPOINTS.products.list).pipe(
        map(products => ProductsActions.loadProductsSuccess({ products })),
        catchError(error => of(ProductsActions.loadProductsFailure({ error })))
      )
    )
  )
);
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

## Environment Configuration

API base URL is automatically loaded from environment:

```typescript
// environment.development.ts
apiUrl: 'http://localhost:3000/api'

// environment.production.ts
apiUrl: 'https://api.example.com/api'
```

The service automatically uses the correct URL:

```typescript
// Resolves to: http://localhost:3000/api/users (dev)
// Resolves to: https://api.example.com/api/users (prod)
this.apiService.get('/users');
```

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { BaseApiService } from '@core/api';
import { of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;
  let apiServiceSpy: jasmine.SpyObj<BaseApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BaseApiService', [
      'get', 'post', 'put', 'delete'
    ]);

    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: BaseApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(ProductsService);
    apiServiceSpy = TestBed.inject(BaseApiService) as jasmine.SpyObj<BaseApiService>;
  });

  it('should get products', () => {
    const mockProducts = [{ id: '1', name: 'Test', price: 100 }];
    apiServiceSpy.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('/products');
  });
});
```

## Best Practices

### ✅ DO

- Use `BaseApiService` for all HTTP operations
- Define endpoints in `api-endpoints.ts`
- Use TypeScript interfaces for all responses
- Handle errors appropriately
- Type all API responses

### ❌ DON'T

- Don't inject `HttpClient` directly
- Don't hardcode URLs in services
- Don't skip type definitions
- Don't ignore error handling

## Migration from HttpClient

### Before ❌

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

getUsers() {
  return this.http.get('http://localhost:3000/api/users');
}
```

### After ✅

```typescript
import { BaseApiService, API_ENDPOINTS } from '@core/api';

constructor(private apiService: BaseApiService) {}

getUsers() {
  return this.apiService.get<User[]>(API_ENDPOINTS.users.list);
}
```

## Features

- ✅ Typed HTTP methods
- ✅ Centralized API configuration
- ✅ Automatic base URL management
- ✅ Environment-based configuration
- ✅ Automatic token injection (via Keycloak interceptor)
- ✅ Type-safe responses
- ✅ Request options support
- ✅ Easy to test

## Documentation

- **Detailed Guide**: [src/app/core/api/README.md](src/app/core/api/README.md)
- **Examples**: [src/app/core/api/examples/](src/app/core/api/examples/)
- **Architecture**: [src/app/ARCHITECTURE.md](src/app/ARCHITECTURE.md)

## Example Service

See complete example: [src/app/core/api/examples/example-user.service.ts](src/app/core/api/examples/example-user.service.ts)
