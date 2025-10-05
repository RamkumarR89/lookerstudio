import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-grid-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, GridsterModule, PieChartComponent, BarChartComponent, LineChartComponent, TableChartComponent, ScatterChartComponent],
  templateUrl: './grid-dashboard.component.html',
  styleUrls: ['./grid-dashboard.component.scss']
})
export class GridDashboardComponent implements OnInit {
  options: GridsterConfig = {} as GridsterConfig;
  dashboard: Array<GridsterItem & { type?: string }> = [];
  showChartDropdown = false;
  selectedChartIndex: number = -1;

  ngOnInit() {
    this.options = {
      gridType: GridType.ScrollVertical,
      compactType: CompactType.None,
      margin: 16,
      outerMargin: true,
      outerMarginTop: 20,
      outerMarginRight: 20,
      outerMarginBottom: 20,
      outerMarginLeft: 20,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 12,
      minRows: 1,
      maxRows: 50,
      maxItemCols: 12,
      minItemCols: 2,
      maxItemRows: 8,
      minItemRows: 2,
      maxItemArea: 2500,
      minItemArea: 4,
      defaultItemCols: 6,
      defaultItemRows: 4,
      fixedColWidth: undefined,
      fixedRowHeight: undefined,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
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
      scrollToNewItems: false
    };
    
    // Initialize with Looker Studio layout
    this.dashboard = [
      {
        cols: 6,
        rows: 5,
        x: 0,
        y: 0,
        type: 'pie'
      },
      {
        cols: 6,
        rows: 5,
        x: 6,
        y: 0,
        type: 'table'
      },
      {
        cols: 6,
        rows: 4,
        x: 0,
        y: 5,
        type: 'bar'
      },
      {
        cols: 6,
        rows: 4,
        x: 6,
        y: 5,
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
    
    // Calculate next position in a 2-column grid
    const currentRow = Math.floor(this.dashboard.length / 2);
    const currentCol = this.dashboard.length % 2;
    
    const x = currentCol * 6;
    const y = currentRow * 5; // Better row spacing
    
    // Determine appropriate size based on chart type
    let cols = 6;
    let rows = type === 'table' ? 4 : 5;
    
    const newItem = {
      cols: cols,
      rows: rows,
      x: x,
      y: y,
      type: type
    };
    
    this.dashboard.push(newItem);
    // Close dropdown after selection
    this.showChartDropdown = false;
  }

  selectChart(index: number) {
    this.selectedChartIndex = this.selectedChartIndex === index ? -1 : index;
  }

}
