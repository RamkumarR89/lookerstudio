import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DrawingRegion {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'chart' | 'control' | 'text';
}

export interface DrawingState {
  isDrawing: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

@Injectable({
  providedIn: 'root'
})
export class RegionDrawingHandler {
  private drawingStateSubject = new BehaviorSubject<DrawingState>({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0
  });

  private regionsSubject = new BehaviorSubject<DrawingRegion[]>([]);

  public drawingState$ = this.drawingStateSubject.asObservable();
  public regions$ = this.regionsSubject.asObservable();

  private canvas: HTMLElement | null = null;

  constructor() {}

  initializeCanvas(canvasElement: HTMLElement) {
    this.canvas = canvasElement;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  private onMouseDown(event: MouseEvent) {
    if (!this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    this.drawingStateSubject.next({
      isDrawing: true,
      startX,
      startY,
      currentX: startX,
      currentY: startY
    });
  }

  private onMouseMove(event: MouseEvent) {
    const currentState = this.drawingStateSubject.value;
    if (!currentState.isDrawing || !this.canvas) return;

    const rect = this.canvas.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    this.drawingStateSubject.next({
      ...currentState,
      currentX,
      currentY
    });
  }

  private onMouseUp(event: MouseEvent) {
    const currentState = this.drawingStateSubject.value;
    if (!currentState.isDrawing) return;

    const region = this.createRegionFromState(currentState);
    if (this.isValidRegion(region)) {
      this.addRegion(region);
    }

    this.drawingStateSubject.next({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    });
  }

  private createRegionFromState(state: DrawingState): DrawingRegion {
    const x = Math.min(state.startX, state.currentX);
    const y = Math.min(state.startY, state.currentY);
    const width = Math.abs(state.currentX - state.startX);
    const height = Math.abs(state.currentY - state.startY);

    return {
      id: this.generateId(),
      x,
      y,
      width,
      height,
      type: 'chart' // Default type
    };
  }

  private isValidRegion(region: DrawingRegion): boolean {
    return region.width > 50 && region.height > 50; // Minimum size threshold
  }

  private addRegion(region: DrawingRegion) {
    const currentRegions = this.regionsSubject.value;
    this.regionsSubject.next([...currentRegions, region]);
  }

  public removeRegion(regionId: string) {
    const currentRegions = this.regionsSubject.value;
    const filteredRegions = currentRegions.filter(r => r.id !== regionId);
    this.regionsSubject.next(filteredRegions);
  }

  public updateRegion(regionId: string, updates: Partial<DrawingRegion>) {
    const currentRegions = this.regionsSubject.value;
    const updatedRegions = currentRegions.map(region => 
      region.id === regionId ? { ...region, ...updates } : region
    );
    this.regionsSubject.next(updatedRegions);
  }

  public clearAllRegions() {
    this.regionsSubject.next([]);
  }

  public enableDrawing() {
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  }

  public disableDrawing() {
    if (this.canvas) {
      this.canvas.style.cursor = 'default';
    }
  }

  private generateId(): string {
    return 'region_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  public getDrawingPreview(): Observable<{x: number, y: number, width: number, height: number} | null> {
    return new Observable(observer => {
      this.drawingState$.subscribe(state => {
        if (state.isDrawing) {
          const x = Math.min(state.startX, state.currentX);
          const y = Math.min(state.startY, state.currentY);
          const width = Math.abs(state.currentX - state.startX);
          const height = Math.abs(state.currentY - state.startY);
          
          observer.next({ x, y, width, height });
        } else {
          observer.next(null);
        }
      });
    });
  }

  public destroy() {
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    }
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }
}