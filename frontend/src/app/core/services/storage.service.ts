import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  // JWT Token
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  // User Info
  setUser(user: any): void {
    localStorage.setItem('user_info', JSON.stringify(user));
  }

  getUser(): any {
    const userStr = localStorage.getItem('user_info');
    return userStr ? JSON.parse(userStr) : null;
  }

  removeUser(): void {
    localStorage.removeItem('user_info');
  }

  // Clear all
  clear(): void {
    localStorage.clear();
  }
}
