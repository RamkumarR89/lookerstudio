import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule } from 'angular-gridster2';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { TableChartComponent } from '../charts/table-chart/table-chart.component';
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
  imports: [CommonModule, GridsterModule, PieChartComponent, BarChartComponent, LineChartComponent, TableChartComponent],
  templateUrl: './grid-dashboard.component.html',
  styleUrls: ['./grid-dashboard.component.scss']
})
export class GridDashboardComponent implements OnInit {
  options: GridsterConfig = {} as GridsterConfig;
  dashboard: Array<GridsterItem & { type?: string }> = [];
  showChartDropdown = false;

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
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 100,
      minRows: 1,
      maxRows: 100,
      maxItemCols: 100,
      minItemCols: 1,
      maxItemRows: 100,
      minItemRows: 1,
      maxItemArea: 2500,
      minItemArea: 1,
      defaultItemCols: 2,
      defaultItemRows: 2,
      fixedColWidth: 105,
      fixedRowHeight: 105,
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
    this.dashboard = [];
  }

  toggleChartDropdown() {
    this.showChartDropdown = !this.showChartDropdown;
  }

  addChart(type: 'pie' | 'table' | 'bar' | 'line') {
    // Ensure dashboard is initialized
    if (!this.dashboard) {
      this.dashboard = [];
    }
    
    // Find next available position
    const x = this.dashboard.length % 6;
    const y = Math.floor(this.dashboard.length / 6);
    
    const newItem = {
      cols: 2,
      rows: 2,
      x: x,
      y: y,
      type: type
    };
    
    this.dashboard.push(newItem);
    // Close dropdown after selection
    this.showChartDropdown = false;
  }
}
