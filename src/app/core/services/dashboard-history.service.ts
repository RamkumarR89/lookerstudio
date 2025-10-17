import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DashboardState {
  id: string;
  timestamp: Date;
  description: string;
  dashboardData: any[];
  chartCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardHistoryService {
  private maxHistorySize = 50; // Maximum number of states to keep
  private history: DashboardState[] = [];
  private currentIndex = -1;
  private originalState: DashboardState | null = null;
  private hasUnsavedChanges = false;

  // Observables for UI state
  private canUndoSubject = new BehaviorSubject<boolean>(false);
  private canRedoSubject = new BehaviorSubject<boolean>(false);
  private canResetSubject = new BehaviorSubject<boolean>(false);
  private hasChangesSubject = new BehaviorSubject<boolean>(false);

  public canUndo$ = this.canUndoSubject.asObservable();
  public canRedo$ = this.canRedoSubject.asObservable();
  public canReset$ = this.canResetSubject.asObservable();
  public hasChanges$ = this.hasChangesSubject.asObservable();

  constructor() {}

  // Initialize with the original state
  initializeState(dashboardData: any[], description: string = 'Initial state'): void {
    const initialState: DashboardState = {
      id: this.generateId(),
      timestamp: new Date(),
      description,
      dashboardData: this.deepClone(dashboardData),
      chartCount: dashboardData.length
    };

    this.originalState = this.deepClone(initialState);
    this.history = [initialState];
    this.currentIndex = 0;
    this.hasUnsavedChanges = false;
    
    this.updateUIState();
  }

  // Save a new state to history
  saveState(dashboardData: any[], description: string): void {
    // Remove any states after current position (for when user undid and then made new changes)
    this.history = this.history.slice(0, this.currentIndex + 1);

    const newState: DashboardState = {
      id: this.generateId(),
      timestamp: new Date(),
      description,
      dashboardData: this.deepClone(dashboardData),
      chartCount: dashboardData.length
    };

    this.history.push(newState);
    this.currentIndex = this.history.length - 1;

    // Limit history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
      // Update original state index if needed
      if (this.originalState && this.currentIndex < 0) {
        this.originalState = this.history[0];
        this.currentIndex = 0;
      }
    }

    this.hasUnsavedChanges = true;
    this.updateUIState();
  }

  // Undo to previous state
  undo(): DashboardState | null {
    if (!this.canUndo()) return null;

    this.currentIndex--;
    this.hasUnsavedChanges = this.currentIndex !== 0 || this.history.length > 1;
    this.updateUIState();
    
    return this.deepClone(this.getCurrentState());
  }

  // Redo to next state
  redo(): DashboardState | null {
    if (!this.canRedo()) return null;

    this.currentIndex++;
    this.hasUnsavedChanges = this.currentIndex !== 0 || this.history.length > 1;
    this.updateUIState();
    
    return this.deepClone(this.getCurrentState());
  }

  // Complete reset - fresh start (clears all history)
  reset(): DashboardState | null {
    if (!this.originalState) return null;

    // Create a fresh start state
    const freshState: DashboardState = {
      id: this.generateId(),
      timestamp: new Date(),
      description: 'Fresh start - Reset to empty',
      dashboardData: [],
      chartCount: 0
    };

    // Complete reset - clear all history and start fresh
    this.history = [freshState];
    this.currentIndex = 0;
    this.originalState = this.deepClone(freshState);
    this.hasUnsavedChanges = false;
    
    this.updateUIState();
    
    return this.deepClone(freshState);
  }

  // Save changes permanently (commit current state as new baseline)
  saveChanges(): void {
    if (this.history.length > 0) {
      this.originalState = this.deepClone(this.getCurrentState());
      this.hasUnsavedChanges = false;
      this.updateUIState();
    }
  }

  // Get current state
  getCurrentState(): DashboardState | null {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  // Get history for debugging/display
  getHistory(): DashboardState[] {
    return this.history.map(state => this.deepClone(state));
  }

  // Check if can undo
  canUndo(): boolean {
    return this.currentIndex > 0;
  }

  // Check if can redo
  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  // Check if can reset (available if there are any charts on dashboard)
  canReset(): boolean {
    const currentState = this.getCurrentState();
    return currentState !== null && currentState.chartCount > 0;
  }

  // Check if has unsaved changes
  hasUnsavedChanges_(): boolean {
    return this.hasUnsavedChanges;
  }

  private updateUIState(): void {
    this.canUndoSubject.next(this.canUndo());
    this.canRedoSubject.next(this.canRedo());
    this.canResetSubject.next(this.canReset());
    this.hasChangesSubject.next(this.hasUnsavedChanges);
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}