
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoService } from './services/producto';
import { Producto } from './models/producto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private productoService = inject(ProductoService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);

  ngOnInit(): void {
    console.log('🚨 ESTOY EJECUTANDO EL APP.TS NUEVO');

    this.productoService.getProductos().subscribe({
      next: (data) => {
        console.log('RESPUESTA:', data);

        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('ERROR:', err);
        this.cargando.set(false);
      }
    });
  }
}

