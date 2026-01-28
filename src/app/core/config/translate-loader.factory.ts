/**
 * Translation Loader Factory
 *
 * Creates the HttpLoader for ngx-translate to load translation files.
 */

import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

/**
 * Factory function for TranslateHttpLoader
 * Loads translation files from /assets/i18n/
 */
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
