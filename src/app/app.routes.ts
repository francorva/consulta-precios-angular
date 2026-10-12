import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { ProductoFormComponent } from './pages/producto-form/producto-form';

export const routes: Routes = [
  // 1. Ruta raíz para ver el catálogo de productos (tarjetas)
  { path: '', component: CatalogoComponent },
  { path: 'catalogo', component: CatalogoComponent },

  // 2. Rutas para el formulario de administración (crear / editar)
  { path: 'admin/productos/nuevo', component: ProductoFormComponent },
  { path: 'admin/productos/editar/:id', component: ProductoFormComponent },

  // Redirección por defecto si la ruta no existe
  { path: '**', redirectTo: '' }
];
