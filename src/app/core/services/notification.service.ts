import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationConfig {
  message: string;
  type: NotificationType;
  duration?: number;
  action?: string;
  verticalPosition?: 'top' | 'bottom';
  horizontalPosition?: 'start' | 'center' | 'end' | 'left' | 'right';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  show(config: NotificationConfig): void {
    const snackBarConfig: MatSnackBarConfig = {
      duration: config.duration || 5000,
      verticalPosition: config.verticalPosition || 'bottom',
      horizontalPosition: config.horizontalPosition || 'right',
      panelClass: [`snackbar-${config.type}`]
    };

    this.snackBar.open(config.message, config.action, snackBarConfig);
  }

  success(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'success',
      action,
      duration
    });
  }

  error(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'error',
      action,
      duration: duration || 8000 // Errors should be visible longer
    });
  }

  warning(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'warning',
      action,
      duration
    });
  }

  info(message: string, action?: string, duration?: number): void {
    this.show({
      message,
      type: 'info',
      action,
      duration
    });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}