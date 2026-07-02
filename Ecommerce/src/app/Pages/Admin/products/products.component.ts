import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/product/product.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  isSidePanelVisible = false;
  products: any[] = [];
  categoryList: any[] = [];
  productForm = new FormGroup({
    productSku: new FormControl('', [Validators.required]),
    productName: new FormControl('', [Validators.required]),
    productPrice: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    productShortName: new FormControl(''),
    fkCategory: new FormControl('', [Validators.required]),
    deliveryTimeSpan: new FormControl('', [Validators.required]),
    productImageUrl: new FormControl('', [Validators.required]),
    productDescription: new FormControl('')
  });
  

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getProducts();
    this.getCategories(); // Fetch categories on initialization
    console.log(this.productForm.controls);
  }
  
  
  getProducts() {
    this.productService.getProducts().subscribe((res) => {
      if (res) {
        this.products = res;
        console.log(this.products);
      } else {
        console.error('Failed to retrieve products');
      }
    });
  }

  getCategories() {
    this.productService.getCategory().subscribe((res) => {
      if (res) {
        this.categoryList = res;
      } else {
        console.error('Failed to retrieve categories');
      }
    });
  }
  
  addProduct() {
    if (this.productForm.invalid) {
        console.error('Form is invalid');
        return;
    }

    const body = this.productForm.value;
    console.log('Form values:', body); // Log form values to debug

    this.productService.saveProduct(body).subscribe((res) => {
        if (res) {
            this.getProducts();
            this.resetForm();
            this.closeSidePanel();
        } else {
            console.error('Failed to add product');
        }
    }, (error) => {
        console.error('Error:', error);
    });
}


onSave() {
  console.log('Form values:', this.productForm.value);
  console.log('Form valid:', this.productForm.valid);

  if (this.productForm.valid) {
    this.addProduct();
    this.closeSidePanel();
  } else {
    alert('Please fill out the required fields.');
  }
}


  openSidePanel() {
    this.isSidePanelVisible = true;
  }

  closeSidePanel() {
    this.isSidePanelVisible = false;
  }

  resetForm() {
    this.productForm.reset();
  }

  deleteProduct(product: any) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(product.productId).subscribe((res) => {
        if (res) {
          alert('Product deleted successfully');
          this.getProducts();
        } else {
          alert('Failed to delete product');
        }
      });
    }
  }
}
