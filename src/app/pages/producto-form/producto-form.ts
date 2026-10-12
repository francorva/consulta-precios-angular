import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductoService } from '../../services/producto';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoFormComponent {
  private fb = inject(FormBuilder);
  private productoService = inject(ProductoService);
  private router = inject(Router);

  productoIdReal: number | null = null;
  codigoOriginal: any = null;
  mensajeBusqueda = signal('');

  // Señales para el feedback visual
  mensajeExito = signal('');
  guardando = signal(false);

  // Variable para almacenar el archivo seleccionado
  archivoSeleccionado: File | null = null;

  productoForm: FormGroup = this.fb.group({
    codigo: ['', Validators.required],
    nombre: ['', Validators.required],
    precioUnitario: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoriaId: [null],
    foto: ['']
  });

  // Método para capturar el archivo cuando el usuario lo selecciona
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      console.log('📸 Archivo seleccionado con éxito:', file.name);
    } else {
      console.log('⚠️ No se seleccionó ningún archivo');
    }
  }

  buscarProducto(): void {
    const codigoBuscado = this.productoForm.get('codigo')?.value;
    if (!codigoBuscado) return;

    this.productoService.getProductos().subscribe({
      next: (productos: any[]) => {
        const encontrado = productos.find(p => String(p.codigo) === String(codigoBuscado));

        if (encontrado) {
          this.codigoOriginal = encontrado.codigo;
          this.productoIdReal = encontrado.id ?? encontrado.productoId ?? encontrado.producto_id ?? null;
          this.productoForm.patchValue(encontrado);
          this.mensajeBusqueda.set('¡Producto encontrado y cargado!');
          this.mensajeExito.set(''); // Limpiar mensajes previos
        } else {
          this.mensajeBusqueda.set('No se encontró un producto con ese código. Puedes crearlo.');
          this.codigoOriginal = null;
          this.productoIdReal = null;
        }
      },
      error: (err) => {
        console.error('Error al conectar con el servidor:', err);
        this.mensajeBusqueda.set('Error de conexión con el servidor.');
      }
    });
  }

  guardar(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const productoData = this.productoForm.value;
    this.guardando.set(true);
    this.mensajeExito.set('');

    const formData = new FormData();
    const productoBlob = new Blob([JSON.stringify(productoData)], {
      type: 'application/json'
    });
    formData.append('producto', productoBlob);

    if (this.archivoSeleccionado) {
      formData.append('imagen', this.archivoSeleccionado);
    }

    if (this.productoIdReal !== null) {
      // Actualizar (PUT) enviando el formData
      this.productoService.actualizarProducto(this.productoIdReal, formData).subscribe({
        next: () => {
          this.guardando.set(false);
          this.mensajeExito.set('¡Cambios guardados correctamente!');
          this.archivoSeleccionado = null; // Limpiar selección
          setTimeout(() => this.mensajeExito.set(''), 3000);
        },
        error: (err) => {
          this.guardando.set(false);
          console.error('Error al actualizar:', err);
          this.mensajeExito.set('Error al guardar los cambios.');
        }
      });
    } else {
      // Crear (POST)
      this.productoService.crearProducto(formData).subscribe({
        next: () => {
          this.guardando.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.guardando.set(false);
          console.error('Error al crear:', err);
        }
      });
    }
  }

  eliminarProducto(): void {
    if (this.productoIdReal !== null && confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(this.productoIdReal).subscribe({
        next: () => this.router.navigate(['/']),
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}
