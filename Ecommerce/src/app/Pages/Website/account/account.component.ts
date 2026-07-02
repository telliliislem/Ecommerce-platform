import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account/account.service';
import { UserService } from '../../../services/user/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  accountDetails: any = {
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    username: '' // Ensure username is included
  };

  isEditing: boolean = false;

  constructor(private accountService: AccountService, private userService: UserService) {}

  ngOnInit(): void {
    const userId = this.userService.getUserId();
    if (userId) {
      this.accountService.getAccountDetails(userId).subscribe(
        (data) => {
          console.log("API Response:", data); // Log the entire response
          
          // Normalize the property names
          this.accountDetails = {
            fullName: data.fullName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            address: data.address,
            username: data.Username // Match the case here
          };
          console.log("Account Details:", this.accountDetails);
          console.log("Username:", this.accountDetails.username);
        },
        (error) => {
          console.error('Failed to fetch account details', error);
        }
      );
    }
  }
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  updateAccount() {
    const userId = this.userService.getUserId();
    if (userId) {
      this.accountService.updateAccountDetails(userId, this.accountDetails).subscribe(
        (response) => {
          alert('Account details updated successfully!');
          this.isEditing = false;
        },
        (error) => {
          console.error('Failed to update account details', error);
        }
      );
    }
  }  
}
