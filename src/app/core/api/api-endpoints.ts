/**
 * API Endpoints Configuration
 *
 * Centralized API endpoint definitions.
 * All API URLs should be defined here for easy maintenance.
 */

/**
 * API Endpoints
 *
 * Organize endpoints by feature/domain
 */
export const API_ENDPOINTS = {
  // Authentication & Users
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    me: '/auth/me',
  },

  users: {
    list: '/users',
    byId: (id: string | number) => `/users/${id}`,
    create: '/users',
    update: (id: string | number) => `/users/${id}`,
    delete: (id: string | number) => `/users/${id}`,
    profile: '/users/profile',
  },

  // Add more endpoint groups here
  // Example:
  // products: {
  //   list: '/products',
  //   byId: (id: string | number) => `/products/${id}`,
  //   search: '/products/search',
  // },

} as const;

/**
 * API Endpoint type for type safety
 */
export type ApiEndpoint = typeof API_ENDPOINTS;
