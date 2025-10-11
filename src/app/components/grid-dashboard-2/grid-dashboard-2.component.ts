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

    this.dashboard = [
      { cols: 1, rows: 1, y: 0, x: 0, type: 'scatter' },
      { cols: 1, rows: 1, y: 0, x: 1, type: 'pie' },
      { cols: 1, rows: 1, y: 1, x: 2, type: 'line' },
      { cols: 1, rows: 1, y: 2, x: 0, type: 'bar' }
    ];
  }
}