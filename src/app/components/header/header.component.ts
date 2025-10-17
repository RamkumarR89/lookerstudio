import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardHistoryService } from '../../core/services/dashboard-history.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Exact Looker Studio Header -->
    <header class="looker-header">
      <div class="header-content">
        <!-- Left: Logo and Title -->
        <div class="header-left">
          <div class="logo">📊</div>
          <span class="report-title">Untitled Report</span>
        </div>
        
        <!-- Center: Menu Items -->
        <nav class="header-nav">
          <span class="nav-item">File</span>
          <span class="nav-item">Edit</span>
          <span class="nav-item">View</span>
          <span class="nav-item">Page</span>
        </nav>
        
        <!-- Right: Action Buttons -->
        <div class="header-right">
          <button class="header-btn reset-btn" 
                  (click)="onReset()" 
                  [disabled]="!canReset"
                  [title]="canReset ? 'Reset to original state' : 'No changes to reset'">
            <span class="icon">↺</span>
            Reset
          </button>
          
          <button class="header-btn save-btn" 
                  (click)="onSave()" 
                  [disabled]="!hasChanges"
                  [class.primary]="hasChanges"
                  [title]="hasChanges ? 'Save changes' : 'No changes to save'">
            <span class="icon">💾</span>
            Save
          </button>
          
          <button class="header-btn primary view-btn" (click)="onView()">
            <span class="icon">👁️</span>
            View
          </button>
          
          <button class="header-btn icon-only">⋮</button>
          <div class="user-avatar">R</div>
        </div>
      </div>
    </header>
    
    <!-- Main Toolbar -->
    <div class="main-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn icon-btn" 
                (click)="onUndo()" 
                [disabled]="!canUndo"
                [title]="canUndo ? 'Undo last action' : 'Nothing to undo'">↶</button>
        <button class="toolbar-btn icon-btn" 
                (click)="onRedo()" 
                [disabled]="!canRedo"
                [title]="canRedo ? 'Redo last action' : 'Nothing to redo'">↷</button>
        
        <div class="zoom-controls">
          <button class="toolbar-btn icon-btn" 
                  (click)="onZoomOut()" 
                  [disabled]="currentZoom <= minZoom"
                  [title]="'Zoom out (' + currentZoom + '%)'">🔍-</button>
          <span class="zoom-display">{{ currentZoom }}%</span>
          <button class="toolbar-btn icon-btn" 
                  (click)="onZoomIn()" 
                  [disabled]="currentZoom >= maxZoom"
                  [title]="'Zoom in (' + currentZoom + '%)'">🔍+</button>
          <button class="toolbar-btn icon-btn" 
                  (click)="onZoomReset()" 
                  [disabled]="currentZoom === 100"
                  title="Reset zoom to 100%">🔍</button>
          <button class="toolbar-btn icon-btn" 
                  (click)="onPanReset()" 
                  [disabled]="currentZoom <= 100"
                  title="Center view">🎯</button>
        </div>
        <span class="separator"></span>
        
        <button class="toolbar-btn primary-btn" (click)="onAddData()">
          📊 Add data
        </button>
        
        <button class="toolbar-btn dropdown-btn" (click)="onAddChart()">
          📈 Add a chart ▼
        </button>
        
        <button class="toolbar-btn dropdown-btn">
          🎛️ Add a control ▼
        </button>
        
        <span class="separator"></span>
        
        <button class="toolbar-btn icon-btn">&lt;/&gt;</button>
        
        <span class="separator"></span>
        
      </div>
      
      <div class="toolbar-right">
        <span class="theme-text" (click)="onThemePanel()">Theme and layout</span>
      </div>
    </div>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Output() addDataClicked = new EventEmitter<void>();
  @Output() addChartClicked = new EventEmitter<void>();
  @Output() themePanelClicked = new EventEmitter<void>();
  @Output() viewClicked = new EventEmitter<void>();
  
  // History-related outputs
  @Output() undoClicked = new EventEmitter<any>();
  @Output() redoClicked = new EventEmitter<any>();
  @Output() resetClicked = new EventEmitter<any>();
  @Output() saveClicked = new EventEmitter<void>();
  
  // Zoom-related outputs
  @Output() zoomChanged = new EventEmitter<number>();
  @Output() panReset = new EventEmitter<void>();

  // UI state properties
  canUndo = false;
  canRedo = false;
  canReset = false;
  hasChanges = false;
  
  // Zoom properties
  currentZoom = 100;
  minZoom = 25;
  maxZoom = 200;
  zoomStep = 25;

  private subscriptions = new Subscription();

  constructor(private historyService: DashboardHistoryService) {}

  ngOnInit(): void {
    // Subscribe to history service observables
    this.subscriptions.add(
      this.historyService.canUndo$.subscribe(canUndo => {
        this.canUndo = canUndo;
      })
    );

    this.subscriptions.add(
      this.historyService.canRedo$.subscribe(canRedo => {
        this.canRedo = canRedo;
      })
    );

    this.subscriptions.add(
      this.historyService.canReset$.subscribe(canReset => {
        this.canReset = canReset;
      })
    );

    this.subscriptions.add(
      this.historyService.hasChanges$.subscribe(hasChanges => {
        this.hasChanges = hasChanges;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onAddData() {
    this.addDataClicked.emit();
  }

  onAddChart() {
    this.addChartClicked.emit();
  }

  onThemePanel() {
    this.themePanelClicked.emit();
  }

  onView() {
    this.viewClicked.emit();
  }

  onUndo() {
    const previousState = this.historyService.undo();
    if (previousState) {
      this.undoClicked.emit(previousState);
    }
  }

  onRedo() {
    const nextState = this.historyService.redo();
    if (nextState) {
      this.redoClicked.emit(nextState);
    }
  }

  onReset() {
    const originalState = this.historyService.reset();
    if (originalState) {
      this.resetClicked.emit(originalState);
    }
  }

  onSave() {
    this.historyService.saveChanges();
    this.saveClicked.emit();
  }

  onZoomIn() {
    if (this.currentZoom < this.maxZoom) {
      this.currentZoom = Math.min(this.currentZoom + this.zoomStep, this.maxZoom);
      this.zoomChanged.emit(this.currentZoom);
    }
  }

  onZoomOut() {
    if (this.currentZoom > this.minZoom) {
      this.currentZoom = Math.max(this.currentZoom - this.zoomStep, this.minZoom);
      this.zoomChanged.emit(this.currentZoom);
    }
  }

  onZoomReset() {
    this.currentZoom = 100;
    this.zoomChanged.emit(this.currentZoom);
  }

  onPanReset() {
    this.panReset.emit();
  }
}