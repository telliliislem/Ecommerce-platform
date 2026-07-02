import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
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
  selector: 'app-household',
  standalone: true,
  imports: [CommonModule,FormsModule,ProductCardComponent],
  templateUrl: './household.component.html',
  styleUrl: './household.component.css'
})
export class HouseholdComponent {
  products: Product[] = [];

  constructor(private http: HttpClient) {
    this.http.get<Product[]>('http://localhost:5050/get_Products').subscribe(products => {
      this.products = products.filter(product => product.fkCategory === 1);
    });
  }

}
