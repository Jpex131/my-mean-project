import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosService, Producto } from '../services/productos.service';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="create-product-modal" [class.show]="showModal">
      <div class="modal-backdrop" (click)="closeModal()"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2>Crear Nuevo Producto</h2>
          <button class="btn-close" (click)="closeModal()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="product-form">
          <div class="form-group">
            <label for="nombre">Nombre del Producto:</label>
            <input 
              type="text" 
              id="nombre" 
              [(ngModel)]="producto.nombre" 
              name="nombre" 
              required 
              class="form-input">
          </div>
          
          <div class="form-group">
            <label for="precio">Precio:</label>
            <input 
              type="number" 
              id="precio" 
              [(ngModel)]="producto.precio" 
              name="precio" 
              required 
              step="0.01" 
              min="0"
              class="form-input">
          </div>
          
          <div class="form-group">
            <label for="imagen">Imagen del Producto:</label>
            <div class="file-upload-container">
              <input 
                type="file" 
                id="imagen" 
                (change)="onFileSelected($event)"
                accept="image/*"
                class="file-input">
              <label for="imagen" class="file-label">
                <span *ngIf="!selectedFile">📁 Seleccionar Imagen</span>
                <span *ngIf="selectedFile">✅ {{ selectedFile.name }}</span>
              </label>
            </div>
            
            <!-- Preview de la imagen -->
            <div *ngIf="imagePreview" class="image-preview">
              <img [src]="imagePreview" alt="Vista previa" class="preview-img">
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="closeModal()">
              Cancelar
            </button>
            <button 
              type="submit" 
              class="btn-submit" 
              [disabled]="loading || !isFormValid()">
              <span *ngIf="loading">Creando...</span>
              <span *ngIf="!loading">Crear Producto</span>
            </button>
          </div>
        </form>
        
        <!-- Mensaje de error -->
        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .create-product-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1000;
      display: none;
      align-items: center;
      justify-content: center;
    }

    .create-product-modal.show {
      display: flex;
    }

    .modal-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      padding: 30px;
      width: 90%;
      max-width: 500px;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
    }

    .modal-header h2 {
      margin: 0;
      color: #333;
      font-size: 1.5rem;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 2rem;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .btn-close:hover {
      background: #f0f0f0;
      color: #666;
    }

    .product-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    .form-input {
      padding: 12px;
      border: 2px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .file-upload-container {
      position: relative;
    }

    .file-input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .file-label {
      display: block;
      padding: 12px;
      border: 2px dashed #ddd;
      border-radius: 8px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;
      background: #fafafa;
    }

    .file-label:hover {
      border-color: #667eea;
      background: #f0f4ff;
    }

    .image-preview {
      margin-top: 15px;
      text-align: center;
    }

    .preview-img {
      max-width: 200px;
      max-height: 150px;
      object-fit: cover;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 25px;
      padding-top: 20px;
      border-top: 2px solid #f0f0f0;
    }

    .btn-cancel {
      padding: 12px 24px;
      border: 2px solid #ddd;
      background: white;
      color: #666;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-cancel:hover {
      border-color: #999;
      color: #333;
    }

    .btn-submit {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .error-message {
      background: #ffe6e6;
      color: #d32f2f;
      padding: 12px;
      border-radius: 8px;
      margin-top: 15px;
      border: 1px solid #ffcdd2;
    }
  `]
})
export class CreateProductComponent {
  @Output() productCreated = new EventEmitter<Producto>();
  @Output() modalClosed = new EventEmitter<void>();

  showModal = false;
  loading = false;
  error: string | null = null;
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  producto: { nombre: string; precio: number } = {
    nombre: '',
    precio: 0
  };

  constructor(private productosService: ProductosService) {}

  openModal() {
    this.showModal = true;
    this.resetForm();
  }

  closeModal() {
    this.showModal = false;
    this.modalClosed.emit();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isFormValid(): boolean {
    return this.producto.nombre.trim() !== '' && this.producto.precio > 0;
  }

  onSubmit() {
    if (!this.isFormValid()) return;

    this.loading = true;
    this.error = null;

    // Crear FormData para enviar archivo
    const formData = new FormData();
    formData.append('nombre', this.producto.nombre);
    formData.append('precio', this.producto.precio.toString());
    
    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.productosService.crearProductoConImagen(formData).subscribe({
      next: (nuevoProducto) => {
        this.productCreated.emit(nuevoProducto);
        this.closeModal();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.error = 'Error al crear el producto. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  private resetForm() {
    this.producto = {
      nombre: '',
      precio: 0
    };
    this.selectedFile = null;
    this.imagePreview = null;
    this.error = null;
    this.loading = false;
  }
}