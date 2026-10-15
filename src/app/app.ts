import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { LogtoService } from '@logto/angular';
import { ProductoService } from './services/producto';
import { Producto } from './models/producto.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {

  private productoService = inject(ProductoService);

  // Inyectamos LogtoService para la autenticación
  public logtoService = inject(LogtoService);

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  productosFiltrados = signal<Producto[]>([]);

  // Configuración del filtro de precio
  precioMinAbsoluto: number = 0;
  precioMaxAbsoluto: number = 60000000;
  pasoPrecio: number = 1000;

  precioMinSeleccionado = signal<number>(0);
  precioMaxSeleccionado = signal<number>(60000000);
  precioMinAplicado = signal<number>(0);
  precioMaxAplicado = signal<number>(60000000);

  ngOnInit(): void {
    // Carga de productos de tu e-commerce
    this.productoService.getProductos().subscribe({
      next: (data) => {
        const productosProcesados = data.map(p => ({
          ...p,
          imagen: this.obtenerRutaImagen(p)
        }));

        this.productos.set(productosProcesados);

        if (productosProcesados.length > 0) {
          const precios = productosProcesados.map(p => p.precioUnitario);
          this.precioMinAbsoluto = Math.min(...precios);
          this.precioMaxAbsoluto = Math.max(...precios);

          this.precioMinSeleccionado.set(this.precioMinAbsoluto);
          this.precioMaxSeleccionado.set(this.precioMaxAbsoluto);
          this.precioMinAplicado.set(this.precioMinAbsoluto);
          this.precioMaxAplicado.set(this.precioMaxAbsoluto);
        }

        this.filtrarProductos();
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('ERROR:', err);
        this.cargando.set(false);
      }
    });
  }

  // Métodos de autenticación para Logto apuntando al callback correcto
  async signIn() {
    await this.logtoService.signIn('http://localhost:4200/callback');
  }

  async signOut() {
    await this.logtoService.signOut('http://localhost:4200/');
  }

  obtenerRutaImagen(producto: any): string {
    if (!producto.imagen) {
      return `foto_producto/${producto.codigo}.jpg`;
    }
    if (producto.imagen.startsWith('http') || producto.imagen.startsWith('foto_producto/')) {
      return producto.imagen;
    }
    return `foto_producto/${producto.imagen}`;
  }

  porcentajeMin(): number {
    const total = this.precioMaxAbsoluto - this.precioMinAbsoluto;
    if (total === 0) return 0;
    return ((this.precioMinSeleccionado() - this.precioMinAbsoluto) / total) * 100;
  }

  porcentajeAncho(): number {
    const total = this.precioMaxAbsoluto - this.precioMinAbsoluto;
    if (total === 0) return 100;
    const dif = this.precioMaxSeleccionado() - this.precioMinSeleccionado();
    return (dif / total) * 100;
  }

  onPrecioMinChange(nuevoValor: number): void {
    if (nuevoValor >= this.precioMaxSeleccionado()) {
      this.precioMinSeleccionado.set(this.precioMaxSeleccionado() - this.pasoPrecio);
    } else {
      this.precioMinSeleccionado.set(nuevoValor);
    }
  }

  onPrecioMaxChange(nuevoValor: number): void {
    if (nuevoValor <= this.precioMinSeleccionado()) {
      this.precioMaxSeleccionado.set(this.precioMinSeleccionado() + this.pasoPrecio);
    } else {
      this.precioMaxSeleccionado.set(nuevoValor);
    }
  }

  aplicarFiltroPrecio(): void {
    this.precioMinAplicado.set(this.precioMinSeleccionado());
    this.precioMaxAplicado.set(this.precioMaxSeleccionado());
    this.filtrarProductos();
  }

  limpiarFiltroPrecio(): void {
    this.precioMinSeleccionado.set(this.precioMinAbsoluto);
    this.precioMaxSeleccionado.set(this.precioMaxAbsoluto);
    this.aplicarFiltroPrecio();
  }

  buscarProducto(): void {
    this.filtrarProductos();
  }

  filtrarProductos(): void {
    const texto = this.busqueda().trim().toLowerCase();

    const resultado = this.productos().filter(producto => {
      const coincideTexto = texto === '' ||
        producto.codigo?.toString().includes(texto) ||
        producto.nombre.toLowerCase().includes(texto);

      const coincidePrecio =
        producto.precioUnitario >= this.precioMinAplicado() &&
        producto.precioUnitario <= this.precioMaxAplicado();

      return coincideTexto && coincidePrecio;
    });

    this.productosFiltrados.set(resultado);
  }
}
