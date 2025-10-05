import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, FormsModule, CdkDrag],
  template: `
    <!-- Vertical Tabs Panel -->
    <div class="vertical-tabs-panel" [class.show]="isVisible">
      <!-- Tab Content Area -->
      <div class="tab-content-area">
        
        <!-- Data Tab (Always visible when panelType is 'data') -->
        <div class="tab-content" [class.active]="panelType === 'data' || activeTab === 'data'">
          <div class="panel-header">
            <div class="header-content">
              <span class="panel-icon">📊</span>
              <h3 class="panel-title">Data</h3>
            </div>
          </div>
          
          <div class="panel-content">
            <!-- Search Box -->
            <div class="search-container">
              <input type="text" placeholder="Search" class="search-input" [(ngModel)]="dataSearchTerm">
            </div>
            
            <!-- Data Source Section -->
            <div class="data-source-section">
              <div class="data-source-item">
                <div class="source-header">
                  <span class="source-icon">📊</span>
                  <span class="source-name">18-April-2025_FUELTRANSACTIO...</span>
                  <button class="remove-btn">×</button>
                </div>
              </div>
              
              <!-- Field List -->
              <div class="field-list">
                <div class="field-item" 
                     *ngFor="let field of dimensionFields" 
                     [attr.data-type]="field.type"
                     cdkDrag
                     [cdkDragData]="field">
                  <span class="field-type-badge" [class]="'type-' + field.type">{{ field.type }}</span>
                  <span class="field-name">{{ field.name }}</span>
                </div>
              </div>
              
              <!-- Bottom Actions -->
              <div class="panel-actions">
                <button class="add-field-btn" (click)="addField()">
                  <span class="add-icon">⊕</span>
                  Add a field
                </button>
                <button class="add-parameter-btn" (click)="addParameter()">
                  <span class="add-icon">⊕</span>
                  Add a parameter
                </button>
                <button class="add-data-btn" (click)="onAddData()">
                  <span class="add-icon">⊕</span>
                  Add Data
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Properties Tab (hidden when panelType is 'data') -->
        <div class="tab-content" [class.active]="activeTab === 'properties'" *ngIf="panelType !== 'data'">
          <div class="panel-header">
            <h3>🖊️ {{ selectedComponent === 'table' ? 'Table properties' : 'Group properties' }}</h3>
          </div>
          
          <!-- Properties Tabs -->
          <div class="properties-tabs">
            <button class="properties-tab-btn" 
                    [class.active]="activePropertiesTab === 'setup'" 
                    (click)="activePropertiesTab = 'setup'">
              Setup
            </button>
            <button class="properties-tab-btn" 
                    [class.active]="activePropertiesTab === 'style'" 
                    (click)="activePropertiesTab = 'style'">
              Style
            </button>
          </div>

          <div class="panel-content">
            <!-- Table Properties Content -->
            <div *ngIf="selectedComponent === 'table'">
              <div class="chart-types-section">
                <div class="chart-types-header">
                  <h4>Chart types</h4>
                  <span class="chart-count">48</span>
                </div>
              </div>
            </div>
            
            <!-- Setup Tab Content -->
            <div class="properties-tab-content" [class.active]="activePropertiesTab === 'setup'">
              <div class="form-section" *ngIf="selectedComponent === 'table'">
                <label class="form-label">Data source</label>
                <div class="data-source-info">
                  <span class="source-icon">📊</span>
                  <span class="source-name">18-April-2025_FUELTRANS...</span>
                  <button class="blend-btn">🔗 Blend data</button>
                </div>
                
                <div class="dimension-metric-sections">
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
              </div>
              
              <div class="form-section" *ngIf="selectedComponent !== 'table'">
                <label class="form-label">Data source</label>
                <select class="form-select" [(ngModel)]="selectedDataSourceForProperties">
                  <option value="">Select a data source</option>
                  <option value="sample-data">Sample Data</option>
                  <option value="google-analytics">Google Analytics</option>
                </select>
              </div>

              <div class="form-section">
                <div class="toggle-section">
                  <label class="toggle-label">Apply filter controls to page</label>
                  <input type="checkbox" [(ngModel)]="applyFilterControlsToPage">
                </div>
              </div>

              <div class="form-section">
                <label class="form-label">Filter</label>
                <p class="form-description">Filters on this Group</p>
                <button class="add-btn">⊕ Add filter</button>
              </div>
            </div>

            <!-- Style Tab Content -->
            <div class="properties-tab-content" [class.active]="activePropertiesTab === 'style'">
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

              <div class="form-section">
                <label class="form-label">Arrangement</label>
                <div class="alignment-buttons">
                  <button class="alignment-btn">⟨⸗</button>
                  <button class="alignment-btn">⸗⊕⸗</button>
                  <button class="alignment-btn">⸗⟩</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Filter Tab (hidden when panelType is 'data') -->
        <div class="tab-content" [class.active]="activeTab === 'filter'" *ngIf="panelType !== 'data'">
          <div class="panel-header">
            <h3>⚒️ Filter bar</h3>
          </div>
          <div class="panel-content">
            <p class="empty-message">No filters applied</p>
          </div>
        </div>
      </div>

      <!-- Tab Buttons (only show when not in data panel mode) -->
      <div class="tab-buttons" *ngIf="panelType !== 'data'">
        <button class="vertical-tab" [class.active]="activeTab === 'data'" (click)="setActiveTab('data')">
          <div class="tab-icon">📊</div>
          <div class="tab-label">Data</div>
        </button>
        <button class="vertical-tab" [class.active]="activeTab === 'properties'" (click)="setActiveTab('properties')">
          <div class="tab-icon">🖊️</div>
          <div class="tab-label">Properties</div>
        </button>
        <button class="vertical-tab" [class.active]="activeTab === 'filter'" (click)="setActiveTab('filter')">
          <div class="tab-icon">⚒️</div>
          <div class="tab-label">Filter bar</div>
        </button>
        
        <!-- Toggle Button -->
        <button class="vertical-tab panel-toggle" (click)="onToggleSidebar()">
          <div class="tab-icon">◀</div>
          <div class="tab-label">Hide panels</div>
        </button>
      </div>
      
      <!-- Simple toggle for data panel mode -->
      <div class="simple-toggle" *ngIf="panelType === 'data'">
        <button class="panel-toggle-simple" (click)="onToggleSidebar()">
          <div class="toggle-icon">◀</div>
          <div class="toggle-label">Hide data</div>
        </button>
      </div>
    </div>
  `,
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  @Input() isVisible = false;
  @Input() selectedComponent: string | null = null;
  @Input() panelType: 'data' | 'properties' = 'data';
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() addDataClicked = new EventEmitter<void>;

  activeTab: 'data' | 'properties' | 'filter' = 'data';
  activePropertiesTab: 'setup' | 'style' = 'setup';
  
  // Data properties
  dataSearchTerm = '';
  selectedDataSource = '18-April-2025_FUELTRANSACTIO...';
  dimensionFields = [
    { name: 'Charges', icon: 'ABC', type: 'text' },
    { name: 'DELIVERY', icon: 'ABC', type: 'text' },
    { name: 'EXWH PRICE', icon: '123', type: 'number' },
    { name: 'FUEL DATE', icon: '📅', type: 'date' },
    { name: 'FUEL GRADE', icon: 'ABC', type: 'text' },
    { name: 'MT QTY', icon: '123', type: 'number' },
    { name: 'MTD PRICE', icon: '123', type: 'number' },
    { name: 'OPCO', icon: 'ABC', type: 'text' },
    { name: 'PORT', icon: 'ABC', type: 'text' },
    { name: 'PRICE METHOD', icon: 'ABC', type: 'text' },
    { name: 'SHIP', icon: 'ABC', type: 'text' },
    { name: 'STEM DATE', icon: '📅', type: 'date' },
    { name: 'SULFUR %', icon: '123', type: 'number' },
    { name: 'SUPPLIER', icon: 'ABC', type: 'text' },
    { name: 'TERMS', icon: 'ABC', type: 'text' },
    { name: 'Record Count', icon: '123', type: 'number' }
  ];

  // Properties panel data
  selectedDataSourceForProperties = '';
  applyFilterControlsToPage = true;
  backgroundColor = '#ffffff';
  borderRadius = 4;

  setActiveTab(tab: 'data' | 'properties' | 'filter') {
    this.activeTab = tab;
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  getFieldIcon(type: string): string {
    switch (type) {
      case 'text': return 'ABC';
      case 'number': return '123';
      case 'date': return '📅';
      default: return 'ABC';
    }
  }

  addField() {
    console.log('Add field clicked');
  }

  addParameter() {
    console.log('Add parameter clicked');
  }

  onAddData() {
    this.addDataClicked.emit();
  }
}