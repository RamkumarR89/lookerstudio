import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Properties Panel -->
    <div class="properties-panel" [class.show]="isVisible">
      <!-- Panel Header -->
      <div class="panel-header">
        <h3>{{ getPanelTitle() }}</h3>
      </div>

      <!-- Panel Content -->
      <div class="panel-content" *ngIf="selectedComponent">
        
        <!-- Chart Types Section (when table/chart selected) -->
        <div class="chart-types-section" *ngIf="selectedComponent === 'table'">
          <div class="chart-types-header">
            <h4>Chart types</h4>
            <span class="chart-count">48</span>
          </div>
        </div>

        <!-- Properties Tabs -->
        <div class="properties-tabs">
          <button class="properties-tab-btn" 
                  [class.active]="activeTab === 'setup'" 
                  (click)="activeTab = 'setup'">
            Setup
          </button>
          <button class="properties-tab-btn" 
                  [class.active]="activeTab === 'style'" 
                  (click)="activeTab = 'style'">
            Style
          </button>
        </div>

        <!-- Setup Tab Content -->
        <div class="properties-tab-content" [class.active]="activeTab === 'setup'">
          <div *ngIf="selectedComponent === 'table'">
            <!-- Data source info -->
            <div class="data-source-info">
              <span class="source-icon">📊</span>
              <span class="source-name">18-April-2025_FUELTRANS...</span>
              <button class="blend-btn">🔗 Blend data</button>
            </div>
            
            <!-- Dimension Section -->
            <div class="section">
              <label class="section-label">Dimension</label>
              <div class="dimension-item">
                <span class="field-icon">ABC</span>
                <span class="field-name">OPCO</span>
              </div>
              <button class="add-dimension-btn">⊕ Add dimension</button>
              <div class="drill-down">
                <label>Drill down</label>
                <input type="checkbox" checked>
              </div>
            </div>
            
            <!-- Metric Section -->
            <div class="section">
              <label class="section-label">Metric</label>
              <div class="metric-item">
                <span class="field-icon">AUT</span>
                <span class="field-name">Record Count</span>
              </div>
              <button class="add-metric-btn">⊕ Add metric</button>
              <div class="optional-metrics">
                <label>Optional metrics</label>
                <input type="checkbox">
              </div>
              <div class="metric-sliders">
                <label>Metric sliders</label>
                <input type="checkbox">
              </div>
            </div>
          </div>

          <!-- Default properties when no component selected -->
          <div *ngIf="!selectedComponent">
            <p class="empty-message">Select a component to view its properties</p>
          </div>
        </div>

        <!-- Style Tab Content -->
        <div class="properties-tab-content" [class.active]="activeTab === 'style'">
          <div class="form-section">
            <label class="form-label">Background and border</label>
            <div class="color-input">
              <label>Background</label>
              <input type="color" [(ngModel)]="backgroundColor">
            </div>
            <div class="number-input">
              <label>Border radius</label>
              <input type="number" [(ngModel)]="borderRadius" min="0">
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state when nothing selected -->
      <div class="panel-content" *ngIf="!selectedComponent">
        <div class="empty-state">
          <p>Select a chart or component to view its properties</p>
        </div>
      </div>

      <!-- Toggle Button -->
      <button class="panel-toggle" (click)="onTogglePanel()">
        <div class="toggle-icon">▶</div>
        <div class="toggle-label">Hide panel</div>
      </button>
    </div>
  `,
  styleUrl: './properties-panel.component.scss'
})
export class PropertiesPanelComponent {
  @Input() isVisible = true;
  @Input() selectedComponent: string | null = null;
  @Output() togglePanel = new EventEmitter<void>();

  activeTab: 'setup' | 'style' = 'setup';
  backgroundColor = '#ffffff';
  borderRadius = 4;

  getPanelTitle(): string {
    if (this.selectedComponent === 'table') {
      return '🗂️ Table properties';
    }
    return '🖊️ Properties';
  }

  onTogglePanel() {
    this.togglePanel.emit();
  }
}