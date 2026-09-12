
import { Component, OnInit, inject } from '@angular/core';
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

  productos: Producto[] = [];
  cargando = true;

  ngOnInit(): void {
    console.log('🚨 ESTOY EJECUTANDO EL APP.TS NUEVO');

    this.productoService.getProductos().subscribe({
      next: (data) => {
        console.log('RESPUESTA:', data);

        this.productos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('ERROR:', err);
        this.cargando = false;
      }
    });
  }
}

