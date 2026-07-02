import { NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [NgFor],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})

  export class ProductComponent implements OnInit {
    products: any= [] ;
  
    constructor(private http: HttpClient) { }
  
    ngOnInit(): void {
      this.http.get('http://localhost:5050/get_Products').subscribe(response => {
        this.products = response;
      });
    }
  
    addToCart(productId: number) {
     
      this.http.post('http://localhost:5050/add_Order', { productId: productId }).subscribe(response => {
        console.log('Product added to cart', response);
   
      }, error => {
        console.error('Error adding product to cart', error);
       
      });
    }
  }