import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '../productos.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="product-card">
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
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin: 10px;
      transition: all 0.3s ease;
      border: 1px solid #e0e0e0;
      max-width: 300px;
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .product-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
    }

    .product-name {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin: 0;
      flex: 1;
      margin-right: 10px;
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
      margin-bottom: 20px;
    }

    .price-container {
      margin-bottom: 10px;
    }

    .currency {
      font-size: 1.1rem;
      color: #666;
      margin-right: 2px;
    }

    .price {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2c5aa0;
    }

    .product-id {
      font-size: 0.8rem;
      color: #888;
      font-family: monospace;
    }

    .product-footer {
      border-top: 1px solid #f0f0f0;
      padding-top: 15px;
    }

    .btn-primary {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-size: 0.95rem;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:active {
      transform: translateY(0);
    }
  `]
})
export class ProductCardComponent {
  @Input() producto!: Producto;
  @Output() edit = new EventEmitter<Producto>();
  @Output() delete = new EventEmitter<string>();
  @Output() addToCart = new EventEmitter<Producto>();

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
}