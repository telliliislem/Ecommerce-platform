import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { UserService } from '../../../services/user/user.service';

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
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule], // Include CommonModule here
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  showSuccessMessage: boolean = false;
  showErrorMessage: boolean = false;

  constructor(private http: HttpClient, private userService: UserService) { }

  addToCart() {
    const userId = this.userService.getUserId();  // This should return a valid user ID
    const productId = this.product.productId;     // Ensure this correctly references the product ID
    const quantity = 1;                           // The quantity can be set by the user
  
    if (userId && productId) {
      this.http.post('http://localhost:5050/add_to_cart', {
        fkCustomer: userId,
        fkProduct: productId,
        ProductQuantity: quantity
      }).subscribe(response => {
        console.log('Added to cart:', response);
        this.showSuccessMessage = true; // Show success message
        setTimeout(() => this.showSuccessMessage = false, 3000); // Hide message after 3 seconds
        this.showErrorMessage = false; // Hide error message if any
      }, error => {
        console.error('Error adding to cart:', error);
      });
    } else {
      this.showErrorMessage = true; // Show error message if user is not logged in
      setTimeout(() => this.showErrorMessage = false, 3000); // Hide message after 3 seconds
      console.error('User ID or Product ID is missing');
    }
  }
}
