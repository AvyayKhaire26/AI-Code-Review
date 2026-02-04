import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

import { LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
import { StorageService } from './storage.service';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: StorageService,
    private env: EnvironmentService
  ) {
    // Load user from storage on initialization
    const user = this.storage.getUser();
    if (user) {
      this.currentUserSubject.next(user);
    }
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.env.apiUrl}/auth/register`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.env.apiUrl}/auth/login`, request)
      .pipe(
        tap(response => this.handleAuthResponse(response))
      );
  }

  logout(): void {
    this.storage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private handleAuthResponse(response: AuthResponse): void {
    // Store token
    this.storage.setToken(response.token);
    
    // Store user info
    const userInfo = {
      id: response.userId,
      username: response.username,
      email: response.email
    };
    this.storage.setUser(userInfo);
    
    // Update current user subject
    this.currentUserSubject.next(userInfo);
  }

  isAuthenticated(): boolean {
    const token = this.storage.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();
      return !isExpired;
    } catch (error) {
      return false;
    }
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.storage.getToken();
  }
}
