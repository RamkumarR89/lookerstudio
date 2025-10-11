import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ReportCanvasComponent } from '../../components/report-canvas/report-canvas.component';
import { GridDashboard2Component } from '../../components/grid-dashboard-2/grid-dashboard-2.component';
import { ThemePanelComponent } from '../../components/theme-panel/theme-panel.component';
import { AddDataModalComponent } from '../../components/add-data-modal/add-data-modal.component';
import { AddChartModalComponent } from '../../components/add-chart-modal/add-chart-modal.component';
import { PropertiesPanelComponent } from '../../components/properties-panel/properties-panel.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, GridDashboard2Component, ThemePanelComponent, AddDataModalComponent, AddChartModalComponent],
  template: `
    <!-- Clean Looker Studio Layout -->
    <div class="looker-studio">
      
      <!-- Header Section -->
      <app-header 
        (addDataClicked)="openAddDataModal()"
        (addChartClicked)="openAddChartModal()"
        (themePanelClicked)="openThemePanel()">
      </app-header>

      <!-- Main Content Layout -->
      <div class="main-layout" [class.sidebar-open]="sidebarOpen" [class.content-visible]="contentVisible">
        <!-- Report Canvas (Left) -->
        <div class="canvas-area" [class.sidebar-open]="sidebarOpen" [class.content-visible]="contentVisible">
          <app-grid-dashboard-2 #gridDashboard></app-grid-dashboard-2>
        </div>

        <!-- Right Side: Vertical Sidebar -->
        <div class="vertical-sidebar-layout" [class.content-visible]="contentVisible" *ngIf="sidebarOpen">
          <!-- Content Panel (Left Side) -->
          <div class="vertical-content-panel" *ngIf="contentVisible">
            <!-- Data Panel -->
            <div *ngIf="activeSidebarTab === 'data'" class="data-content">
              <div class="panel-header">
                <div class="header-content">
                  <span class="panel-icon">📊</span>
                  <h3 class="panel-title">Data</h3>
                </div>
              </div>
              <div class="panel-content">
                <!-- Search Box -->
                <div class="search-container">
                  <input type="text" placeholder="Search" class="search-input">
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
                    <div class="field-item">
                      <span class="field-type-badge type-text">text</span>
                      <span class="field-name">Charges</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-text">text</span>
                      <span class="field-name">DELIVERY</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-number">number</span>
                      <span class="field-name">EXWH PRICE</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-date">date</span>
                      <span class="field-name">FUEL DATE</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-text">text</span>
                      <span class="field-name">FUEL GRADE</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-number">number</span>
                      <span class="field-name">MT QTY</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-number">number</span>
                      <span class="field-name">MTD PRICE</span>
                    </div>
                    <div class="field-item">
                      <span class="field-type-badge type-text">text</span>
                      <span class="field-name">OPCO</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Properties Panel -->
            <div *ngIf="activeSidebarTab === 'properties'" class="properties-content">
              <div class="panel-header">
                <div class="header-content">
                  <span class="panel-icon">🖊️</span>
                  <h3 class="panel-title">Properties</h3>
                </div>
              </div>
              <div class="panel-content">
                <p class="empty-message">Select a component to edit its properties</p>
              </div>
            </div>
            
            <!-- Filter Panel -->
            <div *ngIf="activeSidebarTab === 'filter'" class="filter-content">
              <div class="panel-header">
                <div class="header-content">
                  <span class="panel-icon">⚒️</span>
                  <h3 class="panel-title">Filter bar</h3>
                </div>
              </div>
              <div class="panel-content">
                <p class="empty-message">No filters applied</p>
              </div>
            </div>
          </div>
          
          <!-- Vertical Tabs (Right Side) -->
          <div class="vertical-tabs-container">
            <button class="vertical-tab-btn" 
                    [class.active]="activeSidebarTab === 'data'" 
                    (click)="setActiveTab('data')">
              <div class="tab-icon">📊</div>
              <div class="tab-label">Data</div>
            </button>
            
            <button class="vertical-tab-btn" 
                    [class.active]="activeSidebarTab === 'properties'" 
                    (click)="setActiveTab('properties')">
              <div class="tab-icon">🖊️</div>
              <div class="tab-label">Properties</div>
            </button>
            
            <button class="vertical-tab-btn" 
                    [class.active]="activeSidebarTab === 'filter'" 
                    (click)="setActiveTab('filter')">
              <div class="tab-icon">⚒️</div>
              <div class="tab-label">Filter bar</div>
            </button>
            
            <!-- Toggle Button at bottom -->
            <div class="vertical-toggle-container">
              <button class="vertical-toggle-btn" (click)="toggleSidebar()" [title]="'Hide panels'">
                <span class="arrow-icon">▶</span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Small Toggle Button (only when sidebar is closed) -->
        <div class="floating-toggle-container" *ngIf="!sidebarOpen">
          <button class="floating-toggle-btn" (click)="toggleSidebar()" [title]="'Show panels'">
            <span class="arrow-icon">◀</span>
          </button>
        </div>
      </div>

      <!-- Theme Panel (Overlay) -->
      <app-theme-panel 
        [isVisible]="showThemePanel"
        (closePanel)="closeThemePanel()"
        (themeSelected)="onThemeSelected($event)">
      </app-theme-panel>
      
      <!-- Footer -->
      <footer class="dashboard-footer">
        <div class="footer-content">
          <div class="footer-left">
            <span class="footer-text">Report Studio</span>
            <span class="footer-separator">•</span>
            <span class="footer-text">Ready</span>
          </div>
          <div class="footer-right">
            <span class="footer-text">100%</span>
            <span class="footer-separator">•</span>
            <span class="footer-text">Auto-save enabled</span>
          </div>
        </div>
      </footer>
      
    </div>
    
    <!-- Add Data Bottom Panel -->
    <app-add-data-modal
      [isVisible]="showAddDataModal"
      (closeModal)="closeAddDataModal()"
      (connectorSelected)="onConnectorSelected($event)">
    </app-add-data-modal>
    
    <!-- Add Chart Bottom Panel -->
    <app-add-chart-modal
      [isVisible]="showAddChartModal"
      (closeModal)="closeAddChartModal()"
      (chartSelected)="onChartSelected($event)">
    </app-add-chart-modal>
  `,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  @ViewChild('gridDashboard') gridDashboard!: GridDashboard2Component;
  
  showAddDataModal = false;
  showAddChartModal = false;
  showThemePanel = false;
  showRightDataPanel = true;
  showRightPropertiesPanel = true;
  selectedTheme: 'edge' | 'constellation' | 'groovy' = 'edge';
  selectedComponent: string | null = null;
  activeSidebarTab: 'data' | 'properties' | 'filter' = 'data';
  sidebarOpen = false; // Initially hidden completely
  contentVisible = false; // Content panel visibility

  get sidebarPanelType(): 'data' | 'properties' {
    return this.activeSidebarTab === 'properties' ? 'properties' : 'data';
  }

  setActiveTab(tab: 'data' | 'properties' | 'filter') {
    if (this.activeSidebarTab === tab && this.contentVisible) {
      // If clicking the same active tab, hide the content panel
      this.contentVisible = false;
    } else {
      // Switch to new tab and show content panel
      this.activeSidebarTab = tab;
      this.contentVisible = true;
    }
  }

  toggleSidebar() {
    if (this.sidebarOpen) {
      // Hide entire sidebar
      this.sidebarOpen = false;
      this.contentVisible = false;
    } else {
      // Show sidebar with icons only
      this.sidebarOpen = true;
      this.contentVisible = false;
    }
  }

  // Keep old method for compatibility
  toggleSidebarVisibility() {
    this.toggleSidebar();
  }

  ngOnInit() {
    // Initialize the component
  }

  openAddDataModal() {
    this.showAddDataModal = true;
  }

  closeAddDataModal() {
    this.showAddDataModal = false;
  }

  openAddChartModal() {
    // Delegate to the grid component's modal
    if (this.gridDashboard) {
      this.gridDashboard.openAddChartModal();
    }
  }

  closeAddChartModal() {
    this.showAddChartModal = false;
  }

  openThemePanel() {
    this.showThemePanel = true;
  }

  closeThemePanel() {
    this.showThemePanel = false;
  }

  toggleRightDataPanel() {
    this.showRightDataPanel = !this.showRightDataPanel;
  }

  toggleRightPropertiesPanel() {
    this.showRightPropertiesPanel = !this.showRightPropertiesPanel;
  }

  onThemeSelected(theme: string) {
    this.selectedTheme = theme as 'edge' | 'constellation' | 'groovy';
    console.log('Selected theme:', theme);
  }

  onConnectorSelected(connector: any) {
    console.log('Selected data connector:', connector);
    // Handle connector selection logic here
    this.closeAddDataModal();
  }

  onChartSelected(chart: any) {
    console.log('Selected chart type:', chart);
    // Handle chart selection logic here
    this.closeAddChartModal();
  }

  onComponentSelected(componentType: string) {
    this.selectedComponent = componentType;
    console.log('Selected component:', componentType);
  }

  onChartAdded() {
    // When a chart is added (either through header or canvas button)
    this.selectedComponent = 'table';
  }
}