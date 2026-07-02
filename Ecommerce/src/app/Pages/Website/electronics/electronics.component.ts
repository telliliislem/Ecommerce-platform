import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductCardComponent } from '../product-card/product-card.component';
import { NgFor } from '@angular/common';

interface Product {
  productId: number;
  productSku: string;
  productName: string;
  productPrice: number;
  productShortName: string;
  productDescription: string;
  deliveryTimeSpan: string;
  fkCategory: number;
  productImageUrl: string;
}

@Component({
  selector: 'app-electronics',
  standalone: true,
  imports: [ProductCardComponent,NgFor],
  templateUrl: './electronics.component.html',
  styleUrls: ['./electronics.component.css']
})
export class ElectronicsComponent {
  products: Product[] = [];

  constructor(private http: HttpClient) {
    this.http.get<Product[]>('http://localhost:5050/get_Products').subscribe(products => {
      this.products = products.filter(product => product.fkCategory === 2);
    });
  }
}