import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: ' + (error.error?.message || 'Invalid request');
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in again';
            authService.logout();
            router.navigate(['/auth/login']);
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission to access this resource';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource could not be found';
            break;
          case 422:
            errorMessage = 'Validation Error: ' + (error.error?.message || 'Invalid data');
            break;
          case 429:
            errorMessage = 'Too Many Requests: Please try again later';
            break;
          case 500:
            errorMessage = 'Server Error: Something went wrong on our end';
            break;
          case 502:
            errorMessage = 'Bad Gateway: Server is temporarily unavailable';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Server is temporarily down';
            break;
          case 504:
            errorMessage = 'Gateway Timeout: Request timed out';
            break;
          default:
            if (error.error?.message) {
              errorMessage = error.error.message;
            } else {
              errorMessage = `Error ${error.status}: ${error.statusText}`;
            }
        }
      }

      // Show error notification for user-facing errors
      if (error.status !== 401) { // Don't show notification for auth errors as they redirect
        notificationService.error(errorMessage);
      }

      // Log error for debugging
      console.error('HTTP Error:', error);

      return throwError(() => new Error(errorMessage));
    })
  );
};