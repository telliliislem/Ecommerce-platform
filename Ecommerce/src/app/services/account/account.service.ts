import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:5050/account';

  constructor(private http: HttpClient) {}

  getAccountDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }
  
  updateAccountDetails(userId: number, updateData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, updateData);
  }  
  
}
