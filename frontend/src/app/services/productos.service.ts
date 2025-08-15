import { Injectable } from "@angular/core"; 
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

export interface Producto {
    _id?: string;
    nombre: string;
    precio: number;
    imagen?: string;
    __v?:number;
}

    
@Injectable({
    providedIn: 'root'
})

export class ProductosService {
    private apiUrl = 'http://localhost:3000/api/productos';

    constructor(private http: HttpClient) {}

    // Obtener todos los productos
    getProductos(): Observable<Producto[]> {
        return this.http.get<Producto[]>(this.apiUrl);
    }
    // Eliminar producto
    eliminarProducto(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    
    // Obtener un producto por ID
    getProducto(id: string): Observable<Producto> {
        return this.http.get<Producto>(`${this.apiUrl}/${id}`);
    }
    // Crear producto
    crearProducto(producto: Producto): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, producto);
    }
    // Actualizar producto
    actualizarProducto(id: string, producto: Producto): Observable<Producto> {
        return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
    }  

    // Subir imagen
    crearProductoConImagen(formData: FormData): Observable<Producto> {
        return this.http.post<Producto>(this.apiUrl, formData);
    }
}

