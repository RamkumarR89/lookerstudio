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
                  <div class="chart-header">
                    <h3 class="chart-title">{{ chart.title }}</h3>
                  </div>
                  <div class="chart-content">
                    <app-scatter-chart *ngIf="chart.type === 'scatter'" [data]="[]"></app-scatter-chart>
                    <app-pie-chart *ngIf="chart.type === 'pie'" [data]="[]"></app-pie-chart>
                    <app-line-chart *ngIf="chart.type === 'line'" [data]="[]"></app-line-chart>
                    <app-bar-chart *ngIf="chart.type === 'bar'" [data]="[]"></app-bar-chart>
                    <app-table-chart *ngIf="chart.type === 'table'" [data]="sampleTableData" [title]="chart.title"></app-table-chart>
                    <app-scorecard-chart *ngIf="chart.type === 'scorecard'" [data]="[]"></app-scorecard-chart>
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

  sampleTableData = [
    { label: 'Princess Cruise Line', value: 17 },
    { label: 'Holland America', value: 11 },
    { label: 'Carnival Cruise', value: 8 },
    { label: 'AIDA Cruises', value: 7 },
    { label: 'Costa Crociere', value: 7 },
    { label: 'P&O Cruises', value: 4 }
  ];

  gridsterOptions: GridsterConfig = {
    gridType: 'fit',
    displayGrid: 'none',
    pushItems: false,
    draggable: { enabled: false },
    resizable: { enabled: false },
    margin: 10,
    minCols: 12,
    maxCols: 12,
    minRows: 8,
    maxRows: 100,
    defaultItemCols: 3,
    defaultItemRows: 3
  };



  ngOnInit() {
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