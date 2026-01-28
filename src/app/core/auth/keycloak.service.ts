/**
 * Keycloak Service
 *
 * Central service for Keycloak authentication and authorization.
 * Handles initialization, login, logout, token management, and role checks.
 */

import { Injectable } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KeycloakUser, KeycloakTokenParsed } from './models/keycloak-user.model';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloakInstance?: Keycloak;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private userSubject = new BehaviorSubject<KeycloakUser | null>(null);

  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  public user$: Observable<KeycloakUser | null> = this.userSubject.asObservable();

  /**
   * Initialize Keycloak with configuration from environment
   */
  async init(): Promise<boolean> {
    try {
      this.keycloakInstance = new Keycloak({
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      });

      const authenticated = await this.keycloakInstance.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      });

      this.isAuthenticatedSubject.next(authenticated);

      if (authenticated) {
        this.loadUserProfile();
        this.setupTokenRefresh();
      }

      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak', error);
      return false;
    }
  }

  /**
   * Login redirect to Keycloak
   */
  login(redirectUri?: string): Promise<void> {
    if (!this.keycloakInstance) {
      throw new Error('Keycloak not initialized');
    }
    return this.keycloakInstance.login({
      redirectUri: redirectUri || window.location.origin,
    });
  }

  /**
   * Logout and redirect
   */
  logout(redirectUri?: string): Promise<void> {
    if (!this.keycloakInstance) {
      throw new Error('Keycloak not initialized');
    }
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
    return this.keycloakInstance.logout({
      redirectUri: redirectUri || window.location.origin,
    });
  }

  /**
   * Get current authentication status
   */
  isLoggedIn(): boolean {
    return this.keycloakInstance?.authenticated ?? false;
  }

  /**
   * Get access token
   */
  getToken(): string | undefined {
    return this.keycloakInstance?.token;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | undefined {
    return this.keycloakInstance?.refreshToken;
  }

  /**
   * Get parsed token
   */
  getTokenParsed(): KeycloakTokenParsed | undefined {
    return this.keycloakInstance?.tokenParsed as KeycloakTokenParsed | undefined;
  }

  /**
   * Update token (refresh if needed)
   */
  async updateToken(minValidity: number = 30): Promise<boolean> {
    if (!this.keycloakInstance) {
      return false;
    }

    try {
      const refreshed = await this.keycloakInstance.updateToken(minValidity);
      if (refreshed) {
        console.debug('Token refreshed');
      }
      return true;
    } catch (error) {
      console.error('Failed to refresh token', error);
      this.logout();
      return false;
    }
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    if (!this.keycloakInstance) {
      return false;
    }
    return this.keycloakInstance.hasRealmRole(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.hasRole(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every((role) => this.hasRole(role));
  }

  /**
   * Get all user roles
   */
  getUserRoles(): string[] {
    if (!this.keycloakInstance?.tokenParsed) {
      return [];
    }
    return (this.keycloakInstance.tokenParsed as KeycloakTokenParsed).realm_access?.roles ?? [];
  }

  /**
   * Get current user info
   */
  getUser(): KeycloakUser | null {
    return this.userSubject.value;
  }

  /**
   * Load user profile from Keycloak
   */
  private async loadUserProfile(): Promise<void> {
    if (!this.keycloakInstance) {
      return;
    }

    try {
      const profile = await this.keycloakInstance.loadUserProfile();
      const tokenParsed = this.getTokenParsed();

      const user: KeycloakUser = {
        sub: profile.id || '',
        email: profile.email,
        email_verified: profile.emailVerified,
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        given_name: profile.firstName,
        family_name: profile.lastName,
        preferred_username: profile.username,
        realm_access: tokenParsed?.realm_access,
        resource_access: tokenParsed?.resource_access,
      };

      this.userSubject.next(user);
    } catch (error) {
      console.error('Failed to load user profile', error);
    }
  }

  /**
   * Set up automatic token refresh
   */
  private setupTokenRefresh(): void {
    if (!this.keycloakInstance) {
      return;
    }

    // Refresh token every 60 seconds if it expires in less than 70 seconds
    setInterval(() => {
      this.updateToken(70).catch((error) => {
        console.error('Token refresh failed', error);
      });
    }, 60000);

    // Handle token expiration
    this.keycloakInstance.onTokenExpired = () => {
      console.warn('Token expired, refreshing...');
      this.updateToken(30).catch((error) => {
        console.error('Failed to refresh expired token', error);
        this.logout();
      });
    };

    // Handle authentication errors
    this.keycloakInstance.onAuthError = () => {
      console.error('Authentication error occurred');
      this.logout();
    };

    // Handle authentication logout
    this.keycloakInstance.onAuthLogout = () => {
      console.info('User logged out');
      this.isAuthenticatedSubject.next(false);
      this.userSubject.next(null);
    };
  }

  /**
   * Get Keycloak instance (for advanced usage)
   */
  getKeycloakInstance(): Keycloak | undefined {
    return this.keycloakInstance;
  }

  /**
   * Clear authentication state
   */
  clearAuth(): void {
    this.isAuthenticatedSubject.next(false);
    this.userSubject.next(null);
  }
}
