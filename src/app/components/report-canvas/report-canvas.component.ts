import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableChartComponent } from '../../components/draggable-chart/draggable-chart.component';
import { ChartData, ChartPosition } from '../../draggable-chart/chart-data.model';
import { GridsterModule, GridsterConfig, GridsterItem, GridType, CompactType, DisplayGrid } from 'angular-gridster2';

@Component({
  selector: 'app-report-canvas',
  standalone: true,
  imports: [CommonModule, DraggableChartComponent, GridsterModule],
  template: `
    <div class="canvas-container">
      <div class="canvas-top-controls">
        <button class="add-filter-btn">⚡ Add filter</button>
      </div>
      <div class="canvas-area">
        <div class="layout-controls">
          <button class="layout-toggle active">✓ Grid layout</button>
        </div>
        <div *ngIf="charts.length > 0" class="floating-toolbar">
          <button class="toolbar-btn pie" (click)="onAddChart('pie')" title="Add Pie Chart">🥧</button>
          <button class="toolbar-btn bar" (click)="onAddChart('bar')" title="Add Bar Chart">📊</button>
          <button class="toolbar-btn table" (click)="onAddChart('table')" title="Add Table">📋</button>
          <button class="toolbar-btn line" (click)="onAddChart('line')" title="Add Line Chart">📈</button>
          <div class="toolbar-divider"></div>
          <button class="toolbar-btn clear" (click)="clearAllCharts()" title="Clear All Charts">🗑️</button>
        </div>
        <div *ngIf="charts.length === 0" class="empty-state">
          <!-- ...existing code for empty state... -->
        </div>
        <gridster [options]="gridsterOptions">
          <gridster-item *ngFor="let chart of charts" [item]="chart.gridsterItem">
            <app-draggable-chart
              [chartData]="chart"
              (menuClicked)="onChartMenuClicked(chart.id)">
            </app-draggable-chart>
          </gridster-item>
        </gridster>
      </div>
    </div>
  `,
  styleUrl: './report-canvas.component.scss'
})
export class ReportCanvasComponent {
  @Output() componentSelected = new EventEmitter<string>();
  @Output() chartAdded = new EventEmitter<void>();
  
  charts: ChartData[] = [];
  selectedChartId: string | null = null;
  private chartIdCounter = 1;
  gridsterOptions: GridsterConfig = {
    gridType: GridType.Fit,
    compactType: CompactType.None,
    margin: 10,
    outerMargin: true,
    draggable: { enabled: true },
    resizable: { enabled: true },
    displayGrid: DisplayGrid.Always,
    minCols: 6,
    maxCols: 12,
    minRows: 6,
    maxRows: 12,
    defaultItemCols: 2,
    defaultItemRows: 2
  };
  samplePieData = [
    { label: 'Princess Cruise Line', value: 17, percentage: 31.5 },
    { label: 'Holland America Line', value: 11, percentage: 20.4 },
    { label: 'Carnival Cruise Line', value: 8, percentage: 14.8 },
    { label: 'AIDA Cruises', value: 7, percentage: 13 },
    { label: 'Costa Crociere S.p.A', value: 7, percentage: 13 },
    { label: 'P&O Cruises', value: 4, percentage: 7.4 }
  ];
  sampleBarData = [
    { label: 'Princess', value: 17 },
    { label: 'Holland', value: 11 },
    { label: 'Carnival', value: 8 },
    { label: 'AIDA', value: 7 },
    { label: 'Costa', value: 7 },
    { label: 'P&O', value: 4 }
  ];
  sampleTableData = [
    ['Princess Cruise Line', '17'],
    ['Holland America Line', '11'],
    ['Carnival Cruise Line', '8'],
    ['AIDA Cruises', '7'],
    ['Costa Crociere S.p.A', '7'],
    ['P&O Cruises', '4']
  ];

  clearAllCharts() {
    this.charts = [];
    this.selectedChartId = null;
    this.chartIdCounter = 1;
  }

  onAddChart(type: 'pie' | 'bar' | 'line' | 'table' = 'pie') {
    const chartId = `chart-${this.chartIdCounter++}`;
    let data;
    let title;
    const existingOfType = this.charts.filter(c => c.type === type).length;
    const typeNumber = existingOfType + 1;
    switch (type) {
      case 'pie':
        data = this.samplePieData;
        title = typeNumber === 1 ? 'OPCO by Record Count' : `Pie Chart ${typeNumber}`;
        break;
      case 'bar':
        data = this.sampleBarData;
        title = typeNumber === 1 ? 'Record Count by OPCO' : `Bar Chart ${typeNumber}`;
        break;
      case 'table':
        data = this.sampleTableData;
        title = typeNumber === 1 ? 'Data Table' : `Table ${typeNumber}`;
        break;
      case 'line':
        data = this.sampleBarData;
        title = typeNumber === 1 ? 'Trend Analysis' : `Line Chart ${typeNumber}`;
        break;
      default:
        data = this.samplePieData;
        title = 'New Chart';
    }
    // Gridster item config
    const gridsterItem: GridsterItem = {
      cols: 2,
      rows: 2,
      x: (this.charts.length % 6),
      y: Math.floor(this.charts.length / 6)
    };
    const newChart: ChartData = {
      id: chartId,
      type: type,
      title: title,
      data: data,
      gridsterItem
    };
    this.charts.push(newChart);
    this.selectedChartId = chartId;
    this.componentSelected.emit(chartId);
    this.chartAdded.emit();
  }

  onSelectChart(chartId: string) {
    this.selectedChartId = chartId;
    this.componentSelected.emit(chartId);
  }

  onChartPositionChanged(chartId: string, position: ChartPosition) {
    const chart = this.charts.find(c => c.id === chartId);
    if (chart && chart.gridsterItem) {
      chart.gridsterItem.x = position.x;
      chart.gridsterItem.y = position.y;
      // Optionally update cols/rows if position includes width/height
    }
  }

  onChartMenuClicked(chartId: string) {
    console.log('Chart menu clicked for:', chartId);
    // Handle chart menu actions (delete, duplicate, etc.)
  }


  deleteChart(chartId: string) {
    this.charts = this.charts.filter(c => c.id !== chartId);
    if (this.selectedChartId === chartId) {
      this.selectedChartId = null;
    }
  }

  duplicateChart(chartId: string) {
    const originalChart = this.charts.find(c => c.id === chartId);
    if (originalChart) {
      const newGridsterItem: GridsterItem = {
        ...originalChart.gridsterItem,
        x: (originalChart.gridsterItem.x ?? 0) + 1,
        y: (originalChart.gridsterItem.y ?? 0) + 1
      };
      const newChart: ChartData = {
        ...originalChart,
        id: `chart-${this.chartIdCounter++}`,
        gridsterItem: newGridsterItem
      };
      this.charts.push(newChart);
    }
  }
}