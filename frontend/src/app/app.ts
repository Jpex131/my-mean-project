import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductosListComponent } from './components/product-list.component';
import { CreateProductComponent } from './components/create-product.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductosListComponent, CreateProductComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('frontend');
}
