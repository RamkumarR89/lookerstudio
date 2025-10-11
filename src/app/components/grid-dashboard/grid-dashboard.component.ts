import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GridsterModule } from 'angular-gridster2';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { TableChartComponent } from '../charts/table-chart/table-chart.component';
import { ScatterChartComponent } from '../charts/scatter-chart/scatter-chart.component';
import {
  GridsterConfig,
  GridsterItem,
  GridType,
  CompactType,
  DisplayGrid
} from 'angular-gridster2';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-grid-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, GridsterModule, PieChartComponent, BarChartComponent, LineChartComponent, TableChartComponent, ScatterChartComponent],
  templateUrl: './grid-dashboard.component.html',
  styleUrls: ['./grid-dashboard.component.scss']
})
export class GridDashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('gridsterContainer', { static: false }) gridsterContainer!: ElementRef;
  
  options: GridsterConfig = {} as GridsterConfig;
  dashboard: Array<GridsterItem & { type?: string }> = [];
  showChartDropdown = false;
  selectedChartIndex: number = -1;
  private resizeTimeout: any;

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
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 500,
      minItemArea: 1,
      defaultItemCols: 1,
      defaultItemRows: 1,
      fixedColWidth: 300,
      fixedRowHeight: 200,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: true
      },
      resizable: {
        enabled: true
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.Always,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false
    };
    
    // 2x2 Grid Layout using working pattern
    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0, type: 'scatter' },
      { cols: 2, rows: 1, y: 0, x: 2, type: 'pie' },
      { cols: 2, rows: 1, y: 1, x: 0, type: 'line' },
      { cols: 2, rows: 1, y: 1, x: 2, type: 'bar' }
    ];
    
    console.log('Dashboard initialized with 2x2 grid (4 charts):', this.dashboard);
    console.log('Grid options:', this.options);
  }

  toggleChartDropdown() {
    this.showChartDropdown = !this.showChartDropdown;
  }

  addChart(type: 'pie' | 'table' | 'bar' | 'line' | 'scatter') {
    // Ensure dashboard is initialized
    if (!this.dashboard) {
      this.dashboard = [];
    }
    
    // Calculate next position using 2x2 layout (2 per row, max 2 rows = 4 charts total)
    const maxCharts = 4; // Maximum 2 charts per row × 2 rows = 4 charts
    
    if (this.dashboard.length >= maxCharts) {
      // Don't add more charts if we've reached the maximum
      this.showChartDropdown = false;
      return;
    }
    
    const currentRow = Math.floor(this.dashboard.length / 2);
    const currentCol = this.dashboard.length % 2;
    
    const x = currentCol * 2; // Column position (0 or 2)
    const y = currentRow; // Row position (0 or 1)
    
    // Determine appropriate size for 2x2 layout
    let cols = 2; // Two grid cells width
    let rows = 1; // One grid cell height
    
    const newItem = {
      cols: cols,
      rows: rows,
      x: x,
      y: y,
      type: type
    };
    
    this.dashboard.push(newItem);
    
    // Automatically arrange in side-by-side layout after adding
    setTimeout(() => {
      this.autoArrangeSideBySide();
    }, 50);
    
    // Close dropdown after selection
    this.showChartDropdown = false;
  }

  selectChart(index: number) {
    this.selectedChartIndex = this.selectedChartIndex === index ? -1 : index;
  }



  // Method to update grid dimensions programmatically
  updateGridDimensions(colWidth: number, rowHeight: number) {
    this.options.fixedColWidth = colWidth;
    this.options.fixedRowHeight = rowHeight;
    
    // Trigger gridster update
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }

  // Method to get current grid dimensions
  getGridDimensions() {
    return {
      colWidth: this.options.fixedColWidth,
      rowHeight: this.options.fixedRowHeight
    };
  }

  ngAfterViewInit() {
    // Force gridster to recognize all items
    setTimeout(() => {
      if (this.options.api) {
        this.options.api.optionsChanged!();
      }
      this.resizeAllCharts();
      console.log('AfterViewInit - Dashboard items:', this.dashboard.length);
    }, 200);
  }

  ngOnDestroy() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
  }

  // Handle grid item changes
  private handleGridItemChange(item: GridsterItem) {
    console.log('Item changed:', item);
    this.scheduleChartResize();
  }

  // Handle grid item resize
  private handleGridItemResize(item: GridsterItem) {
    console.log('Item resized:', item);
    this.scheduleChartResize();
  }

  // Handle grid item initialization
  private handleGridItemInit(item: GridsterItem) {
    console.log('Item initialized:', item);
    // Delay to ensure DOM is ready
    setTimeout(() => {
      this.resizeChartsInItem(item);
    }, 50);
  }

  // Schedule chart resize with debouncing
  private scheduleChartResize() {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(() => {
      this.resizeAllCharts();
    }, 150);
  }

  // Resize all charts
  private resizeAllCharts() {
    // Get all chart instances and resize them
    const chartElements = document.querySelectorAll('canvas');
    chartElements.forEach((canvas: HTMLCanvasElement) => {
      const chart = Chart.getChart(canvas);
      if (chart) {
        chart.resize();
      }
    });
  }

  // Resize charts in specific grid item
  private resizeChartsInItem(item: GridsterItem) {
    // Find all chart instances and resize them
    const chartElements = document.querySelectorAll('.widget-content canvas');
    chartElements.forEach((canvas: any) => {
      const chart = Chart.getChart(canvas);
      if (chart) {
        chart.resize();
      }
    });
  }

  // Public method to force chart resize (can be called from outside)
  public forceChartResize() {
    this.resizeAllCharts();
  }

  // Method to refresh specific chart by index
  public refreshChart(index: number) {
    setTimeout(() => {
      const chartElements = document.querySelectorAll(`.grid-item-${index} canvas`);
      chartElements.forEach((element: Element) => {
        const canvas = element as HTMLCanvasElement;
        const chart = Chart.getChart(canvas);
        if (chart) {
          chart.resize();
          chart.update('none'); // Update without animation for better performance
        }
      });
    }, 50);
  }

  // Automatically arrange charts in 2x2 layout
  private autoArrangeSideBySide() {
    this.dashboard.forEach((item, index) => {
      const row = Math.floor(index / 2); // 2 charts per row
      const col = index % 2; // Column position (0 or 1)
      
      item.x = col * 2; // Column position (0 or 2)
      item.y = row; // Row position (0 or 1)
      item.cols = 2; // 2 grid cells width
      item.rows = 1; // 1 grid cell height
    });
    
    // Trigger gridster update
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
    
    // Resize charts after layout change
    setTimeout(() => {
      this.resizeAllCharts();
    }, 100);
  }

}
