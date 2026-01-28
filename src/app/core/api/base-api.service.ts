/**
 * Base API Service
 *
 * Central service wrapping HttpClient for all HTTP operations.
 * Features should use this service instead of directly injecting HttpClient.
 *
 * Provides:
 * - Typed HTTP methods (get, post, put, delete)
 * - Centralized API URL management
 * - Automatic token injection (via Keycloak interceptor)
 * - Type-safe responses
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * HTTP request options
 * Note: observe is always 'body' to maintain type safety
 */
export interface ApiRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  responseType?: 'json';
  reportProgress?: boolean;
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  /**
   * Base API URL from environment configuration
   */
  protected readonly baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * HTTP GET request
   *
   * @param endpoint - API endpoint (relative to baseUrl)
   * @param options - Request options
   * @returns Observable of typed response
   *
   * @example
   * this.apiService.get<User[]>('/users')
   * this.apiService.get<User>('/users/123')
   */
  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), options);
  }

  /**
   * HTTP POST request
   *
   * @param endpoint - API endpoint (relative to baseUrl)
   * @param body - Request body
   * @param options - Request options
   * @returns Observable of typed response
   *
   * @example
   * this.apiService.post<User>('/users', { name: 'John', email: 'john@example.com' })
   */
  post<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * HTTP PUT request
   *
   * @param endpoint - API endpoint (relative to baseUrl)
   * @param body - Request body
   * @param options - Request options
   * @returns Observable of typed response
   *
   * @example
   * this.apiService.put<User>('/users/123', { name: 'John Updated' })
   */
  put<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * HTTP PATCH request
   *
   * @param endpoint - API endpoint (relative to baseUrl)
   * @param body - Request body (partial update)
   * @param options - Request options
   * @returns Observable of typed response
   *
   * @example
   * this.apiService.patch<User>('/users/123', { name: 'John' })
   */
  patch<T>(endpoint: string, body: any, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(endpoint), body, options);
  }

  /**
   * HTTP DELETE request
   *
   * @param endpoint - API endpoint (relative to baseUrl)
   * @param options - Request options
   * @returns Observable of typed response
   *
   * @example
   * this.apiService.delete<void>('/users/123')
   * this.apiService.delete<{ success: boolean }>('/users/123')
   */
  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(endpoint), options);
  }

  /**
   * Build full URL from endpoint
   *
   * @param endpoint - Relative endpoint or full URL
   * @returns Full URL
   */
  protected buildUrl(endpoint: string): string {
    // If endpoint is already a full URL, return as-is
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    // Ensure endpoint starts with /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    // Combine baseUrl with endpoint
    return `${this.baseUrl}${normalizedEndpoint}`;
  }

  /**
   * Get the base API URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}
