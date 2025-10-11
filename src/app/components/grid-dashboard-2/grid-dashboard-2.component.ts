import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { WidgetComponent } from '../widget/widget.component';
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
export class GridDashboard2Component implements OnInit {
  options!: GridsterConfig;
  dashboard!: Array<GridsterItem & { type?: string }>;
  showChartModal = false;

  ngOnInit() {
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
      minCols: 3,
      maxCols: 3,
      minRows: 3,
      maxRows: 3,
      maxItemCols: 3,
      minItemCols: 1,
      maxItemRows: 2,
      minItemRows: 1,
      maxItemArea: 6,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 300,
      fixedRowHeight: 200,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: true,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: true,
      enableEmptyCellDrag: true,
      emptyCellDragMaxCols: 3,
      emptyCellDragMaxRows: 3,
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

    // Start with empty grid - charts will be added via "Add chart" button
    this.dashboard = [];
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
    } else {
      console.log('Grid is full - maximum 9 charts allowed');
      // Could show a notification here
    }
    
    // Close the modal
    this.closeAddChartModal();
  }

  // Find next available position in 3x3 grid
  private findNextAvailablePosition(): { x: number, y: number } | null {
    // Check all positions in 3x3 grid
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 3; x++) {
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
}