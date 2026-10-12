
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router'; // Proveedor para habilitar el enrutador
import { routes } from './app.routes';           // Carga del arreglo de rutas recién definido

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimización de detecciones
    provideHttpClient(),                                   // Cliente HTTP para consultar Spring Boot
    provideRouter(routes)                                  // Registro de las rutas en el sistema
  ]
};
