import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { ScatterChartComponent } from '../charts/scatter-chart/scatter-chart.component';
import { TableChartComponent } from '../charts/table-chart/table-chart.component';
import { ScorecardChartComponent } from '../charts/scorecard-chart/scorecard-chart.component';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface DashboardPreviewData {
  title: string;
  lastUpdated: string;
  chartCount: number;
  charts: Array<{
    id: string;
    type: 'pie' | 'bar' | 'line' | 'scatter' | 'table' | 'scorecard';
    title: string;
    x: number;
    y: number;
    cols: number;
    rows: number;
    data?: any;
  }>;
}

@Component({
  selector: 'app-dashboard-preview-modal',
  standalone: true,
  imports: [
    CommonModule, 
    GridsterModule,
    PieChartComponent,
    BarChartComponent,
    LineChartComponent,
    ScatterChartComponent,
    TableChartComponent,
    ScorecardChartComponent
  ],
  template: `
    <div class="preview-modal-overlay" [class.visible]="isVisible" (click)="onOverlayClick($event)">
      <div class="preview-modal" #previewModal>
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="header-left">
            <h2 class="modal-title">Dashboard Report</h2>
            <div class="report-info">
              <span class="chart-count">{{ dashboardData?.chartCount || 0 }} charts</span>
              <span class="separator">•</span>
              <span class="last-updated">Last updated: {{ getCurrentTimestamp() }}</span>
            </div>
          </div>
          <div class="header-right">
            <button class="maximize-btn" title="Maximize">
              <span class="icon">⛶</span>
            </button>
            <button class="close-btn" (click)="closeModal.emit()" title="Close">
              <span class="icon">✕</span>
            </button>
          </div>
        </div>

        <!-- Preview Content -->
        <div class="preview-content" #previewContent>
          <!-- Report Title Section -->
          <div class="report-header">
            <h1 class="report-title">Dashboard Report</h1>
            <p class="report-timestamp">Generated on {{ getCurrentTimestamp() }}</p>
          </div>

          <!-- Dashboard Grid -->
          <div class="dashboard-container">
            <div *ngIf="!dashboardData || dashboardData.charts.length === 0" class="empty-dashboard">
              <div class="empty-message">
                <h3>No charts to preview</h3>
                <p>Add some charts to your dashboard to see them in preview mode</p>
              </div>
            </div>
            

            
            <gridster *ngIf="dashboardData && dashboardData.charts.length > 0" 
                     [options]="gridsterOptions" 
                     class="preview-gridster">
              <gridster-item 
                *ngFor="let chart of dashboardData.charts" 
                [item]="chart"
                class="preview-grid-item">
                <div class="chart-container">
                  <div class="chart-content">
                    <app-scatter-chart *ngIf="chart.type === 'scatter'" 
                                     [data]="sampleScatterData" 
                                     [title]="chart.title"></app-scatter-chart>
                    <app-pie-chart *ngIf="chart.type === 'pie'" 
                                 [data]="samplePieData" 
                                 [title]="chart.title"></app-pie-chart>
                    <app-line-chart *ngIf="chart.type === 'line'" 
                                  [data]="sampleLineData" 
                                  [title]="chart.title"></app-line-chart>
                    <app-bar-chart *ngIf="chart.type === 'bar'" 
                                 [data]="sampleBarData" 
                                 [title]="chart.title"></app-bar-chart>
                    <app-table-chart *ngIf="chart.type === 'table'" 
                                   [data]="sampleTableData" 
                                   [title]="chart.title"></app-table-chart>
                    <app-scorecard-chart *ngIf="chart.type === 'scorecard'" 
                                       [data]="sampleScorecardData" 
                                       [title]="chart.title"></app-scorecard-chart>
                  </div>
                </div>
              </gridster-item>
            </gridster>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <div class="footer-left">
            <span class="export-message">Ready to export your dashboard</span>
          </div>
          <div class="footer-right">
            <button class="export-btn pdf-btn" (click)="exportAsPDF()">
              <span class="icon">📄</span>
              Export as PDF
            </button>
            <button class="export-btn png-btn" (click)="exportAsPNG()">
              <span class="icon">🖼️</span>
              Export as PNG
            </button>
            <button class="close-preview-btn" (click)="closeModal.emit()">
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './dashboard-preview-modal.component.scss'
})
export class DashboardPreviewModalComponent implements OnInit {
  @Input() isVisible = false;
  @Input() dashboardData: DashboardPreviewData | null = null;
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('previewContent', { static: false }) previewContent!: ElementRef;

  // Sample data for different chart types
  sampleTableData = [
    { label: 'Princess Cruise Line', value: 17 },
    { label: 'Holland America', value: 11 },
    { label: 'Carnival Cruise', value: 8 },
    { label: 'AIDA Cruises', value: 7 },
    { label: 'Costa Crociere', value: 7 },
    { label: 'P&O Cruises', value: 4 }
  ];

  samplePieData = [
    { label: 'Princess Cruise Line', value: 17 },
    { label: 'Holland America', value: 11 },
    { label: 'Carnival Cruise', value: 8 },
    { label: 'AIDA Cruises', value: 7 },
    { label: 'Costa Crociere', value: 7 },
    { label: 'P&O Cruises', value: 4 }
  ];

  sampleScatterData = [
    { x: 5000, y: 500 },
    { x: 10000, y: 800 },
    { x: 15000, y: 1200 },
    { x: 20000, y: 1500 },
    { x: 25000, y: 1800 },
    { x: 30000, y: 2000 }
  ];

  sampleLineData = [
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 19 },
    { label: 'Mar', value: 8 },
    { label: 'Apr', value: 15 },
    { label: 'May', value: 25 },
    { label: 'Jun', value: 18 }
  ];

  sampleBarData = [
    { label: 'Q1', value: 10 },
    { label: 'Q2', value: 15 },
    { label: 'Q3', value: 8 },
    { label: 'Q4', value: 20 }
  ];

  sampleScorecardData = [
    { label: 'Total Revenue', value: '1.2M', change: '+12.5%', trend: 'up' }
  ];

  gridsterOptions: GridsterConfig = {
    gridType: 'fixed',
    compactType: 'none',
    margin: 10,
    outerMargin: true,
    outerMarginTop: 10,
    outerMarginRight: 10,
    outerMarginBottom: 10,
    outerMarginLeft: 10,
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
    displayGrid: 'none',
    draggable: { enabled: false },
    resizable: { enabled: false },
    swap: false,
    pushItems: false,
    disablePushOnDrag: true,
    disablePushOnResize: true
  };



  ngOnInit() {
    if (this.dashboardData?.charts) {
      console.log('Charts positions:', this.dashboardData.charts.map(c => ({
        title: c.title,
        type: c.type,
        x: c.x,
        y: c.y,
        cols: c.cols,
        rows: c.rows
      })));
    }
  }

  getCurrentTimestamp(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }





  async exportAsPDF() {
    try {
      const element = this.previewContent.nativeElement;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('dashboard-report.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  }

  async exportAsPNG() {
    try {
      const element = this.previewContent.nativeElement;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const link = document.createElement('a');
      link.download = 'dashboard-report.png';
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error exporting PNG:', error);
    }
  }
}