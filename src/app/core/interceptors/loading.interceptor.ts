import { inject, Injectable } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingRequestsCount = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);

  get isLoading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  get isLoading(): boolean {
    return this.loadingSubject.value;
  }

  increaseLoadingCount(): void {
    this.loadingRequestsCount++;
    if (this.loadingRequestsCount === 1) {
      this.loadingSubject.next(true);
    }
  }

  decreaseLoadingCount(): void {
    if (this.loadingRequestsCount > 0) {
      this.loadingRequestsCount--;
    }

    if (this.loadingRequestsCount === 0) {
      this.loadingSubject.next(false);
    }
  }

  // Method to manually control loading state if needed
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
}

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  // Don't show loading for certain requests (like authentication checks)
  const skipLoading = req.headers.has('X-Skip-Loading') || 
                     req.url.includes('/auth/check') ||
                     req.method === 'GET' && req.url.includes('/heartbeat');

  if (!skipLoading) {
    loadingService.increaseLoadingCount();
  }

  return next(req).pipe(
    finalize(() => {
      if (!skipLoading) {
        loadingService.decreaseLoadingCount();
      }
    })
  );
};