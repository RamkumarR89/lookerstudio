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
        
        <!-- Empty State (when no charts) -->
        <div class="empty-state" *ngIf="!hasCharts">
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
            <button class="action-btn primary" (click)="onAddChart()">
              📊 Add chart
            </button>
            <button class="action-btn secondary">
              🎛️ Add control
            </button>
          </div>
        </div>
        
        <!-- Data Table Component (when charts exist) -->
        <app-data-table 
          *ngIf="hasCharts"
          [isSelected]="selectedComponent === 'table'" 
          (selected)="onSelectTable()">
        </app-data-table>
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