import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Import Router

interface CartItem {
  CartId: number;
  fkCustomer: number;
  fkProduct: number;
  ProductQuantity: number;
  productName: string;
  productPrice: number;
  productImageUrl: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'] // Corrected styleUrl to styleUrls
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  deliveryAddress: string = '';
  deliveryCity: string = '';
  deliveryPinCode: string = '';
  orderConfirmedMessage: string = '';
  errorMessage: string = ''; // Add error message variable
  cities: string[] = ['Tunis', 'Sfax', 'Sousse', 'Kairouan', 'Bizerte','Ariana','Manouba','Ben Arous','Nabeul']; // Add more cities as needed

  constructor(
    private http: HttpClient, 
    private userService: UserService, 
    private cdr: ChangeDetectorRef,
    private router: Router // Inject Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    const userId = this.userService.getUserId();
    if (userId !== null) {
      this.http.get<CartItem[]>(`http://localhost:5050/view_cart/${userId}`).subscribe(items => {
        this.cartItems = items;
        console.log('Loaded Cart Items:', this.cartItems);
        this.cdr.detectChanges(); // Manually trigger change detection
      }, error => {
        console.error('Error loading cart items:', error);
      });
    } else {
      console.error('User ID is not set');
    }
  }

  updateQuantity(item: CartItem) {
    this.http.put(`http://localhost:5050/update_cart/${item.CartId}`, {
      ProductQuantity: item.ProductQuantity
    }).subscribe(response => {
      console.log('Quantity updated:', response);
    });
  }

  removeFromCart(cartId: number) {
    console.log(cartId);
    this.http.delete(`http://localhost:5050/delete_from_cart/${cartId}`).subscribe(response => {
      this.cartItems = this.cartItems.filter(item => item.CartId !== cartId);
      console.log('Item removed:', response);
    });
  }

  confirmOrder() {
    // Validate form fields
    if (!this.deliveryCity || !this.deliveryAddress || !this.deliveryPinCode) {
      this.errorMessage = 'All fields are required!'; // Set error message
      return;
    }

    const userId = this.userService.getUserId();
    if (!userId) {
      alert('You must be logged in to confirm an order.');
      return;
    }

    // Check if the cart is empty
    if (this.cartItems.length === 0) {
      this.orderConfirmedMessage = 'Your cart is empty. Please add items to your cart before confirming the order.';
      return;
    }

    if (userId !== null) {
      const totalAmount = this.calculateTotalAmount();
      
      if (isNaN(totalAmount)) {
        console.error('TotalInvoiceAmount is NaN');
        return;
      }

      const saleDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const formData = new FormData();
      formData.append('fkCustomer', userId.toString());
      formData.append('SaleDate', saleDate);
      formData.append('TotalInvoiceAmount', totalAmount.toString());
      formData.append('Discount', '0');
      formData.append('PaymentNarration', 'paid via cash'); // Default value
      formData.append('DeliveryAddress', this.deliveryAddress);
      formData.append('DeliveryCity', this.deliveryCity);
      formData.append('IsCanceled', '0');
      formData.append('DeliveryPinCode', this.deliveryPinCode.toString());

      this.http.post('http://localhost:5050/confirm_order', formData).subscribe(response => {
        console.log('Order confirmed:', response);
        this.cartItems = [];
        this.orderConfirmedMessage = 'Your order has been confirmed! We will contact you soon to receive it.';
        this.resetForm(); // Reset form after confirmation
      }, error => {
        console.error('Error confirming order:', error);
      });
    } else {
      console.error('User ID is not set');
    }
  }

  // Reset the form fields
  resetForm() {
    this.deliveryCity = '';
    this.deliveryAddress = '';
    this.deliveryPinCode = '';
    this.errorMessage = ''; // Clear error message
  }

  calculateTotalAmount(): number {
    return this.cartItems.reduce((total, item) => {
      const price = Number(item.productPrice);
      const quantity = Number(item.ProductQuantity);
      return total + (price * quantity);
    }, 0);
  }

  // Add the goHome method
  goHome() {
    this.router.navigate(['/']); // Navigate to home page
  }
}
