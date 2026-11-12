import { provideHttpClient, withFetch } from '@angular/common/http';
import { type ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

/**
 * Konfiguracja całej aplikacji - "providery" to usługi dostępne wszędzie przez inject().
 * Porównanie z Javą: coś jak klasa @Configuration w Springu.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // withComponentInputBinding: parametry trasy (np. :id) trafiają do komponentu jako input() - TODO(6)
    provideRouter(routes, withComponentInputBinding()),
    // TODO(9): provideHttpClient(withFetch(), withInterceptors([errorInterceptor]))
    provideHttpClient(withFetch()),
    // TODO(5): providePrimeNG({ theme: { preset: Aura, ... } }) oraz MessageService
  ],
};
