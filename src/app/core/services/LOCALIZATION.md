# Localization (i18n) Documentation

## Overview

The application supports Arabic (AR) and English (EN) with the following features:
- **Language Switch**: Toggle between Arabic and English
- **Persistence**: Language preference saved in localStorage
- **RTL/LTR Support**: Automatic direction switching
- **Global State**: Language integrated with NgRx store
- **ngx-translate**: Professional translation management

## File Structure

```
public/assets/i18n/
├── ar.json          # Arabic translations
└── en.json          # English translations

src/app/core/services/
└── language.service.ts   # Language management service

src/app/store/
├── actions/language.actions.ts
├── state/language.state.ts
├── reducers/language.reducer.ts
└── selectors/language.selectors.ts
```

## Usage

### 1. In Components

```typescript
import { Component, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@core/services';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [TranslateModule],
  template: `
    <h1>{{ 'app.welcome' | translate }}</h1>
    <p>{{ 'home.subtitle' | translate }}</p>

    <!-- With parameters -->
    <p>{{ 'footer.copyright' | translate:{year: currentYear} }}</p>

    <!-- Language toggle -->
    <button (click)="toggleLanguage()">
      {{ currentLang === 'en' ? 'عربي' : 'English' }}
    </button>
  `
})
export class MyComponent {
  languageService = inject(LanguageService);

  currentLang = this.languageService.getCurrentLanguage();

  toggleLanguage() {
    this.languageService.toggleLanguage();
  }
}
```

### 2. In Templates

```html
<!-- Simple translation -->
<h1>{{ 'app.title' | translate }}</h1>

<!-- With parameters -->
<p>{{ 'footer.copyright' | translate:{year: 2024} }}</p>

<!-- Instant translation (synchronous) -->
<button [attr.aria-label]="'header.toggleTheme' | translate">
  Toggle
</button>
```

### 3. In TypeScript

```typescript
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

// Get translation
const title = this.translate.instant('app.title');

// Get translation with parameters
const copyright = this.translate.instant('footer.copyright', { year: 2024 });

// Observable translation
this.translate.get('app.welcome').subscribe(text => {
  console.log(text);
});
```

## LanguageService API

### Methods

```typescript
// Get current language
getCurrentLanguage(): Language // 'en' | 'ar'

// Set language
setLanguage(lang: Language): void

// Toggle between languages
toggleLanguage(): void

// Get language name
getLanguageName(lang: Language): string // 'English' | 'العربية'

// Get current direction
getCurrentDirection(): Direction // 'ltr' | 'rtl'

// Check if RTL
isRTL(): boolean

// Get all available languages
getAvailableLanguages(): Array<{ code, name, dir }>
```

### Observables

```typescript
// Subscribe to language changes
languageService.currentLanguage$.subscribe(lang => {
  console.log('Language changed to:', lang);
});

// Subscribe to direction changes
languageService.currentDirection$.subscribe(dir => {
  console.log('Direction changed to:', dir);
});
```

## NgRx Integration

### Dispatch Actions

```typescript
import { Store } from '@ngrx/store';
import { LanguageActions } from '@store/actions/language.actions';

constructor(private store: Store) {}

// Set language
this.store.dispatch(LanguageActions.setLanguage({
  language: 'ar',
  direction: 'rtl'
}));

// Toggle language
this.store.dispatch(LanguageActions.toggleLanguage());
```

### Select from Store

```typescript
import { Store } from '@ngrx/store';
import { selectCurrentLanguage, selectIsRTL } from '@store/selectors/language.selectors';

constructor(private store: Store) {}

// Select current language
currentLang$ = this.store.select(selectCurrentLanguage);

// Select RTL status
isRTL$ = this.store.select(selectIsRTL);

// With signals
currentLangSignal = this.store.selectSignal(selectCurrentLanguage);
```

## Adding New Translations

### 1. Update Translation Files

**en.json:**
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  }
}
```

**ar.json:**
```json
{
  "myFeature": {
    "title": "ميزتي",
    "description": "وصف الميزة"
  }
}
```

### 2. Use in Components

```html
<h1>{{ 'myFeature.title' | translate }}</h1>
<p>{{ 'myFeature.description' | translate }}</p>
```

## Best Practices

1. **Organize by Feature**: Group translations by feature/module
   ```json
   {
     "header": { ... },
     "sidebar": { ... },
     "home": { ... }
   }
   ```

2. **Use Dot Notation**: Access nested translations
   ```html
   {{ 'home.features.fast.title' | translate }}
   ```

3. **Parameterize Dynamic Content**: Use interpolation for dynamic values
   ```html
   {{ 'users.count' | translate:{count: userCount} }}
   ```

4. **Keep Keys Descriptive**: Use clear, hierarchical keys
   ```
   ✅ 'users.list.noResults'
   ❌ 'msg1'
   ```

5. **Lazy Load Translations**: For large apps, split translations by module

## RTL Support

The application automatically switches direction based on language:

- **English (EN)**: `dir="ltr"`
- **Arabic (AR)**: `dir="rtl"`

### CSS Classes

Use TailwindCSS RTL-aware utilities or custom styles:

```html
<!-- Automatic RTL support -->
<div class="mr-4">  <!-- Becomes ml-4 in RTL -->

<!-- Manual RTL handling -->
<div [class.mr-4]="!isRTL()" [class.ml-4]="isRTL()">
```

## Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of } from 'rxjs';

class FakeLoader implements TranslateLoader {
  getTranslation() {
    return of({
      'app.title': 'Test Title'
    });
  }
}

describe('MyComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader }
        })
      ]
    });
  });
});
```

## Troubleshooting

### Translations Not Loading

1. Check translation files exist: `public/assets/i18n/*.json`
2. Verify TranslateModule is imported in component
3. Check browser console for HTTP errors

### Wrong Language on Load

1. Clear localStorage: `localStorage.removeItem('app-language')`
2. Check default language in `language.service.ts`

### RTL Not Working

1. Verify `dir` attribute on `<html>` element
2. Check TailwindCSS RTL configuration
3. Ensure CSS doesn't override direction

## Environment Configuration

Default language is set in `language.service.ts`:

```typescript
const DEFAULT_LANGUAGE: Language = 'en';
```

Supported languages:

```typescript
const LANGUAGE_CONFIG = {
  en: { dir: 'ltr', name: 'English' },
  ar: { dir: 'rtl', name: 'العربية' },
};
```
