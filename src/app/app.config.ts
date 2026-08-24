import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    /*    provideAnimations(),*/
    provideHttpClient(withInterceptors([authInterceptor]), withFetch()),
    importProvidersFrom(MatNativeDateModule),
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
};

/* para usar interceptor
(Nota: No olvides registrar este interceptor en tu 
  archivo de configuración global, típicamente app.config.ts, usando 
  provideHttpClient(withInterceptors([authInterceptor]))
   para que Angular empiece a utilizarlo).
En Angular standalone (versiones 15+), los interceptores creados con HttpInterceptorFn no se activan automáticamente por el simple hecho de existir en tu estructura de archivos. Necesitas "conectarlos" explícitamente en el pipeline de peticiones HTTP de la aplicación.
*/
