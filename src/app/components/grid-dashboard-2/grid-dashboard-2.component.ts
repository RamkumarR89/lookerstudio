import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule, GridsterComponent } from 'angular-gridster2';
import { WidgetComponent } from '../widget/widget.component';
import { GridDimensionService } from '../../core/services/grid-dimension.service';
import { Subscription } from 'rxjs';
import {
  CompactType,
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType
} from 'angular-gridster2';

@Component({
  selector: 'app-grid-dashboard-2',
  standalone: true,
  imports: [CommonModule, GridsterModule, WidgetComponent],
  templateUrl: './grid-dashboard-2.component.html',
  styleUrls: ['./grid-dashboard-2.component.scss']
})
export class GridDashboard2Component implements OnInit, OnDestroy {
  @ViewChild(GridsterComponent) gridster!: GridsterComponent;
  @Output() dashboardChanged = new EventEmitter<{dashboard: Array<GridsterItem & { type?: string }>, description: string}>();
  
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem & { type?: string }>;
  showChartModal = false;
  
  // Grid dimension configurations
  currentRows = 3;
  currentCols = 3;
  
  private subscriptions = new Subscription();

  constructor(private gridDimensionService: GridDimensionService) {}

  ngOnInit() {
    this.initializeGridOptions();
    // Start with empty grid - charts will be added via "Add chart" button
    this.dashboard = [];
    
    // Set initial dimension in service
    this.gridDimensionService.changeDimension({
      rows: this.currentRows,
      cols: this.currentCols,
      label: `${this.currentRows}:${this.currentCols}`
    });
    
    // Subscribe to dimension changes
    this.subscriptions.add(
      this.gridDimensionService.dimension$.subscribe(dimension => {
        console.log('GridDashboard2: Received dimension change:', dimension);
        // Only apply if different from current
        if (dimension.rows !== this.currentRows || dimension.cols !== this.currentCols) {
          this.changeDimensions(dimension);
        }
      })
    );
  }
  
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  
  private initializeGridOptions() {
    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 200,
      minCols: this.currentCols,
      maxCols: this.currentCols,
      minRows: this.currentRows,
      maxRows: this.currentRows,
      maxItemCols: this.currentCols,
      minItemCols: 1,
      maxItemRows: this.currentRows,
      minItemRows: 1,
      maxItemArea: this.currentRows * this.currentCols,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 250,
      fixedRowHeight: 180,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: true,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: true,
      emptyCellDragMaxCols: this.currentCols,
      emptyCellDragMaxRows: this.currentRows,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true,
        ignoreContent: false,
        ignoreContentClass: 'no-drag',
        dragHandleClass: 'drag-handle',
        dropOverItems: false,
        delayStart: 0
      },
      resizable: {
        enabled: true,
        handles: {
          s: true,
          e: true,
          n: true,
          w: true,
          se: true,
          ne: true,
          sw: true,
          nw: true
        }
      },
      swap: true,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: true,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
    
    console.log('GridDashboard2: Initialized options with dimensions:', this.currentRows, 'x', this.currentCols);
  }

  // Change grid dimensions (now works with service)
  public changeDimensions(option: { label: string, rows: number, cols: number }) {
    console.log('GridDashboard2: Changing dimensions to:', option);
    this.currentRows = option.rows;
    this.currentCols = option.cols;
    
    // Re-initialize grid options with new dimensions
    this.initializeGridOptions();
    
    // Remove items that are outside the new grid bounds
    this.dashboard = this.dashboard.filter(item => 
      item.x < this.currentCols && item.y < this.currentRows
    );
    
    // Force grid to refresh with new options
    setTimeout(() => {
      this.options = { ...this.options };
      console.log('GridDashboard2: Options updated to:', this.options);
      
      // If gridster component is available, force a refresh
      if (this.gridster && this.gridster.optionsChanged) {
        console.log('GridDashboard2: Forcing gridster options changed');
        this.gridster.optionsChanged();
      }
    }, 10);
    
    // Emit dashboard change for history tracking
    this.dashboardChanged.emit({
      dashboard: [...this.dashboard],
      description: `Changed grid dimensions to ${option.label}`
    });
    
    console.log(`GridDashboard2: Grid dimensions changed to ${option.label} (${option.rows}x${option.cols})`);
  }

  // Open chart selection modal (public method for header button)
  public openAddChartModal() {
    this.showChartModal = true;
  }

  // Close chart selection modal
  closeAddChartModal() {
    this.showChartModal = false;
  }

  // Add a new chart to the grid
  addChartToGrid(chartType: 'table' | 'scatter' | 'pie' | 'line' | 'bar' | 'scorecard') {
    // Find the next available position in the 3x3 grid
    const nextPosition = this.findNextAvailablePosition();
    
    if (nextPosition) {
      const newChart = {
        cols: 1,
        rows: 1,
        x: nextPosition.x,
        y: nextPosition.y,
        type: chartType
      };
      
      this.dashboard.push(newChart);
      console.log('Added chart:', newChart);
      
      // Emit dashboard change for history tracking
      this.dashboardChanged.emit({
        dashboard: [...this.dashboard],
        description: `Added ${chartType} chart`
      });
    } else {
      console.log(`Grid is full - maximum ${this.currentRows * this.currentCols} charts allowed in ${this.currentRows}×${this.currentCols} grid`);
      // Could show a notification here
    }
    
    // Close the modal
    this.closeAddChartModal();
  }

  // Find next available position in current grid dimensions
  private findNextAvailablePosition(): { x: number, y: number } | null {
    // Check all positions in current grid
    for (let y = 0; y < this.currentRows; y++) {
      for (let x = 0; x < this.currentCols; x++) {
        // Check if this position is occupied
        const isOccupied = this.dashboard.some(item => 
          item.x === x && item.y === y
        );
        
        if (!isOccupied) {
          return { x, y };
        }
      }
    }
    
    return null; // Grid is full
  }
  
  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.chart-modal')) {
      this.showChartModal = false;
    }
  }
}