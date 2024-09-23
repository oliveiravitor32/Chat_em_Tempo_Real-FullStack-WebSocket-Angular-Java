import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: string = '';

  setUser(username: string): void {
    this.user = username;
  }

  getUser(): string {
    return this.user;
  }
}
