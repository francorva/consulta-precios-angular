export interface Producto {
  productoId?: number;
  categoriaId?: number;
  nombre: string;
  precioUnitario: number;
  stock?: number;
}
