import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-clothes',
  standalone: true,
  imports: [ProductCardComponent,CommonModule,FormsModule],
  templateUrl: './clothes.component.html',
  styleUrls: ['./clothes.component.css']
})
export class ClothesComponent {
  products: Product[] = [];

  constructor(private http: HttpClient) {
    this.http.get<Product[]>('http://localhost:5050/get_Products').subscribe(products => {
      this.products = products.filter(product => product.fkCategory === 3);
    });
  }
}