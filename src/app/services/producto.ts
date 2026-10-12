import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8081/productos';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const credentials = btoa('admin:123456');
    return new HttpHeaders({
      'Authorization': 'Basic ' + credentials
    });
  }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getProductoPorCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${codigo}`, { headers: this.getAuthHeaders() });
  }

  obtenerProductoPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // 📸 MODIFICADO: Ahora recibe FormData para enviar la imagen y el producto juntos
  crearProducto(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, formData, { headers: this.getAuthHeaders() });
  }

  actualizarProducto(id: number, data: any): Observable<Producto> {
      return this.http.put<Producto>(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
    }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
