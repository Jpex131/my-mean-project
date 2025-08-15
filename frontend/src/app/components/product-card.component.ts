import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../services/productos.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
      <!-- Imagen del producto -->
      <div class="product-image" *ngIf="producto.imagen">
        <img 
          [src]="producto.imagen" 
          [alt]="producto.nombre"
          (error)="onImageError($event)"
          class="product-img">
      </div>
      
      <!-- Placeholder si no hay imagen -->
      <div class="product-image-placeholder" *ngIf="!producto.imagen || imageError">
        <div class="placeholder-content">
          <span class="placeholder-icon">📦</span>
          <span class="placeholder-text">Sin imagen</span>
        </div>
      </div>

      <div class="product-header">
        <h3 class="product-name">{{ producto.nombre }}</h3>
        <div class="product-actions">
          <button 
            class="btn-edit" 
            (click)="onEdit()"
            title="Editar producto">
            ✏️
          </button>
          <button 
            class="btn-delete" 
            (click)="onDelete()"
            title="Eliminar producto">
            🗑️
          </button>
        </div>
      </div>
      
      <div class="product-body">
        <div class="price-container">
          <span class="currency">$</span>
          <span class="price">{{ producto.precio | number:'1.2-2' }}</span>
        </div>
        
        <div class="product-id">
          ID: {{ producto._id?.slice(-6) }}
        </div>
      </div>
      
      <div class="product-footer">
        <button 
          class="btn-primary"
          (click)="onAddToCart()">
          Agregar al Carrito
        </button>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      width: 300px;
      height: 380px; /* Aumentamos la altura para la imagen */
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      flex: 0 0 auto;
      
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 15px;
      margin: 10px;
      transition: all 0.3s ease;
      border: 1px solid #80b68dff;
      max-width: 300px;
      overflow: hidden;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    /* Estilos para la imagen */
    .product-image {
      width: 100%;
      height: 140px;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 15px;
      background: #f8f9fa;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-img:hover {
      transform: scale(1.05);
    }

    /* Placeholder para cuando no hay imagen */
    .product-image-placeholder {
      width: 100%;
      height: 140px;
      border-radius: 8px;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 15px;
      border: 2px dashed #dee2e6;
    }

    .placeholder-content {
      text-align: center;
      color: #6c757d;
    }

    .placeholder-icon {
      font-size: 2rem;
      display: block;
      margin-bottom: 5px;
    }

    .placeholder-text {
      font-size: 0.8rem;
      font-weight: 500;
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .product-name {
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      margin: 0;
      flex: 1;
      margin-right: 10px;
      line-height: 1.3;
    }

    .product-actions {
      display: flex;
      gap: 5px;
    }

    .btn-edit, .btn-delete {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      font-size: 14px;
      transition: background-color 0.2s;
    }

    .btn-edit:hover {
      background-color: #f0f0f0;
    }

    .btn-delete:hover {
      background-color: #ffe6e6;
    }

    .product-body {
      flex: 1;
      margin-bottom: 15px;
    }

    .price-container {
      margin-bottom: 8px;
    }

    .currency {
      font-size: 1rem;
      color: #666;
      margin-right: 2px;
    }

    .price {
      font-size: 1.6rem;
      font-weight: 700;
      color: #2c5aa0;
    }

    .product-id {
      font-size: 0.75rem;
      color: #888;
      font-family: monospace;
    }

    .product-footer {
      border-top: 1px solid #f0f0f0;
      padding-top: 12px;
      margin-top: auto;
    }

    .btn-primary {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.9rem;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      .product-card {
        width: 280px;
        height: 360px;
      }
      
      .product-image,
      .product-image-placeholder {
        height: 120px;
      }
    }
  `]
})
export class ProductCardComponent {
  @Input() producto!: Producto;
  @Output() edit = new EventEmitter<Producto>();
  @Output() delete = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<Producto>();

  imageError = false;

  onEdit() {
    this.edit.emit(this.producto);
  }

  onDelete() {
    if (confirm(`¿Estás seguro de que quieres eliminar "${this.producto.nombre}"?`)) {
      this.delete.emit(this.producto._id!);
    }
  }

  onAddToCart() {
    this.addToCart.emit(this.producto);
  }

  onImageError(event: any) {
    console.warn('Error cargando imagen:', this.producto.imagen || 'No definida');
    this.imageError = true;
  }
}