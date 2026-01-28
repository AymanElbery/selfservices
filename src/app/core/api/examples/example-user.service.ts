/**
 * Example User Service
 *
 * Demonstrates how to use BaseApiService for feature services.
 * This is an example - actual implementation should be in features/<feature>/services/
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from '../base-api.service';
import { API_ENDPOINTS } from '../api-endpoints';
import { ApiResponse, PaginatedResponse } from '../models/api-response.model';

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  createdAt?: Date;
}

/**
 * Create user DTO
 */
export interface CreateUserDto {
  name: string;
  email: string;
  role?: string;
}

/**
 * Update user DTO
 */
export interface UpdateUserDto {
  name?: string;
  email?: string;
  role?: string;
}

/**
 * Example User Service
 *
 * Shows best practices for using BaseApiService:
 * - ✅ Use BaseApiService instead of HttpClient
 * - ✅ Use centralized API_ENDPOINTS
 * - ✅ Define TypeScript interfaces
 * - ✅ Type all responses
 * - ✅ Document methods
 */
@Injectable({
  providedIn: 'root',
})
export class ExampleUserService {
  constructor(private apiService: BaseApiService) {}

  /**
   * Get all users
   *
   * @returns Observable of users array
   */
  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(API_ENDPOINTS.users.list);
  }

  /**
   * Get paginated users
   *
   * @param page - Page number
   * @param pageSize - Number of items per page
   * @returns Observable of paginated response
   */
  getUsersPaginated(page: number = 1, pageSize: number = 10): Observable<PaginatedResponse<User>> {
    return this.apiService.get<PaginatedResponse<User>>(API_ENDPOINTS.users.list, {
      params: {
        page,
        pageSize,
      },
    });
  }

  /**
   * Get user by ID
   *
   * @param id - User ID
   * @returns Observable of user
   */
  getUserById(id: string): Observable<User> {
    return this.apiService.get<User>(API_ENDPOINTS.users.byId(id));
  }

  /**
   * Get user by ID with wrapped response
   *
   * @param id - User ID
   * @returns Observable of API response containing user
   */
  getUserByIdWrapped(id: string): Observable<ApiResponse<User>> {
    return this.apiService.get<ApiResponse<User>>(API_ENDPOINTS.users.byId(id));
  }

  /**
   * Create new user
   *
   * @param userData - User data
   * @returns Observable of created user
   */
  createUser(userData: CreateUserDto): Observable<User> {
    return this.apiService.post<User>(API_ENDPOINTS.users.create, userData);
  }

  /**
   * Update user (full update)
   *
   * @param id - User ID
   * @param userData - User data
   * @returns Observable of updated user
   */
  updateUser(id: string, userData: UpdateUserDto): Observable<User> {
    return this.apiService.put<User>(API_ENDPOINTS.users.update(id), userData);
  }

  /**
   * Update user (partial update)
   *
   * @param id - User ID
   * @param userData - Partial user data
   * @returns Observable of updated user
   */
  patchUser(id: string, userData: Partial<UpdateUserDto>): Observable<User> {
    return this.apiService.patch<User>(API_ENDPOINTS.users.update(id), userData);
  }

  /**
   * Delete user
   *
   * @param id - User ID
   * @returns Observable of void
   */
  deleteUser(id: string): Observable<void> {
    return this.apiService.delete<void>(API_ENDPOINTS.users.delete(id));
  }

  /**
   * Search users
   *
   * Example of using query parameters
   *
   * @param query - Search query
   * @returns Observable of users array
   */
  searchUsers(query: string): Observable<User[]> {
    return this.apiService.get<User[]>(API_ENDPOINTS.users.list, {
      params: { search: query },
    });
  }

  /**
   * Get current user profile
   *
   * @returns Observable of current user
   */
  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>(API_ENDPOINTS.users.profile);
  }

  /**
   * Update current user profile
   *
   * @param userData - User data
   * @returns Observable of updated user
   */
  updateCurrentUser(userData: UpdateUserDto): Observable<User> {
    return this.apiService.put<User>(API_ENDPOINTS.users.profile, userData);
  }
}
