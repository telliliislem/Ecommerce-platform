import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders: any = [];
  selectedOrder: any = null;
  updateForm = new FormGroup({
    PaymentNarration: new FormControl(''),
    DeliveryAddress: new FormControl(''),
    DeliveryCity: new FormControl(''),
    IsCanceled: new FormControl(0),
    DeliveryPinCode: new FormControl(0),
  });

  APIURL = "http://localhost:5050/";

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.get_Orders();
  }

  get_Orders() {
    this.http.get(this.APIURL + "get_Orders").subscribe((res: any) => {
      if (res) {
        // Group orders by OrderId and aggregate products
        const ordersMap = new Map();
        res.forEach((item: any) => {
          if (!ordersMap.has(item.OrderId)) {
            ordersMap.set(item.OrderId, {
              ...item,
              products: []
            });
          }
          ordersMap.get(item.OrderId).products.push({
            productName: item.productName,
            productPrice: item.productPrice,
            ProductQuantity: item.ProductQuantity
          });
        });
        this.orders = Array.from(ordersMap.values());
        console.log(this.orders);
      } else {
        console.error("Failed to retrieve orders");
      }
    });
  }

  delete_Order(order: any) {
    if (order && order.OrderId) {
      this.http.delete(`${this.APIURL}delete_Order/${order.OrderId}`).subscribe({
        next: (res) => {
          console.log("Order deleted successfully:", res);
          this.get_Orders(); // Refresh the order list
        },
        error: (err) => {
          console.error("Error deleting order:", err);
          alert("Failed to delete order");
        },
      });
    } else {
      console.error("Invalid order object provided:", order);
      alert("Invalid order. Unable to delete.");
    }
  }

  edit_Order(order: any) {
    this.selectedOrder = order;
    this.updateForm.patchValue({
      PaymentNarration: order.PaymentNarration,
      DeliveryAddress: order.DeliveryAddress,
      DeliveryCity: order.DeliveryCity,
      IsCanceled: order.IsCanceled,
      DeliveryPinCode: order.DeliveryPinCode,
    });
  }

  update_Order() {
    if (this.selectedOrder) {
      const updatedOrder = {
        PaymentNarration: this.updateForm.value.PaymentNarration?.trim() || null,
        DeliveryAddress: this.updateForm.value.DeliveryAddress?.trim() || null,
        DeliveryCity: this.updateForm.value.DeliveryCity?.trim() || null,
        IsCanceled: this.updateForm.value.IsCanceled != null ? this.updateForm.value.IsCanceled : null,
        DeliveryPinCode: this.updateForm.value.DeliveryPinCode || null,
      };

      // Check if at least one field is filled before sending the request
      const hasUpdates = Object.values(updatedOrder).some(val => val !== null);

      if (hasUpdates) {
        // Create the headers with 'Content-Type' as 'application/json'
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        this.http.put(`${this.APIURL}update_Order/${this.selectedOrder.OrderId}`, updatedOrder, { headers }).subscribe({
          next: (res) => {
            console.log("Order updated successfully:", res);
            this.get_Orders(); // Refresh the order list
            this.selectedOrder = null; // Reset the selected order
          },
          error: (err) => {
            console.error("Error updating order:", err);
            alert("Failed to update order");
          },
        });
      } else {
        alert("No fields to update");
      }
    }
  }
}
