import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInService {
  private apiUrl = 'http://localhost:5050/add_customer';

  constructor(private http: HttpClient) { }

  addCustomer(customerData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, customerData, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
