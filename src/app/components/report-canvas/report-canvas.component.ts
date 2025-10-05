import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from '../data-table/data-table.component';
import { CdkDropList, CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-report-canvas',
  standalone: true,
  imports: [CommonModule, DataTableComponent, CdkDropList],
  template: `
    <div class="canvas-container">
      
      <!-- Canvas Controls -->
      <div class="canvas-controls">
        <button class="filter-btn">
          <span class="filter-icon">⚡</span>
          Add filter
        </button>
        
        <div class="layout-controls">
          <button class="layout-btn active">
            <span class="checkmark">✓</span>
            Freeform layout
          </button>
          <button class="layout-btn">
            Responsive layout
          </button>
        </div>
      </div>
      
      <!-- Main Canvas -->
      <div class="canvas" cdkDropList (cdkDropListDropped)="onDrop($event)">
        <!-- Empty State (when no charts) -->
        <div class="canvas-placeholder" *ngIf="!hasCharts">
          <div class="placeholder-content">
            <div class="chart-illustration">
              <!-- Chart bars on the left -->
              <div class="chart-bars">
                <div class="bar bar-yellow"></div>
                <div class="bar bar-red"></div>
                <div class="bar bar-blue"></div>
                <div class="bar bar-green"></div>
                <div class="bar bar-purple"></div>
              </div>
              <!-- Dots and circles on the right -->
              <div class="chart-elements">
                <div class="dot dot-orange"></div>
                <div class="circle-outline"></div>
                <div class="circle-outline medium"></div>
                <div class="circle-outline small"></div>
                <div class="dot dot-red"></div>
                <div class="dot dot-blue"></div>
              </div>
            </div>
            <h2>Let's get started</h2>
            <p>Drag a field from the Data Panel to the canvas to add a new chart or select a component on the report canvas to edit it.</p>
          </div>
        </div>
        
        <!-- Data Table Component (when charts exist) -->
        <app-data-table 
          *ngIf="hasCharts"
          [isSelected]="selectedComponent === 'table'" 
          (selected)="onSelectTable()">
        </app-data-table>
        
        <!-- Floating Action Buttons -->
        <div class="canvas-actions" *ngIf="!hasCharts">
          <button class="action-btn chart-btn" (click)="onAddChart()">
            <span class="btn-icon">📊</span>
            Add chart
          </button>
          <button class="action-btn control-btn">
            <span class="btn-icon">🎛️</span>
            Add control
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './report-canvas.component.scss'
})
export class ReportCanvasComponent {
  @Output() componentSelected = new EventEmitter<string>();
  @Output() chartAdded = new EventEmitter<void>();
  
  selectedComponent: string | null = null; // Start with empty canvas
  hasCharts = false; // Track if any charts have been added

  onSelectTable() {
    this.selectedComponent = 'table';
    this.componentSelected.emit('table');
  }

  onAddChart() {
    // Add a table chart to the canvas
    this.hasCharts = true;
    this.selectedComponent = 'table';
    this.componentSelected.emit('table');
  }

  onDrop(event: CdkDragDrop<any>) {
    // Handle field drop from data panel
    console.log('Field dropped:', event);
    
    // Create a chart when field is dropped
    this.hasCharts = true;
    this.selectedComponent = 'table';
    this.componentSelected.emit('table');
  }
}