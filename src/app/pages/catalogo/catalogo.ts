import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto';
import { CartService } from '../../services/cart'; // <--- Importamos el servicio del carrito
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class CatalogoComponent implements OnInit {
  private productoService = inject(ProductoService);
  private cartService = inject(CartService); // <--- Inyectamos el servicio del carrito

  // Estados con Signals
  productos = signal<Producto[]>([]);
  cargando = signal<boolean>(true);
  busqueda = signal<string>('');

  // Filtros de precio
  precioMinAbsoluto = 0;
  precioMaxAbsoluto = 10000000;
  pasoPrecio = 10000;

  precioMinSeleccionado = signal<number>(0);
  precioMaxSeleccionado = signal<number>(10000000);

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.productoService.getProductos().subscribe({
      next: (data) => {
        this.productos.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.cargando.set(false);
      }
    });
  }

  buscarProducto(): void {
    // La reactividad del signal maneja el filtrado
  }

  // Productos filtrados por búsqueda y precio (convirtiendo código a string de forma segura)
  productosFiltrados = computed(() => {
    const termino = this.busqueda().toLowerCase();
    const min = this.precioMinSeleccionado();
    const max = this.precioMaxSeleccionado();

    return this.productos().filter(p => {
      const nombreStr = p.nombre ? p.nombre.toLowerCase() : '';
      const codigoStr = p.codigo != null ? String(p.codigo).toLowerCase() : '';

      const coincideNombre = nombreStr.includes(termino) || codigoStr.includes(termino);
      const coincidePrecio = p.precioUnitario >= min && p.precioUnitario <= max;

      return coincideNombre && coincidePrecio;
    });
  });

  // Método para agregar al carrito usando las propiedades reales del modelo
  agregarAlCarrito(producto: any): void {
      this.cartService.agregarProducto({
        id: producto.id || producto.idProducto || producto.codigo, // Busca la propiedad que exista
        nombre: producto.nombre,
        precio: producto.precioUnitario,
        cantidad: 1
      });
      alert(`¡"${producto.nombre}" agregado al carrito!`);
    }

  // Métodos del Slider de Precio
  porcentajeMin = computed(() => {
    return (this.precioMinSeleccionado() / this.precioMaxAbsoluto) * 100;
  });

  porcentajeAncho = computed(() => {
    return ((this.precioMaxSeleccionado() - this.precioMinSeleccionado()) / this.precioMaxAbsoluto) * 100;
  });

  onPrecioMinChange(val: number): void {
    if (val <= this.precioMaxSeleccionado()) {
      this.precioMinSeleccionado.set(val);
    }
  }

  onPrecioMaxChange(val: number): void {
    if (val >= this.precioMinSeleccionado()) {
      this.precioMaxSeleccionado.set(val);
    }
  }

  aplicarFiltroPrecio(): void {
    // Lógica adicional si se requiere
  }

  limpiarFiltroPrecio(): void {
    this.precioMinSeleccionado.set(this.precioMinAbsoluto);
    this.precioMaxSeleccionado.set(this.precioMaxAbsoluto);
  }
}
