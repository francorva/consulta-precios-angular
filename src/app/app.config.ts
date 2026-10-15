import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideLogto } from '@logto/angular'; // 1. Importa Logto
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    // 2. Agrega el proveedor de Logto con tus credenciales
    provideLogto({
      endpoint: 'https://aoo6ml.logto.app/',
      appId: '3xx0sqmm26roie17wy2l4',
    }),
  ]
};
