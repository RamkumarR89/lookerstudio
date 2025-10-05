import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  avatar?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  constructor(private router: Router) {
    // Check for stored authentication state
    this.checkStoredAuth();
    
    // Auto-login demo user for development
    if (!this.isAuthenticated) {
      this.loginDemoUser();
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(email: string, password: string): Observable<User> {
    // TODO: Replace with actual API call
    // Mock authentication for development
    const mockUser: User = {
      id: '1',
      email: email,
      name: email.split('@')[0],
      role: 'admin',
      avatar: 'https://via.placeholder.com/40x40'
    };

    // Set user immediately for demo
    this.setUser(mockUser);
    localStorage.setItem('authToken', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify(mockUser));

    return of(mockUser);
  }

  logout(): void {
    this.clearUser();
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.router.navigate(['/auth/login']);
  }

  register(userData: {
    email: string;
    password: string;
    name: string;
  }): Observable<User> {
    // TODO: Replace with actual API call
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: 'editor'
    };

    return of(newUser);
  }

  private setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  private clearUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  private checkStoredAuth(): void {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.setUser(user);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.logout();
      }
    }
  }

  private loginDemoUser(): void {
    const demoUser: User = {
      id: 'demo',
      email: 'demo@reportstudio.com',
      name: 'Demo User',
      role: 'admin',
      avatar: '👤'
    };
    
    this.setUser(demoUser);
    localStorage.setItem('authToken', 'demo-token');
    localStorage.setItem('user', JSON.stringify(demoUser));
  }
}