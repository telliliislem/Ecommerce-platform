import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:5050';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_Products`);
  }

  getCategory(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get_Categories`);
  }

  saveProduct(product: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_Product`, product);
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete_Product?productId=${productId}`);
  }
}
