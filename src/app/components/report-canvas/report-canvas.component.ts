import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableChartComponent, ChartData, ChartPosition } from '../draggable-chart/draggable-chart.component';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-report-canvas',
  standalone: true,
  imports: [CommonModule, DraggableChartComponent, CdkDropList],
  template: `
    <div class="canvas-container">
      
      <!-- Canvas Controls - Add Filter -->
      <div class="canvas-top-controls">
        <button class="add-filter-btn">
          ⚡ Add filter
        </button>
      </div>
      
      <!-- Main Canvas -->
      <div class="canvas-area" cdkDropList (cdkDropListDropped)="onDrop($event)">
        
        <!-- Layout Toggle Buttons -->
        <div class="layout-controls">
          <button class="layout-toggle active">
            ✓ Freeform layout
          </button>
          <button class="layout-toggle">
            Responsive layout
          </button>
        </div>
        
        <!-- Floating Toolbar (when charts exist) -->
        @if (charts.length > 0) {
          <div class="floating-toolbar">
            <button class="toolbar-btn pie" (click)="onAddChart('pie')" title="Add Pie Chart">
              🥧
            </button>
            <button class="toolbar-btn bar" (click)="onAddChart('bar')" title="Add Bar Chart">
              📊
            </button>
            <button class="toolbar-btn table" (click)="onAddChart('table')" title="Add Table">
              📋
            </button>
            <button class="toolbar-btn line" (click)="onAddChart('line')" title="Add Line Chart">
              📈
            </button>
            <div class="toolbar-divider"></div>
            <button class="toolbar-btn clear" (click)="clearAllCharts()" title="Clear All Charts">
              🗑️
            </button>
          </div>
        }
        
        <!-- Empty State (when no charts) -->
        @if (charts.length === 0) {
          <div class="empty-state">
          <div class="illustration-container">
            <!-- Chart Illustration -->
            <div class="chart-illustration">
              <div class="chart-bars">
                <div class="bar orange" style="height: 20px;"></div>
                <div class="bar yellow" style="height: 35px;"></div>
                <div class="bar red" style="height: 45px;"></div>
                <div class="bar blue" style="height: 30px;"></div>
                <div class="bar green" style="height: 50px;"></div>
                <div class="bar purple" style="height: 25px;"></div>
              </div>
              <div class="chart-elements">
                <div class="dot orange"></div>
                <div class="circle-lg"></div>
                <div class="circle-md"></div>
                <div class="circle-sm"></div>
                <div class="dot red"></div>
                <div class="dot blue"></div>
              </div>
            </div>
          </div>
          
          <h2 class="empty-title">Let's get started</h2>
          <p class="empty-description">
            Drag a field from the Data Panel to the canvas to add a new chart or 
            select a component on the report canvas to edit it.
          </p>
          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="action-btn primary" (click)="onAddChart('pie')">
              🥧 Pie Chart
            </button>
            <button class="action-btn secondary" (click)="onAddChart('bar')">
              📊 Bar Chart
            </button>
            <button class="action-btn secondary" (click)="onAddChart('table')">
              📋 Table
            </button>
            <button class="action-btn secondary" (click)="onAddChart('line')">
              📈 Line Chart
            </button>
          </div>
          </div>
        }
        
        <!-- Chart Components -->
        @for (chart of charts; track chart.id) {
          <app-draggable-chart
            [chartData]="chart"
            (menuClicked)="onChartMenuClicked(chart.id)">
          </app-draggable-chart>
        }
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
    
    // Count existing charts of this type for unique naming
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
        data = this.sampleBarData; // Using bar data for line chart demo
        title = typeNumber === 1 ? 'Trend Analysis' : `Line Chart ${typeNumber}`;
        break;
      default:
        data = this.samplePieData;
        title = 'New Chart';
    }
    
    // Smart positioning: arrange in grid layout
    const chartWidth = type === 'pie' ? 400 : type === 'table' ? 350 : 380;
    const chartHeight = type === 'table' ? 300 : type === 'pie' ? 280 : 250;
    
    // Calculate grid position (2 columns max)
    const col = this.charts.length % 2;
    const row = Math.floor(this.charts.length / 2);
    
    const newChart: ChartData = {
      id: chartId,
      type: type,
      title: title,
      data: data,
      position: {
        x: 20 + (col * (chartWidth + 20)),
        y: 60 + (row * (chartHeight + 20)),
        width: chartWidth,
        height: chartHeight
      }
    };
    
    console.log('Created new chart:', newChart);
    
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
    if (chart) {
      chart.position = position;
    }
  }

  onChartMenuClicked(chartId: string) {
    console.log('Chart menu clicked for:', chartId);
    // Handle chart menu actions (delete, duplicate, etc.)
  }

  onDrop(event: CdkDragDrop<any>) {
    // Handle field drop from data panel
    console.log('Field dropped:', event);
    
    // Only create chart if explicitly requested
    // this.onAddChart('pie');
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
      const newChart: ChartData = {
        ...originalChart,
        id: `chart-${this.chartIdCounter++}`,
        position: {
          ...originalChart.position,
          x: originalChart.position.x + 20,
          y: originalChart.position.y + 20
        }
      };
      this.charts.push(newChart);
    }
  }
}