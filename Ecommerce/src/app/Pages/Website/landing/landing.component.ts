import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports:[RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  searchResults: any[] = [];
  searchTerm: string = '';
  offers:any=[];
  isLoggedIn: boolean = false; // To check login status
  APIURL="http://localhost:5050/";

  constructor(private http: HttpClient, private router: Router, private userService: UserService){}

  ngOnInit() {
    console.log("hello");
    this.get_Offers();
     // Check if the user is logged in
     const userId = this.userService.getUserId();
     this.isLoggedIn = userId !== null;
  }

  onSearch(event: Event) {
    event.preventDefault();
    if (this.searchTerm.trim()) {
      this.http.get<any[]>(`${this.APIURL}search_Products?search_term=${this.searchTerm}`)
        .subscribe(results => {
          this.searchResults = results;
        });
    }
  }

  onProductClick(product: any) {
    const categoryId: number = product.fkCategory as number;

    const categoryMap: { [key: number]: string } = {
      1: '/household',
      2: '/electronics',
      3: '/clothes',
      4: '/books',
      5: '/home'
    };

    if (categoryMap[categoryId]) {
      this.router.navigate([categoryMap[categoryId]]);
    } else {
      console.error('Category ID not found in categoryMap:', categoryId);
    }
  }

  get_Offers(){
    this.http.get(this.APIURL+"get_Offers").subscribe((res)=>{
      console.log(res)
      this.offers=res;
    })
  }
  signOut() {  // Sign-out functionality
    this.userService.clearUserId();
    this.isLoggedIn = false;
    this.router.navigate(['/log'], { queryParams: { successMessage: 'You have been logged out successfully.' } });
  }
}