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
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 8, // Reduced margin for 100% zoom
      outerMargin: true,
      outerMarginTop: 10, // Reduced margins
      outerMarginRight: 10,
      outerMarginBottom: 10,
      outerMarginLeft: 10,
      mobileBreakpoint: 768,
      minCols: 1,
      maxCols: 16, // Increased for more flexibility
      minRows: 1,
      maxRows: 50,
      maxItemCols: 16,
      minItemCols: 1,
      maxItemRows: 10,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 4, // Better default width
      defaultItemRows: 4, // Much taller default height
      fixedColWidth: 120, // Wider columns for better content
      fixedRowHeight: 120, // Much taller rows for proper chart display
      keepFixedHeightInMobile: true,
      keepFixedWidthInMobile: true,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      draggable: {
        enabled: true,
        ignoreContentClass: 'gridster-item-content',
        ignoreContent: false,
        dragHandleClass: 'drag-handler',
        stop: undefined,
        start: undefined
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
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      pushDirections: { north: true, east: true, south: true, west: true },
      pushResizeItems: false,
      displayGrid: DisplayGrid.OnDragAndResize,
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
      itemChangeCallback: (item: GridsterItem) => {
        // Handle item position changes
        this.handleGridItemChange(item);
      },
      itemResizeCallback: (item: GridsterItem) => {
        // Handle item resize and trigger chart resize
        this.handleGridItemResize(item);
      },
      itemInitCallback: (item: GridsterItem) => {
        // Handle item initialization
        this.handleGridItemInit(item);
      }
    };
    
    // Initialize with Looker Studio layout
    this.dashboard = [
      {
        cols: 4,
        rows: 4,
        x: 0,
        y: 0,
        type: 'pie'
      },
      {
        cols: 4,
        rows: 4,
        x: 4,
        y: 0,
        type: 'table'
      },
      {
        cols: 4,
        rows: 3,
        x: 8,
        y: 0,
        type: 'bar'
      },
      {
        cols: 6,
        rows: 3,
        x: 0,
        y: 4,
        type: 'scatter'
      }
    ];
  }

  toggleChartDropdown() {
    this.showChartDropdown = !this.showChartDropdown;
  }

  addChart(type: 'pie' | 'table' | 'bar' | 'line' | 'scatter') {
    // Ensure dashboard is initialized
    if (!this.dashboard) {
      this.dashboard = [];
    }
    
    // Calculate next position in a 3-column grid for better fixed sizing
    const currentRow = Math.floor(this.dashboard.length / 3);
    const currentCol = this.dashboard.length % 3;
    
    const x = currentCol * 4;
    const y = currentRow * 4; // Better row spacing with fixed heights
    
    // Determine appropriate size based on chart type
    let cols = 4;
    let rows = type === 'table' ? 3 : 4;
    
    const newItem = {
      cols: cols,
      rows: rows,
      x: x,
      y: y,
      type: type
    };
    
    this.dashboard.push(newItem);
    
    // Trigger chart resize after new chart is added
    setTimeout(() => {
      this.resizeAllCharts();
    }, 100);
    
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
    // Trigger initial chart resize after view is initialized
    setTimeout(() => {
      this.resizeAllCharts();
    }, 100);
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

}
