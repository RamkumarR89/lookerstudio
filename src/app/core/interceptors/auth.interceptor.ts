import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Get the auth token
  const authToken = localStorage.getItem('authToken');

  // Clone the request and add the authorization header if token exists
  if (authToken && authService.isAuthenticated) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(authReq);
  }

  // If no token or not authenticated, proceed with original request
  return next(req);
};