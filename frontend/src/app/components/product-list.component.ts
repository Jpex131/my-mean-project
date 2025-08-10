import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProductCardComponent } from './product-card.component';
import { ProductosService, Producto } from '../productos.service';

@Component({
  selector: 'app-productos-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ProductCardComponent],
  providers: [ProductosService],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>Nuestros Productos</h1>
        <p class="subtitle">Descubre nuestra selección de productos</p>
      </header>

      <!-- Loading State -->
      <div *ngIf="loading" class="loading">
        <div class="spinner"></div>
        <p>Cargando productos...</p>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="error">
        <p>❌ Error al cargar productos: {{ error }}</p>
        <button class="btn-retry" (click)="cargarProductos()">
          Reintentar
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && productos.length === 0" class="empty">
        <h3>No hay productos disponibles</h3>
        <p>Parece que no tienes productos registrados aún.</p>
      </div>

      <!-- Products Grid -->
      <div *ngIf="!loading && !error && productos.length > 0" class="products-grid">
        <app-product-card
          *ngFor="let producto of productos; trackBy: trackByProductId"
          [producto]="producto"
          (edit)="onEditProduct($event)"
          (delete)="onDeleteProduct($event)"
          (addToCart)="onAddToCart($event)">
        </app-product-card>
      </div>

      <!-- Success/Info Messages -->
      <div *ngIf="mensaje" class="mensaje" [class.success]="mensajeTipo === 'success'" [class.info]="mensajeTipo === 'info'">
        {{ mensaje }}
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .page-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: #666;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 20px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error {
      text-align: center;
      padding: 40px 20px;
      background: #ffe6e6;
      border-radius: 8px;
      margin: 20px 0;
    }

    .error p {
      color: #d32f2f;
      margin-bottom: 20px;
    }

    .btn-retry {
      background: #f44336;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 600;
    }

    .btn-retry:hover {
      background: #d32f2f;
    }

    .empty {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty h3 {
      margin-bottom: 10px;
      color: #333;
    }

    .products-grid {
      display: flex;
      flex-direction: row;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
      justify-items: flex-start;
    }

    .mensaje {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 5px;
      color: white;
      font-weight: 600;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    }

    .mensaje.success {
      background: #4caf50;
    }

    .mensaje.info {
      background: #2196f3;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 768px) {
      .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
      }
      
      .page-header h1 {
        font-size: 2rem;
      }
    }
  `]
})
export class ProductosListComponent implements OnInit {
  productos: Producto[] = [];
  loading = false;
  error: string | null = null;
  mensaje: string | null = null;
  mensajeTipo: 'success' | 'info' = 'success';

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.error = null;

    this.productosService.getProductos().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'No se pudieron cargar los productos. Verifica que el servidor esté funcionando.';
        this.loading = false;
      }
    });
  }

  onEditProduct(producto: Producto) {
    this.mostrarMensaje(`Función editar para: ${producto.nombre}`, 'info');
    // Aquí puedes implementar la lógica de edición
    console.log('Editar producto:', producto);
  }

  onDeleteProduct(productId: string) {
    this.productosService.eliminarProducto(productId).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p._id !== productId);
        this.mostrarMensaje('Producto eliminado correctamente', 'success');
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        this.mostrarMensaje('Error al eliminar el producto', 'info');
      }
    });
  }

  onAddToCart(producto: Producto) {
    this.mostrarMensaje(`${producto.nombre} agregado al carrito`, 'success');
    // Aquí puedes implementar la lógica del carrito
    console.log('Agregar al carrito:', producto);
  }

  trackByProductId(index: number, producto: Producto): string {
    return producto._id || index.toString();
  }

  mostrarMensaje(mensaje: string, tipo: 'success' | 'info' = 'success') {
    this.mensaje = mensaje;
    this.mensajeTipo = tipo;
    
    setTimeout(() => {
      this.mensaje = null;
    }, 3000);
  }
}