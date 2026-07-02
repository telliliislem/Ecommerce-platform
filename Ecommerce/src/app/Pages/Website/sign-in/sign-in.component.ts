import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SignInService } from '../../../services/sign-in/sign-in.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'] // Fixed typo from styleUrl to styleUrls
})
export class SignInComponent {
  fullName: string = '';
  email: string = '';
  phoneNumber: string = '';
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private signInService: SignInService, private router: Router, private http: HttpClient) {}

  onSignUp(signupForm: NgForm) {
    if (!signupForm.valid) {
      this.errorMessage = 'Please fill out all the fields.';
      return;
    }

    this.checkEmailAndUsername().then(isUnique => {
      if (isUnique) {
        const customerData = {
          fullName: this.fullName,
          email: this.email,
          phoneNumber: this.phoneNumber,
          username: this.username,
          password: this.password
        };

        this.signInService.addCustomer(customerData).subscribe(
          response => {
            if (response.success) {
              this.successMessage = 'Account created successfully! Please log in now.';
              this.router.navigate(['/log'], { queryParams: { successMessage: this.successMessage } });
            } else {
              this.errorMessage = response.message;
            }
          },
          error => {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        );
      }
    }).catch(error => {
      this.errorMessage = error;
    });
  }

  checkEmailAndUsername(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(`http://localhost:5050/check_email/${this.email}`).subscribe(
        () => {
          this.http.get<any>(`http://localhost:5050/check_username/${this.username}`).subscribe(
            () => resolve(true),
            error => reject('Username is already taken, please choose another one.')
          );
        },
        error => reject('Email is already used, please choose another one.')
      );
    });
  }
}
