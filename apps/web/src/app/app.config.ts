import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  isDevMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from '@oivan/auth/feature';
import { authReducer, AuthEffects } from '@oivan/auth/data-access';
import { houseReducer, HOUSE_FEATURE_KEY, HouseEffects } from '@oivan/houses/data-access';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(appRoutes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideStore({ auth: authReducer, [HOUSE_FEATURE_KEY]: houseReducer }),
    provideEffects(HouseEffects, AuthEffects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' }
    }
  ],
};
