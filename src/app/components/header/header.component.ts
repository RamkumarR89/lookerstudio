import { Component, EventEmitter, Output, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardHistoryService } from '../../core/services/dashboard-history.service';
import { GridDimensionService } from '../../core/services/grid-dimension.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Unified Looker Studio Header -->
    <header class="looker-header">
      <div class="header-content">
        <!-- Left: Logo, Title & Menu -->
        <div class="header-left">
          <div class="logo">📊</div>
          <span class="report-title">Untitled Report</span>
          
          <span class="separator"></span>
          
          <!-- Menu Items First -->
          <nav class="header-nav">
            <span class="nav-item" title="File operations">File</span>
            <span class="nav-item" title="Edit dashboard">Edit</span>
            <span class="nav-item" title="View options">View</span>
            <span class="nav-item" title="Page settings">Page</span>
          </nav>
          
          <span class="separator"></span>
          
          <!-- History Controls -->
          <button class="header-btn icon-btn" 
                  (click)="onUndo()" 
                  [disabled]="!canUndo"
                  [title]="canUndo ? 'Undo last action' : 'Nothing to undo'">↶</button>
          <button class="header-btn icon-btn" 
                  (click)="onRedo()" 
                  [disabled]="!canRedo"
                  [title]="canRedo ? 'Redo last action' : 'Nothing to redo'">↷</button>
          
          <!-- Zoom Controls -->
          <div class="zoom-controls">
            <button class="header-btn icon-btn" 
                    (click)="onZoomOut()" 
                    [disabled]="currentZoom <= minZoom"
                    [title]="'Zoom out (' + currentZoom + '%)'">🔍-</button>
            <span class="zoom-display">{{ currentZoom }}%</span>
            <button class="header-btn icon-btn" 
                    (click)="onZoomIn()" 
                    [disabled]="currentZoom >= maxZoom"
                    [title]="'Zoom in (' + currentZoom + '%)'">🔍+</button>
            <button class="header-btn icon-btn" 
                    (click)="onZoomReset()" 
                    [disabled]="currentZoom === 100"
                    title="Reset zoom to 100%">🔍</button>
            <button class="header-btn icon-btn" 
                    (click)="onPanReset()" 
                    [disabled]="currentZoom <= 100"
                    title="Center view">🎯</button>
          </div>
          
          <span class="separator"></span>
          
          <!-- Primary Actions -->
          <button class="header-btn primary-btn" (click)="onAddData()" title="Add data source">
            📊
          </button>
          
          <button class="header-btn dropdown-btn" (click)="onAddChart()" title="Add chart to dashboard">
            📈
          </button>
          
          <button class="header-btn dropdown-btn" title="Add control element">
            🎛️
          </button>
          
          <!-- Grid Dimension Selector -->
          <div class="dimension-selector">
            <button class="header-btn dimension-btn" (click)="toggleDimensionSelector()" title="Change grid dimensions">
              <span class="grid-icon">⊞</span>
              <span class="dimension-label">{{ currentRows }}:{{ currentCols }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            
            <!-- Dimension Dropdown -->
            @if (showDimensionSelector) {
              <div class="dimension-dropdown" (click)="$event.stopPropagation()">
                <div class="dropdown-header">
                  <h4>Grid Dimensions (Rows:Columns)</h4>
                </div>
                <div class="dimension-options">
                  @for (option of dimensionOptions; track option.label) {
                    <button 
                      class="dimension-option"
                      [class.active]="currentRows === option.rows && currentCols === option.cols"
                      (click)="changeDimensions(option)"
                      title="Set grid to {{ option.rows }} rows × {{ option.cols }} columns">
                      {{ option.label }}
                    </button>
                  }
                </div>
              </div>
            }
          </div>
        </div>
        
        <!-- Right: Action Buttons -->
        <div class="header-right">
          <!-- Action Buttons -->
          <button class="header-btn icon-only reset-btn" 
                  (click)="onReset()" 
                  [disabled]="!canReset"
                  [title]="canReset ? 'Reset to original state' : 'No changes to reset'">
            ↺
          </button>
          
          <button class="header-btn icon-only save-btn" 
                  (click)="onSave()" 
                  [disabled]="!hasChanges"
                  [class.primary]="hasChanges"
                  [title]="hasChanges ? 'Save changes' : 'No changes to save'">
            💾
          </button>
          
          <button class="header-btn icon-only primary view-btn" (click)="onView()" title="View dashboard">
            👁️
          </button>
          
          <button class="header-btn icon-only" (click)="onThemePanel()" title="Theme and layout">
            🎨
          </button>
          
          <button class="header-btn icon-only" title="More options">
            ⋮
          </button>
          
          <div class="user-avatar">R</div>
        </div>
      </div>
    </header>
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
  
  // Grid dimension outputs
  @Output() dimensionChanged = new EventEmitter<{ rows: number, cols: number }>();

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
  
  // Grid dimension properties
  currentRows = 3;
  currentCols = 3;
  showDimensionSelector = false;
  
  // Available dimension options (rows:columns)
  dimensionOptions = [
    { label: '1:1', rows: 1, cols: 1 },
    { label: '1:2', rows: 1, cols: 2 },
    { label: '1:3', rows: 1, cols: 3 },
    { label: '2:1', rows: 2, cols: 1 },
    { label: '2:2', rows: 2, cols: 2 },
    { label: '2:3', rows: 2, cols: 3 },
    { label: '3:1', rows: 3, cols: 1 },
    { label: '3:2', rows: 3, cols: 2 },
    { label: '3:3', rows: 3, cols: 3 },
    { label: '4:1', rows: 4, cols: 1 },
    { label: '4:2', rows: 4, cols: 2 },
    { label: '4:3', rows: 4, cols: 3 },
    { label: '5:1', rows: 5, cols: 1 },
    { label: '5:2', rows: 5, cols: 2 },
    { label: '5:3', rows: 5, cols: 3 },
    { label: '6:1', rows: 6, cols: 1 },
    { label: '6:2', rows: 6, cols: 2 },
    { label: '6:3', rows: 6, cols: 3 }
  ];

  private subscriptions = new Subscription();

  constructor(private historyService: DashboardHistoryService, private gridDimensionService: GridDimensionService) {}

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
    
    // Subscribe to dimension changes to keep header display in sync
    this.subscriptions.add(
      this.gridDimensionService.dimension$.subscribe(dimension => {
        console.log('Header: Received dimension update:', dimension);
        this.currentRows = dimension.rows;
        this.currentCols = dimension.cols;
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
  
  // Grid dimension methods
  toggleDimensionSelector() {
    console.log('Header: toggleDimensionSelector called, current state:', this.showDimensionSelector);
    this.showDimensionSelector = !this.showDimensionSelector;
    console.log('Header: showDimensionSelector is now:', this.showDimensionSelector);
  }
  
  changeDimensions(option: { label: string, rows: number, cols: number }) {
    console.log('Header: Changing dimensions to', option);
    this.currentRows = option.rows;
    this.currentCols = option.cols;
    this.showDimensionSelector = false;
    
    // Use the service to communicate dimension change
    this.gridDimensionService.changeDimension({
      rows: option.rows,
      cols: option.cols,
      label: option.label
    });
    
    // Don't emit for backward compatibility since service handles it
    // this.dimensionChanged.emit({ rows: option.rows, cols: option.cols });
    
    console.log(`Header: Grid dimensions changed to ${option.label} (${option.rows}x${option.cols})`);
  }
  
  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.dimension-selector')) {
      this.showDimensionSelector = false;
    }
  }
}