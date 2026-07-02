import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userIdKey = 'userId';

  setUserId(id: number) {
    localStorage.setItem(this.userIdKey, id.toString());
    console.log('User ID set to:', id);
  }

  getUserId(): number | null {
    const userId = localStorage.getItem(this.userIdKey);
    return userId ? parseInt(userId, 10) : null;
  }

  clearUserId() {
    localStorage.removeItem(this.userIdKey);
  }
}
