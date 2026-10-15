import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
}
)
export class CartService {
  private items: ProductoCarrito[] = [];
  private cartSubject = new BehaviorSubject<ProductoCarrito[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.items = JSON.parse(savedCart);
      this.cartSubject.next(this.items);
    }
  }

  agregarProducto(producto: any) {
    const index = this.items.findIndex(item => item.id === producto.id);
    if (index > -1) {
      this.items[index].cantidad += 1;
    } else {
      this.items.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }
    this.guardarYActualizar();
  }

  eliminarProducto(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    this.guardarYActualizar();
  }

  obtenerItems(): ProductoCarrito[] {
    return this.items;
  }

  calcularTotal(): number {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  limpiarCarrito() {
    this.items = [];
    this.guardarYActualizar();
  }

  private guardarYActualizar() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.cartSubject.next(this.items);
  }
}
