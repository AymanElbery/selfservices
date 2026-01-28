/**
 * API Module
 *
 * Central API service and configuration.
 * All features should use BaseApiService instead of directly injecting HttpClient.
 */

// Services
export * from './base-api.service';

// Configuration
export * from './api-endpoints';

// Models
export * from './models/api-response.model';
