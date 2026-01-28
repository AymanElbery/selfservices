/**
 * Home Component
 *
 * Landing page / dashboard
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to SelfServices
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Your Angular 20 application with feature-based architecture
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <!-- Card 1 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-primary-100 p-3 dark:bg-primary-900/20">
              <svg class="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Fast & Modern</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Angular 20 with Signals</p>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-green-100 p-3 dark:bg-green-900/20">
              <svg class="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">Secure</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">Keycloak 26 Integration</p>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center gap-4">
            <div class="rounded-lg bg-purple-100 p-3 dark:bg-purple-900/20">
              <svg class="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">State Management</h3>
              <p class="text-sm text-gray-600 dark:text-gray-400">NgRx with Signals</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Features Section -->
      <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Features
        </h2>
        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">Feature-based Architecture</span>
              <p class="text-sm text-gray-600 dark:text-gray-400">Lazy-loaded modules for optimal performance</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">Centralized API Service</span>
              <p class="text-sm text-gray-600 dark:text-gray-400">Type-safe HTTP operations with BaseApiService</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">TailwindCSS Layout</span>
              <p class="text-sm text-gray-600 dark:text-gray-400">Responsive design with RTL support</p>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <div>
              <span class="font-medium text-gray-900 dark:text-white">Multi-Environment Support</span>
              <p class="text-sm text-gray-600 dark:text-gray-400">Dev, staging (minusone), and production configs</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Quick Links -->
      <div class="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 class="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Quick Links
        </h2>
        <div class="flex flex-wrap gap-3">
          <a
            routerLink="/users"
            class="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Users Example
          </a>
          <a
            href="https://angular.dev"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Documentation
          </a>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {}
