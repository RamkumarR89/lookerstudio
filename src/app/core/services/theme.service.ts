import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<Theme>('light');
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeTheme();
  }

  get currentTheme$(): Observable<Theme> {
    return this.currentThemeSubject.asObservable();
  }

  get isDarkMode$(): Observable<boolean> {
    return this.isDarkModeSubject.asObservable();
  }

  get currentTheme(): Theme {
    return this.currentThemeSubject.value;
  }

  get isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  setTheme(theme: Theme): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.currentTheme;
    if (currentTheme === 'auto') {
      // If auto, switch to opposite of current system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'light' : 'dark');
    } else {
      this.setTheme(currentTheme === 'light' ? 'dark' : 'light');
    }
  }

  private initializeTheme(): void {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const theme = storedTheme || 'auto';
    
    this.currentThemeSubject.next(theme);
    this.applyTheme(theme);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (this.currentTheme === 'auto') {
        this.updateDarkModeState(e.matches);
        this.applySystemTheme(e.matches);
      }
    });
  }

  private applyTheme(theme: Theme): void {
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('light-theme', 'dark-theme');
    
    if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.updateDarkModeState(prefersDark);
      this.applySystemTheme(prefersDark);
    } else {
      const isDark = theme === 'dark';
      this.updateDarkModeState(isDark);
      body.classList.add(isDark ? 'dark-theme' : 'light-theme');
    }
  }

  private applySystemTheme(isDark: boolean): void {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    body.classList.add(isDark ? 'dark-theme' : 'light-theme');
  }

  private updateDarkModeState(isDark: boolean): void {
    this.isDarkModeSubject.next(isDark);
  }
}