# Environment Configuration

This folder contains environment-specific configurations for the application. Each environment has its own configuration file that defines API endpoints, Keycloak settings, and other environment-specific variables.

## Available Environments

### Development (`environment.development.ts`)
- **Purpose**: Local development and testing
- **Production flag**: `false`
- **API URL**: `http://localhost:3000/api`
- **Keycloak**: Local Keycloak instance
- **Usage**: Default environment for `ng serve`

### Minus One (`environment.minusone.ts`)
- **Purpose**: Pre-production/staging environment
- **Production flag**: `false`
- **API URL**: Staging API server
- **Keycloak**: Staging Keycloak instance
- **Usage**: Final testing before production deployment

### Production (`environment.production.ts`)
- **Purpose**: Live production environment
- **Production flag**: `true`
- **API URL**: Production API server
- **Keycloak**: Production Keycloak instance
- **Usage**: Production builds and deployments

## Environment Structure

Each environment file implements the `Environment` interface defined in [environment.interface.ts](environment.interface.ts):

```typescript
export interface Environment {
  production: boolean;
  apiUrl: string;
  keycloak: KeycloakConfig;
}

export interface KeycloakConfig {
  url: string;
  realm: string;
  clientId: string;
}
```

## Using Environment Variables

### In Components/Services

Import the environment configuration:

```typescript
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get(`${this.apiUrl}/users`);
  }
}
```

### Keycloak Configuration

Access Keycloak settings:

```typescript
import { environment } from '../environments/environment';

const keycloakConfig = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId,
};
```

## Building for Different Environments

### Development
```bash
npm run build:dev
# or
ng build --configuration development
```

### Minus One (Staging)
```bash
npm run build:minusone
# or
ng build --configuration minusone
```

### Production
```bash
npm run build:prod
# or
ng build --configuration production
```

## Serving Different Environments

### Development
```bash
npm start
# or
npm run start:dev
# or
ng serve --configuration development
```

### Minus One (Staging)
```bash
npm run start:minusone
# or
ng serve --configuration minusone
```

### Production
```bash
npm run start:prod
# or
ng serve --configuration production
```

## File Replacements

The build system automatically replaces [environment.ts](environment.ts) with the appropriate environment file based on the build configuration:

| Configuration | Replaced With |
|--------------|---------------|
| `development` | `environment.development.ts` |
| `minusone` | `environment.minusone.ts` |
| `production` | `environment.production.ts` |

File replacements are configured in [angular.json](../../angular.json) under `build.configurations.<env>.fileReplacements`.

## Adding New Environment Variables

1. **Update the interface** in [environment.interface.ts](environment.interface.ts):
   ```typescript
   export interface Environment {
     production: boolean;
     apiUrl: string;
     keycloak: KeycloakConfig;
     newVariable: string; // Add your new variable
   }
   ```

2. **Add to all environment files**:
   - [environment.ts](environment.ts)
   - [environment.development.ts](environment.development.ts)
   - [environment.minusone.ts](environment.minusone.ts)
   - [environment.production.ts](environment.production.ts)

3. **Use in your code**:
   ```typescript
   import { environment } from '../environments/environment';
   const value = environment.newVariable;
   ```

## Updating Environment URLs

To update API or Keycloak URLs for any environment:

1. Open the appropriate environment file
2. Update the relevant configuration:
   ```typescript
   export const environment: Environment = {
     production: true,
     apiUrl: 'https://your-new-api.example.com/api',
     keycloak: {
       url: 'https://your-new-keycloak.example.com',
       realm: 'your-realm',
       clientId: 'your-client-id',
     },
   };
   ```
3. Save the file
4. Rebuild the application for the updated environment

## Security Considerations

- **Never commit secrets**: Environment files should not contain passwords, API keys, or other secrets
- **Use environment variables**: For CI/CD pipelines, use environment variables to inject sensitive values during build
- **Git ignore**: Consider adding `environment.*.ts` to `.gitignore` for production configurations with sensitive data
- **Separate configurations**: Keep production configurations separate and secure

## Best Practices

1. **Type Safety**: Always use the `Environment` interface to ensure type safety across all environments
2. **Consistent Structure**: Maintain the same structure across all environment files
3. **Documentation**: Document any custom environment variables in this README
4. **Validation**: Validate environment configurations during app initialization
5. **Default Values**: Provide sensible defaults in the base `environment.ts` file

## Troubleshooting

### Wrong environment is being used
- Verify the `--configuration` flag matches the desired environment
- Check file replacements in [angular.json](../../angular.json)
- Clear build cache: `rm -rf dist` and rebuild

### Environment file not found
- Ensure all environment files exist
- Verify paths in `angular.json` file replacements are correct
- Check that file names match exactly (case-sensitive)

### TypeScript errors
- Ensure all environment files implement the `Environment` interface
- Check that all required properties are present in each environment file
- Verify the interface is exported from `environment.interface.ts`

## CI/CD Integration

### Example: Injecting environment variables during build

```bash
# Set environment variables
export API_URL="https://api.example.com/api"
export KEYCLOAK_URL="https://keycloak.example.com"

# Run build with environment-specific configuration
npm run build:prod
```

For more advanced scenarios, consider using build-time environment variable replacement tools or Angular's `APP_INITIALIZER` pattern.
