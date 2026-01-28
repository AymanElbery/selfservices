# Environment Configuration Guide

Quick reference for working with different environments in this Angular application.

## Available Environments

| Environment | Purpose | Production Flag | File |
|------------|---------|----------------|------|
| **Development** | Local development | `false` | `environment.development.ts` |
| **Minus One** | Pre-production/Staging | `false` | `environment.minusone.ts` |
| **Production** | Live production | `true` | `environment.production.ts` |

## Quick Commands

### Development (Default)
```bash
npm start                    # Serve with dev config
npm run build:dev           # Build with dev config
```

### Minus One (Staging)
```bash
npm run start:minusone      # Serve with staging config
npm run build:minusone      # Build with staging config
```

### Production
```bash
npm run start:prod          # Serve with production config
npm run build:prod          # Build with production config
```

## Environment Configuration

Each environment defines:

### API Configuration
- **API URL**: Base URL for backend API calls
- Example: `https://api.example.com/api`

### Keycloak Configuration
- **URL**: Keycloak server URL
- **Realm**: Keycloak realm name
- **Client ID**: Application client identifier

### Example Configuration

```typescript
// environment.production.ts
export const environment: Environment = {
  production: true,
  apiUrl: 'https://api.example.com/api',
  keycloak: {
    url: 'https://keycloak.example.com',
    realm: 'selfservices',
    clientId: 'selfservices-app',
  },
};
```

## Using Environment Variables in Code

### In Services
```typescript
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getData() {
    return this.http.get(`${this.apiUrl}/data`);
  }
}
```

### In Components
```typescript
import { environment } from '../environments/environment';

export class AppComponent {
  isProduction = environment.production;
}
```

### Keycloak Initialization
```typescript
import { environment } from '../environments/environment';

const keycloakConfig = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId,
};
```

## Current Environment URLs

### Development
- **API**: `http://localhost:3000/api`
- **Keycloak**: `http://localhost:8080`
- **Realm**: `selfservices-dev`
- **Client ID**: `selfservices-app-dev`

### Minus One (Staging)
- **API**: `https://api-minusone.example.com/api` *(Update with actual URL)*
- **Keycloak**: `https://keycloak-minusone.example.com` *(Update with actual URL)*
- **Realm**: `selfservices-minusone`
- **Client ID**: `selfservices-app-minusone`

### Production
- **API**: `https://api.example.com/api` *(Update with actual URL)*
- **Keycloak**: `https://keycloak.example.com` *(Update with actual URL)*
- **Realm**: `selfservices`
- **Client ID**: `selfservices-app`

> **Note**: Update the placeholder URLs in the environment files with your actual server URLs.

## File Replacements

During build, Angular automatically replaces `environment.ts` with the appropriate environment file:

```
development → environment.development.ts
minusone    → environment.minusone.ts
production  → environment.production.ts
```

This is configured in [angular.json](angular.json) under `fileReplacements`.

## Adding New Environment Variables

1. **Update the interface** ([src/environments/environment.interface.ts](src/environments/environment.interface.ts)):
   ```typescript
   export interface Environment {
     production: boolean;
     apiUrl: string;
     keycloak: KeycloakConfig;
     myNewVariable: string; // Add here
   }
   ```

2. **Add to all environment files**:
   - `environment.ts`
   - `environment.development.ts`
   - `environment.minusone.ts`
   - `environment.production.ts`

3. **TypeScript will enforce** that all files have the new property

## Checking Current Environment

### At Build Time
```typescript
import { environment } from '../environments/environment';

if (environment.production) {
  // Production-specific logic
  console.log('Running in production mode');
}
```

### In DevTools (Runtime)
```javascript
// Open browser console
console.log(window['environment']); // If exposed
```

## Best Practices

1. **Never commit secrets** in environment files
2. **Use type-safe interface** for all environment configurations
3. **Keep structure consistent** across all environment files
4. **Document custom variables** in this file and in [src/environments/README.md](src/environments/README.md)
5. **Validate configurations** during app initialization

## Troubleshooting

### Wrong API being called
- Verify you're running the correct build configuration
- Check the environment file for the correct `apiUrl`
- Clear browser cache and rebuild

### Keycloak authentication fails
- Verify Keycloak URL, realm, and clientId in environment file
- Check that the Keycloak client exists in the specified realm
- Ensure redirect URIs are configured in Keycloak

### Build fails with environment error
- Ensure all environment files implement the `Environment` interface
- Check that all required properties exist in each file
- Verify TypeScript compilation with `npm run build`

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build for production
  run: npm run build:prod
  env:
    NODE_ENV: production
```

### Jenkins Example
```groovy
stage('Build') {
  steps {
    sh 'npm run build:prod'
  }
}
```

## Related Documentation

- [Detailed Environment Documentation](src/environments/README.md)
- [Application Architecture](src/app/ARCHITECTURE.md)
- [Angular Configuration](angular.json)

---

**Need to update environment URLs?** Edit the files in [src/environments/](src/environments/)

**Need to add new variables?** See [Adding New Environment Variables](#adding-new-environment-variables)
