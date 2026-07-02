import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private APIURL = 'http://localhost:5050/'; // Your API URL

  constructor(private http: HttpClient) {}

  updateOrder(orderId: number, updatedOrder: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Check if there are any updates to be made
    const hasUpdates = Object.keys(updatedOrder).length > 0;

    if (hasUpdates) {
      return this.http.put(`${this.APIURL}update_Order/${orderId}`, updatedOrder, { headers });
    } else {
      alert("No fields to update");
      return new Observable(); // Return an empty observable in case of no updates
    }
  }
}
