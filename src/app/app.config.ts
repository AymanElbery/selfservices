import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { routes } from './app.routes';
import { reducers } from './store/reducers';
import { globalEffects } from './store/effects';
import { KeycloakService, initializeKeycloak, keycloakInterceptor } from './core/auth';
import { createTranslateLoader } from './core/config/translate-loader.factory';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // HTTP Client with Keycloak interceptor
    provideHttpClient(
      withInterceptors([keycloakInterceptor])
    ),
    // ngx-translate
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient],
        },
      })
    ),
    // Keycloak Initialization (runs before app bootstrap)
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    },
    // NgRx Store
    provideStore(reducers),
    // NgRx Effects
    provideEffects(globalEffects),
    // NgRx DevTools (only in development)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ]
};
