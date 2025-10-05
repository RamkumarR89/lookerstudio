import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ChartType {
  id: string;
  name: string;
  category: string;
  icon: string;
  description?: string;
}

interface ChartCategory {
  name: string;
  charts: ChartType[];
}

@Component({
  selector: 'app-add-chart-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bottom-panel" [class.show]="isVisible">
      
      <!-- Panel Header -->
      <div class="panel-header">
        <div class="panel-title">
          <h2>Insert a chart</h2>
        </div>
        <div class="panel-controls">
          <button class="minimize-btn" (click)="toggleMinimized()" [class.minimized]="isMinimized">
            <span>{{ isMinimized ? '⌄' : '⌃' }}</span>
          </button>
          <button class="close-btn" (click)="onClose()">
            <span>×</span>
          </button>
        </div>
      </div>

      <!-- Panel Content (collapsible) -->
      <div class="panel-content" [class.collapsed]="isMinimized">
        
        <!-- Chart Categories -->
        <div class="chart-categories">
          <div class="category-section" *ngFor="let category of chartCategories">
            
            <!-- Category Header -->
            <div class="category-header">
              <h3>{{ category.name }}</h3>
            </div>

            <!-- Charts Grid -->
            <div class="charts-grid">
              <div 
                class="chart-card" 
                *ngFor="let chart of category.charts"
                (click)="selectChart(chart)">
                
                <div class="chart-preview">
                  <div class="chart-icon" [innerHTML]="chart.icon"></div>
                </div>
                
                <div class="chart-name">{{ chart.name }}</div>
                
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `,
  styleUrl: './add-chart-modal.component.scss'
})
export class AddChartModalComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() chartSelected = new EventEmitter<ChartType>();

  isMinimized = false;

  chartCategories: ChartCategory[] = [
    {
      name: 'Table',
      charts: [
        { id: 'table-basic', name: 'Table', category: 'table', icon: '<svg width="40" height="30"><rect x="2" y="5" width="36" height="3" fill="#666" rx="1"/><rect x="2" y="10" width="36" height="2" fill="#ccc" rx="1"/><rect x="2" y="14" width="36" height="2" fill="#ccc" rx="1"/><rect x="2" y="18" width="36" height="2" fill="#ccc" rx="1"/><rect x="2" y="22" width="36" height="2" fill="#ccc" rx="1"/></svg>' },
        { id: 'table-heatmap', name: 'Table with heatmap', category: 'table', icon: '<svg width="40" height="30"><rect x="2" y="5" width="36" height="3" fill="#666" rx="1"/><rect x="2" y="10" width="8" height="2" fill="#4285f4" rx="1"/><rect x="12" y="10" width="8" height="2" fill="#34a853" rx="1"/><rect x="22" y="10" width="8" height="2" fill="#ea4335" rx="1"/><rect x="32" y="10" width="6" height="2" fill="#fbbc05" rx="1"/></svg>' },
        { id: 'table-bars', name: 'Table with bars', category: 'table', icon: '<svg width="40" height="30"><rect x="2" y="5" width="36" height="3" fill="#666" rx="1"/><rect x="2" y="10" width="12" height="2" fill="#4285f4" rx="1"/><rect x="2" y="14" width="20" height="2" fill="#4285f4" rx="1"/><rect x="2" y="18" width="8" height="2" fill="#4285f4" rx="1"/><rect x="2" y="22" width="16" height="2" fill="#4285f4" rx="1"/></svg>' }
      ]
    },
    {
      name: 'Scorecard',
      charts: [
        { id: 'scorecard-basic', name: 'Scorecard', category: 'scorecard', icon: '<svg width="40" height="30"><rect x="5" y="8" width="30" height="14" fill="#f8f9fa" stroke="#dadce0" rx="2"/><text x="20" y="18" text-anchor="middle" font-size="8" fill="#202124">1,168</text></svg>' },
        { id: 'scorecard-compact', name: 'Compact scorecard', category: 'scorecard', icon: '<svg width="40" height="30"><rect x="8" y="10" width="24" height="10" fill="#f8f9fa" stroke="#dadce0" rx="1"/><text x="20" y="17" text-anchor="middle" font-size="6" fill="#202124">69.3K</text></svg>' },
        { id: 'scorecard-bullet', name: 'Bullet chart', category: 'scorecard', icon: '<svg width="40" height="30"><rect x="5" y="12" width="30" height="6" fill="#e8eaed" rx="3"/><rect x="5" y="13" width="20" height="4" fill="#4285f4" rx="2"/></svg>' }
      ]
    },
    {
      name: 'Time series',
      charts: [
        { id: 'timeseries-line', name: 'Time series', category: 'timeseries', icon: '<svg width="40" height="30"><path d="M5,20 Q15,10 25,15 T35,12" stroke="#4285f4" stroke-width="2" fill="none"/><circle cx="5" cy="20" r="1" fill="#4285f4"/><circle cx="25" cy="15" r="1" fill="#4285f4"/><circle cx="35" cy="12" r="1" fill="#4285f4"/></svg>' },
        { id: 'timeseries-smooth', name: 'Smooth time series', category: 'timeseries', icon: '<svg width="40" height="30"><path d="M5,18 C15,12 25,16 35,14" stroke="#34a853" stroke-width="2" fill="none"/></svg>' },
        { id: 'timeseries-area', name: 'Area chart', category: 'timeseries', icon: '<svg width="40" height="30"><path d="M5,20 Q15,10 25,15 T35,12 L35,25 L5,25 Z" fill="#4285f4" opacity="0.3"/><path d="M5,20 Q15,10 25,15 T35,12" stroke="#4285f4" stroke-width="2" fill="none"/></svg>' }
      ]
    },
    {
      name: 'Bar',
      charts: [
        { id: 'bar-column', name: 'Column chart', category: 'bar', icon: '<svg width="40" height="30"><rect x="6" y="15" width="4" height="10" fill="#4285f4"/><rect x="12" y="10" width="4" height="15" fill="#34a853"/><rect x="18" y="18" width="4" height="7" fill="#ea4335"/><rect x="24" y="12" width="4" height="13" fill="#fbbc05"/><rect x="30" y="8" width="4" height="17" fill="#9c27b0"/></svg>' },
        { id: 'bar-stacked', name: 'Stacked column', category: 'bar', icon: '<svg width="40" height="30"><rect x="8" y="15" width="6" height="5" fill="#4285f4"/><rect x="8" y="10" width="6" height="5" fill="#34a853"/><rect x="8" y="20" width="6" height="5" fill="#ea4335"/><rect x="16" y="12" width="6" height="6" fill="#4285f4"/><rect x="16" y="8" width="6" height="4" fill="#34a853"/><rect x="16" y="18" width="6" height="7" fill="#ea4335"/><rect x="24" y="14" width="6" height="4" fill="#4285f4"/><rect x="24" y="10" width="6" height="4" fill="#34a853"/><rect x="24" y="18" width="6" height="7" fill="#ea4335"/></svg>' },
        { id: 'bar-100-stacked', name: '100% stacked column', category: 'bar', icon: '<svg width="40" height="30"><rect x="8" y="8" width="6" height="5" fill="#4285f4"/><rect x="8" y="13" width="6" height="5" fill="#34a853"/><rect x="8" y="18" width="6" height="7" fill="#ea4335"/><rect x="16" y="8" width="6" height="5" fill="#4285f4"/><rect x="16" y="13" width="6" height="5" fill="#34a853"/><rect x="16" y="18" width="6" height="7" fill="#ea4335"/><rect x="24" y="8" width="6" height="5" fill="#4285f4"/><rect x="24" y="13" width="6" height="5" fill="#34a853"/><rect x="24" y="18" width="6" height="7" fill="#ea4335"/></svg>' },
        { id: 'bar-horizontal', name: 'Bar chart', category: 'bar', icon: '<svg width="40" height="30"><rect x="5" y="6" width="15" height="3" fill="#4285f4"/><rect x="5" y="11" width="25" height="3" fill="#34a853"/><rect x="5" y="16" width="10" height="3" fill="#ea4335"/><rect x="5" y="21" width="20" height="3" fill="#fbbc05"/></svg>' },
        { id: 'bar-horizontal-stacked', name: 'Stacked bar', category: 'bar', icon: '<svg width="40" height="30"><rect x="5" y="8" width="8" height="3" fill="#4285f4"/><rect x="13" y="8" width="6" height="3" fill="#34a853"/><rect x="19" y="8" width="4" height="3" fill="#ea4335"/><rect x="5" y="13" width="12" height="3" fill="#4285f4"/><rect x="17" y="13" width="8" height="3" fill="#34a853"/><rect x="25" y="13" width="6" height="3" fill="#ea4335"/><rect x="5" y="18" width="6" height="3" fill="#4285f4"/><rect x="11" y="18" width="10" height="3" fill="#34a853"/><rect x="21" y="18" width="8" height="3" fill="#ea4335"/></svg>' },
        { id: 'bar-100-horizontal-stacked', name: '100% stacked bar', category: 'bar', icon: '<svg width="40" height="30"><rect x="5" y="8" width="8" height="3" fill="#4285f4"/><rect x="13" y="8" width="8" height="3" fill="#34a853"/><rect x="21" y="8" width="8" height="3" fill="#ea4335"/><rect x="5" y="13" width="8" height="3" fill="#4285f4"/><rect x="13" y="13" width="8" height="3" fill="#34a853"/><rect x="21" y="13" width="8" height="3" fill="#ea4335"/><rect x="5" y="18" width="8" height="3" fill="#4285f4"/><rect x="13" y="18" width="8" height="3" fill="#34a853"/><rect x="21" y="18" width="8" height="3" fill="#ea4335"/></svg>' }
      ]
    },
    {
      name: 'Pie',
      charts: [
        { id: 'pie-chart', name: 'Pie chart', category: 'pie', icon: '<svg width="40" height="30"><circle cx="20" cy="15" r="10" fill="#4285f4"/><path d="M20,15 L30,15 A10,10 0 0,1 25,25 Z" fill="#34a853"/><path d="M20,15 L25,25 A10,10 0 0,1 10,15 Z" fill="#ea4335"/></svg>' },
        { id: 'donut-chart', name: 'Donut chart', category: 'pie', icon: '<svg width="40" height="30"><circle cx="20" cy="15" r="10" fill="#4285f4"/><path d="M20,15 L30,15 A10,10 0 0,1 25,25 Z" fill="#34a853"/><path d="M20,15 L25,25 A10,10 0 0,1 10,15 Z" fill="#ea4335"/><circle cx="20" cy="15" r="5" fill="white"/></svg>' }
      ]
    },
    {
      name: 'Google Maps',
      charts: [
        { id: 'geo-map', name: 'Geo map', category: 'maps', icon: '<svg width="40" height="30"><rect x="5" y="5" width="30" height="20" fill="#e1f5fe" stroke="#81d4fa"/><circle cx="15" cy="12" r="2" fill="#1976d2"/><circle cx="25" cy="18" r="2" fill="#1976d2"/></svg>' },
        { id: 'geo-map-bubbles', name: 'Geo map with bubbles', category: 'maps', icon: '<svg width="40" height="30"><rect x="5" y="5" width="30" height="20" fill="#e1f5fe" stroke="#81d4fa"/><circle cx="15" cy="12" r="3" fill="#1976d2" opacity="0.7"/><circle cx="25" cy="18" r="4" fill="#1976d2" opacity="0.7"/></svg>' },
        { id: 'filled-map', name: 'Filled map', category: 'maps', icon: '<svg width="40" height="30"><rect x="5" y="5" width="30" height="20" fill="#e8f5e8" stroke="#4caf50"/><polygon points="10,10 18,8 22,15 15,18" fill="#2e7d32"/><polygon points="22,12 30,10 32,18 26,20" fill="#66bb6a"/></svg>' }
      ]
    },
    {
      name: 'Line',
      charts: [
        { id: 'line-chart', name: 'Line chart', category: 'line', icon: '<svg width="40" height="30"><path d="M5,20 L15,10 L25,15 L35,8" stroke="#4285f4" stroke-width="2" fill="none"/><circle cx="5" cy="20" r="1.5" fill="#4285f4"/><circle cx="15" cy="10" r="1.5" fill="#4285f4"/><circle cx="25" cy="15" r="1.5" fill="#4285f4"/><circle cx="35" cy="8" r="1.5" fill="#4285f4"/></svg>' },
        { id: 'combo-chart', name: 'Combo chart', category: 'line', icon: '<svg width="40" height="30"><rect x="6" y="18" width="3" height="7" fill="#34a853"/><rect x="12" y="15" width="3" height="10" fill="#34a853"/><rect x="18" y="20" width="3" height="5" fill="#34a853"/><rect x="24" y="12" width="3" height="13" fill="#34a853"/><path d="M7,18 L13.5,15 L19.5,20 L25.5,12" stroke="#ea4335" stroke-width="2" fill="none"/><circle cx="7" cy="18" r="1" fill="#ea4335"/><circle cx="13.5" cy="15" r="1" fill="#ea4335"/><circle cx="19.5" cy="20" r="1" fill="#ea4335"/><circle cx="25.5" cy="12" r="1" fill="#ea4335"/></svg>' }
      ]
    },
    {
      name: 'Area',
      charts: [
        { id: 'area-chart', name: 'Area chart', category: 'area', icon: '<svg width="40" height="30"><path d="M5,20 L15,10 L25,15 L35,8 L35,25 L5,25 Z" fill="#4285f4" opacity="0.3"/><path d="M5,20 L15,10 L25,15 L35,8" stroke="#4285f4" stroke-width="2" fill="none"/></svg>' },
        { id: 'stacked-area', name: 'Stacked area', category: 'area', icon: '<svg width="40" height="30"><path d="M5,22 L15,18 L25,20 L35,16 L35,25 L5,25 Z" fill="#ea4335" opacity="0.6"/><path d="M5,18 L15,12 L25,15 L35,10 L35,16 L25,20 L15,18 L5,22 Z" fill="#4285f4" opacity="0.6"/><path d="M5,15 L15,8 L25,12 L35,6 L35,10 L25,15 L15,12 L5,18 Z" fill="#34a853" opacity="0.6"/></svg>' },
        { id: 'stepped-area', name: 'Stepped area', category: 'area', icon: '<svg width="40" height="30"><path d="M5,20 L10,20 L10,15 L15,15 L15,18 L20,18 L20,12 L25,12 L25,16 L30,16 L30,10 L35,10 L35,25 L5,25 Z" fill="#9c27b0" opacity="0.4"/><path d="M5,20 L10,20 L10,15 L15,15 L15,18 L20,18 L20,12 L25,12 L25,16 L30,16 L30,10 L35,10" stroke="#9c27b0" stroke-width="2" fill="none"/></svg>' }
      ]
    },
    {
      name: 'Scatter',
      charts: [
        { id: 'scatter-chart', name: 'Scatter chart', category: 'scatter', icon: '<svg width="40" height="30"><circle cx="8" cy="18" r="2" fill="#4285f4"/><circle cx="15" cy="12" r="2" fill="#4285f4"/><circle cx="22" cy="20" r="2" fill="#4285f4"/><circle cx="28" cy="10" r="2" fill="#4285f4"/><circle cx="32" cy="16" r="2" fill="#4285f4"/></svg>' },
        { id: 'bubble-chart', name: 'Bubble chart', category: 'scatter', icon: '<svg width="40" height="30"><circle cx="10" cy="18" r="3" fill="#4285f4" opacity="0.7"/><circle cx="18" cy="12" r="4" fill="#34a853" opacity="0.7"/><circle cx="26" cy="20" r="2" fill="#ea4335" opacity="0.7"/><circle cx="32" cy="10" r="3.5" fill="#fbbc05" opacity="0.7"/></svg>' }
      ]
    },
    {
      name: 'Pivot table',
      charts: [
        { id: 'pivot-table', name: 'Pivot table', category: 'pivot', icon: '<svg width="40" height="30"><rect x="2" y="5" width="12" height="3" fill="#4285f4" rx="1"/><rect x="16" y="5" width="10" height="3" fill="#4285f4" rx="1"/><rect x="28" y="5" width="10" height="3" fill="#4285f4" rx="1"/><rect x="2" y="10" width="12" height="2" fill="#666" rx="1"/><rect x="16" y="10" width="10" height="2" fill="#ccc" rx="1"/><rect x="28" y="10" width="10" height="2" fill="#ccc" rx="1"/><rect x="2" y="14" width="12" height="2" fill="#666" rx="1"/><rect x="16" y="14" width="10" height="2" fill="#ccc" rx="1"/><rect x="28" y="14" width="10" height="2" fill="#ccc" rx="1"/></svg>' }
      ]
    }
  ];

  toggleMinimized() {
    this.isMinimized = !this.isMinimized;
  }

  selectChart(chart: ChartType) {
    this.chartSelected.emit(chart);
    console.log('Selected chart:', chart);
  }

  onClose() {
    this.closeModal.emit();
  }
}