import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'http://localhost:5050/login'; // Ensure this matches your backend API URL

  constructor(private http: HttpClient) {}

  login(loginData: { username: string; password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, loginData);
  }
  
}
