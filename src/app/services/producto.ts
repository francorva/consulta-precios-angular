import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model'; // Importamos la interfaz que creaste

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  // Ajusta el puerto o URL si tu API en Spring Boot usa otro diferente a 8080
  private apiUrl = 'http://localhost:8081/productos';

  constructor(private http: HttpClient) {}

  // Obtener la lista de productos
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  // Buscar un producto por código
  getProductoPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${codigo}`);
  }
}
