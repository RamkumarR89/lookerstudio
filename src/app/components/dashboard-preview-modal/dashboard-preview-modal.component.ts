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
      <!-- Floating Action Bar -->
      <div class="floating-action-bar">
        <button class="action-btn pdf-btn" (click)="exportAsPDF()">
          <span class="icon">📄</span>
          Export PDF
        </button>
        <button class="action-btn png-btn" (click)="exportAsPNG()">
          <span class="icon">🖼️</span>
          Export PNG
        </button>
        <button class="action-btn close-btn" (click)="closeModal.emit()">
          <span class="icon">✕</span>
          Close
        </button>
      </div>

      <!-- Print-style Document -->
      <div class="preview-modal" #previewModal>
        <div class="print-page" #previewContent>
          <!-- Enhanced Report Header -->
          <div class="report-header">
            <div class="header-top">
              <div class="company-info">
                <h1 class="company-name">Your Company Name</h1>
                <p class="company-tagline">Business Intelligence Team</p>
              </div>
              <div class="report-metadata">
                <p class="report-id">Report ID: RPT-{{ getCurrentDate().replace('/', '') }}-001</p>
                <p class="generation-time">Generated: {{ getCurrentTime() }}</p>
              </div>
            </div>
            <div class="header-center">
              <h2 class="report-title">Dashboard Analytics Report</h2>
              <p class="report-description">Comprehensive data analysis and visualization dashboard containing key business metrics and insights.</p>
            </div>
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

          <!-- Simple Report Footer -->
          <div class="report-footer">
            <div class="footer-bottom">
              <p class="copyright">© 2025 Your Company Name. All rights reserved.</p>
              <p class="disclaimer">This report contains confidential and proprietary information. Unauthorized distribution is prohibited.</p>
            </div>
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

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  getDataSourceCount(): number {
    // For now return a default value, later this can be dynamic
    return 3; // Sample: CSV, Database, API
  }

  onOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.closeModal.emit();
    }
  }





  async exportAsPDF() {
    try {
      // Ensure the element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const element = this.previewContent.nativeElement;
      const overlay = element.closest('.preview-modal-overlay') as HTMLElement;
      
      // Add export class for styling
      if (overlay) overlay.classList.add('exporting');
      
      // Temporarily hide floating action bar for export
      const actionBar = document.querySelector('.floating-action-bar') as HTMLElement;
      if (actionBar) actionBar.style.display = 'none';
      
      // Ensure charts are fully loaded by checking for chart elements
      const chartElements = element.querySelectorAll('.chart-content > *');
      console.log(`Found ${chartElements.length} chart elements`);
      
      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple scroll to ensure content is loaded
      element.scrollTop = 0;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 30000,
        ignoreElements: (element) => {
          // Don't ignore any elements that might contain charts
          return false;
        },
        onclone: (clonedDoc, clonedElement) => {
          // Ensure all Angular components are visible in the clone
          const clonedPrintPage = clonedDoc.querySelector('.print-page') as HTMLElement;
          if (clonedPrintPage) {
            clonedPrintPage.style.height = 'auto';
            clonedPrintPage.style.minHeight = 'auto';
            
            // Make sure gridster and charts are visible
            const clonedGridster = clonedDoc.querySelector('.preview-gridster') as HTMLElement;
            if (clonedGridster) {
              clonedGridster.style.height = 'auto';
              clonedGridster.style.minHeight = 'auto';
              clonedGridster.style.overflow = 'visible';
              clonedGridster.style.display = 'block';
            }
            
            // Ensure all chart containers are visible
            const clonedCharts = clonedDoc.querySelectorAll('.chart-content');
            clonedCharts.forEach((chart: any) => {
              chart.style.display = 'block';
              chart.style.visibility = 'visible';
              chart.style.opacity = '1';
            });
          }
        }
      });
      
      // Restore action bar and remove export class
      if (actionBar) actionBar.style.display = 'flex';
      if (overlay) overlay.classList.remove('exporting');
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty - unable to capture content');
      }
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add content to PDF
      if (imgHeight > pdfHeight) {
        const pageCount = Math.ceil(imgHeight / pdfHeight);
        
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) pdf.addPage();
          
          const yOffset = -(pdfHeight * i);
          pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      }
      
      pdf.save(`dashboard-report-${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Error exporting PDF. Please try again.');
    }
  }

  async exportAsPNG() {
    try {
      // Ensure the element is fully rendered
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const element = this.previewContent.nativeElement;
      const overlay = element.closest('.preview-modal-overlay') as HTMLElement;
      
      // Add export class for styling
      if (overlay) overlay.classList.add('exporting');
      
      // Temporarily hide floating action bar for export
      const actionBar = document.querySelector('.floating-action-bar') as HTMLElement;
      if (actionBar) actionBar.style.display = 'none';
      
      // Ensure charts are fully loaded by checking for chart elements
      const chartElements = element.querySelectorAll('.chart-content > *');
      console.log(`Found ${chartElements.length} chart elements`);
      
      // Wait for charts to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple scroll to ensure content is loaded
      element.scrollTop = 0;
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: true,
        removeContainer: false,
        foreignObjectRendering: true,
        imageTimeout: 30000,
        ignoreElements: (element) => {
          // Don't ignore any elements that might contain charts
          return false;
        },
        onclone: (clonedDoc, clonedElement) => {
          // Ensure all Angular components are visible in the clone
          const clonedPrintPage = clonedDoc.querySelector('.print-page') as HTMLElement;
          if (clonedPrintPage) {
            clonedPrintPage.style.height = 'auto';
            clonedPrintPage.style.minHeight = 'auto';
            
            // Make sure gridster and charts are visible
            const clonedGridster = clonedDoc.querySelector('.preview-gridster') as HTMLElement;
            if (clonedGridster) {
              clonedGridster.style.height = 'auto';
              clonedGridster.style.minHeight = 'auto';
              clonedGridster.style.overflow = 'visible';
              clonedGridster.style.display = 'block';
            }
            
            // Ensure all chart containers are visible
            const clonedCharts = clonedDoc.querySelectorAll('.chart-content');
            clonedCharts.forEach((chart: any) => {
              chart.style.display = 'block';
              chart.style.visibility = 'visible';
              chart.style.opacity = '1';
            });
          }
        }
      });
      
      // Restore action bar and remove export class
      if (actionBar) actionBar.style.display = 'flex';
      if (overlay) overlay.classList.remove('exporting');
      
      if (canvas.width === 0 || canvas.height === 0) {
        throw new Error('Canvas is empty - unable to capture content');
      }
      
      const link = document.createElement('a');
      link.download = `dashboard-report-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      console.log('PNG export completed successfully');
    } catch (error) {
      console.error('Error exporting PNG:', error);
      alert('Error exporting PNG. Please try again.');
    }
  }
}