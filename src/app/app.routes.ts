import { Routes } from '@angular/router';
import { CatalogoComponent } from './pages/catalogo/catalogo';
import { ProductoFormComponent } from './pages/producto-form/producto-form';
import { CarritoComponent } from './pages/carrito/carrito';

export const routes: Routes = [
  // 1. Ruta raíz para ver el catálogo de productos (tarjetas)
  { path: '', component: CatalogoComponent },
  { path: 'catalogo', component: CatalogoComponent },

  // 2. Ruta para ver el carrito de compras
  { path: 'carrito', component: CarritoComponent },

  // 3. Rutas para el formulario de administración (crear / editar)
  { path: 'admin/productos/nuevo', component: ProductoFormComponent },
  { path: 'admin/productos/editar/:id', component: ProductoFormComponent },

  // Redirección por defecto si la ruta no existe
  { path: '**', redirectTo: '' }
];
