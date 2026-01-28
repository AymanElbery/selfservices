/**
 * API Response Models
 *
 * Common response type definitions for API calls.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Paginated API response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API error response
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
  success: false;
}

/**
 * List response
 */
export interface ListResponse<T> {
  items: T[];
  total: number;
}
