import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, ProductoCarrito } from '../../services/cart';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent implements OnInit {
  private cartService = inject(CartService);

  items: ProductoCarrito[] = [];
  total: number = 0;

  ngOnInit(): void {
    this.cartService.cart$.subscribe(productos => {
      this.items = productos;
      this.total = this.cartService.calcularTotal();
    });
  }

  incrementar(item: ProductoCarrito): void {
    this.cartService.actualizarCantidad(item.id, item.cantidad + 1);
  }

  decrementar(item: ProductoCarrito): void {
    if (item.cantidad > 1) {
      this.cartService.actualizarCantidad(item.id, item.cantidad - 1);
    } else {
      this.eliminar(item.id);
    }
  }

  eliminar(id: number): void {
    this.cartService.eliminarProducto(id);
  }

  vaciar(): void {
    this.cartService.limpiarCarrito();
  }

  enviarWhatsApp(): void {
    if (this.items.length === 0) {
      alert('Tu carrito está vacío.');
      return;
    }

    const telefonoNegocio = "595972858960"; // Cambia por tu número real de WhatsApp
    let mensaje = "¡Hola! Quiero realizar el siguiente pedido:\n\n";

    this.items.forEach(item => {
      mensaje += `- ${item.cantidad}x ${item.nombre} (Gs ${(item.precio * item.cantidad).toLocaleString()})\n`;
    });

    mensaje += `\n*Total a pagar: Gs ${this.total.toLocaleString()}*`;
    mensaje += `\n\n¿Me confirman los datos para el pago y envío?`;

    const urlWhatsApp = `https://wa.me/${telefonoNegocio}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
  }
}
