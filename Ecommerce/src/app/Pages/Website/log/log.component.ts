import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../../services/log/log.service';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-log',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log.component.html',
  styleUrl: './log.component.css'
})
export class LogComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = ''; // This is used to display the success message

  constructor(
    private logService: LogService, 
    private userService: UserService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['successMessage']) {
        this.successMessage = params['successMessage'];
      }
    });
  }
  

  onLogin() {
    const loginData = {
      username: this.username,
      password: this.password
    };
  
    this.logService.login(loginData).subscribe(
      response => {
        if (response.success) {
          console.log('User ID from login response:', response.userId); // For debugging purposes
          this.userService.setUserId(response.userId);
          this.router.navigate([response.redirect]);
        } else {
          this.errorMessage = response.message;
        }
      },
      error => {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    );
  }
}
