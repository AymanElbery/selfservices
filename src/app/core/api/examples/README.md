# API Service Examples

This folder contains example implementations demonstrating best practices for using `BaseApiService`.

## Files

- **example-user.service.ts** - Complete example of a feature service using BaseApiService

## Usage

These examples are for **reference only**. Actual feature services should be created in:

```
features/<feature-name>/services/
```

## Example: Creating a Feature Service

### 1. Define Your Model

```typescript
// features/products/models/product.model.ts
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}
```

### 2. Add Endpoints

```typescript
// core/api/api-endpoints.ts
export const API_ENDPOINTS = {
  // ... existing endpoints

  products: {
    list: '/products',
    byId: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
  },
};
```

### 3. Create Service

```typescript
// features/products/services/products.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService, API_ENDPOINTS } from '@core/api';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  constructor(private apiService: BaseApiService) {}

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(API_ENDPOINTS.products.list);
  }

  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(API_ENDPOINTS.products.byId(id));
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.apiService.post<Product>(API_ENDPOINTS.products.create, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.apiService.put<Product>(API_ENDPOINTS.products.update(id), product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.apiService.delete<void>(API_ENDPOINTS.products.delete(id));
  }
}
```

### 4. Use in Components

```typescript
// features/products/components/products-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products-list',
  template: `
    @for (product of products(); track product.id) {
      <div>{{ product.name }} - ${{ product.price }}</div>
    }
  `,
})
export class ProductsListComponent implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productsService: ProductsService) {}

  ngOnInit() {
    this.productsService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }
}
```

## Best Practices

See the example service for:

- ✅ Proper TypeScript typing
- ✅ Using centralized endpoints
- ✅ DTOs for create/update operations
- ✅ Query parameters
- ✅ Pagination
- ✅ Response wrapping
- ✅ Method documentation

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { BaseApiService } from '@core/api';
import { of } from 'rxjs';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let apiServiceSpy: jasmine.SpyObj<BaseApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('BaseApiService', ['get', 'post', 'put', 'delete']);

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
    const mockProducts = [{ id: '1', name: 'Test', price: 100, category: 'Test' }];
    apiServiceSpy.get.and.returnValue(of(mockProducts));

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });
  });
});
```
