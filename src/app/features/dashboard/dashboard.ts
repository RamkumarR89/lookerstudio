import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ReportCanvasComponent } from '../../components/report-canvas/report-canvas.component';
import { GridDashboard2Component } from '../../components/grid-dashboard-2/grid-dashboard-2.component';
import { DashboardPreviewModalComponent, DashboardPreviewData } from '../../components/dashboard-preview-modal/dashboard-preview-modal.component';
import { ThemePanelComponent } from '../../components/theme-panel/theme-panel.component';
import { AddDataModalComponent } from '../../components/add-data-modal/add-data-modal.component';
import { AddChartModalComponent } from '../../components/add-chart-modal/add-chart-modal.component';
import { PropertiesPanelComponent } from '../../components/properties-panel/properties-panel.component';
import { DashboardHistoryService, DashboardState } from '../../core/services/dashboard-history.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, GridDashboard2Component, DashboardPreviewModalComponent, ThemePanelComponent, AddDataModalComponent, AddChartModalComponent],
  template: `
    <!-- Clean Looker Studio Layout -->
    <div class="looker-studio">
      
      <!-- Header Section -->
      <app-header #headerComponent
        (addDataClicked)="openAddDataModal()"
        (addChartClicked)="openAddChartModal()"
        (themePanelClicked)="openThemePanel()"
        (viewClicked)="openPreviewModal()"
        (undoClicked)="onUndo($event)"
        (redoClicked)="onRedo($event)"
        (resetClicked)="onReset($event)"
        (saveClicked)="onSave()"
        (zoomChanged)="onZoomChanged($event)"
        (panReset)="onPanReset()">>>
      </app-header>

      <!-- Main Content Layout -->
      <div class="main-layout" [class.sidebar-open]="sidebarOpen" [class.content-visible]="contentVisible">
        <!-- Report Canvas (Left) -->
        <div class="canvas-area" [class.sidebar-open]="sidebarOpen" [class.content-visible]="contentVisible">
          <div class="pan-container" 
               [class.panning]="isPanning"
               [class.pannable]="currentZoom > 100"
               (mousedown)="onPanStart($event)"
               (mousemove)="onPanMove($event)"
               (mouseup)="onPanEnd()"
               (mouseleave)="onPanEnd()"
               (wheel)="onWheel($event)">
            <!-- Pan instructions overlay (shown when zoomed) -->
            <div class="pan-instructions" *ngIf="currentZoom > 100 && !isPanning">
              <span class="instruction-text">🖱️ Drag to pan • ⌨️ Arrow keys • 🎯 Center</span>
            </div>
            
            <div class="zoom-container" 
                 [style.transform]="'scale(' + currentZoom / 100 + ') translate(' + panX + 'px, ' + panY + 'px)'">
              <app-grid-dashboard-2 #gridDashboard 
                                   (dashboardChanged)="onDashboardChanged($event)"></app-grid-dashboard-2>
            </div>
          </div>
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
    
    <!-- Dashboard Preview Modal -->
    <app-dashboard-preview-modal
      [isVisible]="showPreviewModal"
      [dashboardData]="previewData"
      (closeModal)="closePreviewModal()">
    </app-dashboard-preview-modal>
  `,
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  @ViewChild('gridDashboard') gridDashboard!: GridDashboard2Component;
  @ViewChild('headerComponent') headerComponent!: HeaderComponent;
  
  constructor(private historyService: DashboardHistoryService) {}
  
  showAddDataModal = false;
  showAddChartModal = false;
  showThemePanel = false;
  showPreviewModal = false;
  showRightDataPanel = true;
  showRightPropertiesPanel = true;
  selectedTheme: 'edge' | 'constellation' | 'groovy' = 'edge';
  selectedComponent: string | null = null;
  activeSidebarTab: 'data' | 'properties' | 'filter' = 'data';
  sidebarOpen = false; // Initially hidden completely
  contentVisible = false; // Content panel visibility
  currentZoom = 100; // Zoom level percentage
  
  // Pan functionality
  isPanning = false;
  panX = 0;
  panY = 0;
  startX = 0;
  startY = 0;

  previewData: DashboardPreviewData = {
    title: 'Dashboard Report',
    lastUpdated: new Date().toLocaleDateString(),
    chartCount: 4,
    charts: []
  };

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
    // Initialize the history service with empty dashboard
    this.historyService.initializeState([], 'Initial empty dashboard');
  }

  openAddDataModal() {
    this.showAddDataModal = true;
  }

  closeAddDataModal() {
    this.showAddDataModal = false;
  }

  openAddChartModal() {
    // Use dashboard's own modal instead of grid's modal
    this.showAddChartModal = true;
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
    
    // Add the chart to the grid dashboard
    if (this.gridDashboard) {
      // Map the chart type from modal to grid format
      const chartType = this.mapChartType(chart.id || chart.name || chart);
      this.gridDashboard.addChartToGrid(chartType);
    }
    
    // Close the modal
    this.closeAddChartModal();
  }

  // Helper method to map chart types from modal to grid format
  private mapChartType(chartId: string): 'table' | 'scatter' | 'pie' | 'line' | 'bar' | 'scorecard' {
    const mapping: { [key: string]: 'table' | 'scatter' | 'pie' | 'line' | 'bar' | 'scorecard' } = {
      'table': 'table',
      'table-heatmap': 'table',
      'table-bars': 'table',
      'scorecard': 'scorecard',
      'compact-scorecard': 'scorecard',
      'bullet-chart': 'scorecard',
      'pie': 'pie',
      'bar': 'bar',
      'line': 'line',
      'scatter': 'scatter',
      // Add more mappings as needed
    };
    
    const lowercaseId = String(chartId).toLowerCase();
    return mapping[lowercaseId] || 'table';
  }

  onComponentSelected(componentType: string) {
    this.selectedComponent = componentType;
    console.log('Selected component:', componentType);
  }

  onChartAdded() {
    // When a chart is added (either through header or canvas button)
    this.selectedComponent = 'table';
  }

  openPreviewModal() {
    // Get current charts from grid dashboard
    if (this.gridDashboard && this.gridDashboard.dashboard) {
      this.previewData = {
        title: 'Dashboard Report',
        lastUpdated: new Date().toLocaleDateString(),
        chartCount: this.gridDashboard.dashboard.length,
        charts: this.gridDashboard.dashboard.map((item, index) => ({
          id: `chart-${index}`,
          type: (item.type || 'scatter') as 'pie' | 'bar' | 'line' | 'scatter' | 'table' | 'scorecard',
          title: this.getChartTitle(item.type || 'scatter'),
          x: item.x || 0,
          y: item.y || 0,
          cols: item.cols || 1,
          rows: item.rows || 1,
          data: null
        }))
      };
    }
    this.showPreviewModal = true;
  }

  private getChartTitle(type: string): string {
    const titles: { [key: string]: string } = {
      'scatter': 'Scatter Plot',
      'pie': 'Pie Chart',
      'line': 'Line Chart',
      'bar': 'Bar Chart',
      'table': 'Table Chart',
      'scorecard': 'Scorecard'
    };
    return titles[type] || 'Chart';
  }

  closePreviewModal() {
    this.showPreviewModal = false;
  }

  // History Management Methods
  onUndo(previousState: DashboardState) {
    if (this.gridDashboard && previousState.dashboardData) {
      // Restore the dashboard to the previous state
      this.gridDashboard.dashboard = [...previousState.dashboardData];
      console.log('Undo: Restored to state:', previousState.description);
    }
  }

  onRedo(nextState: DashboardState) {
    if (this.gridDashboard && nextState.dashboardData) {
      // Restore the dashboard to the next state
      this.gridDashboard.dashboard = [...nextState.dashboardData];
      console.log('Redo: Restored to state:', nextState.description);
    }
  }

  onReset(originalState: DashboardState) {
    if (this.gridDashboard && originalState.dashboardData) {
      // Reset the dashboard to the original state
      this.gridDashboard.dashboard = [...originalState.dashboardData];
      console.log('Reset: Restored to original state');
    }
  }

  onSave() {
    console.log('Dashboard saved successfully!');
    // Here you could add actual save logic (API call, localStorage, etc.)
    // For now, we just confirm the save
  }

  // Method to save current state to history (call this when charts are added/removed/modified)
  saveCurrentStateToHistory(description: string) {
    if (this.gridDashboard && this.gridDashboard.dashboard) {
      this.historyService.saveState(this.gridDashboard.dashboard, description);
    }
  }

  // Handle dashboard changes from grid component
  onDashboardChanged(event: {dashboard: any[], description: string}) {
    this.historyService.saveState(event.dashboard, event.description);
    console.log('Dashboard state saved:', event.description);
  }

  // Handle zoom changes
  onZoomChanged(zoomLevel: number) {
    this.currentZoom = zoomLevel;
    
    // Reset pan when zooming back to 100%
    if (zoomLevel <= 100) {
      this.panX = 0;
      this.panY = 0;
    }
    
    console.log('Zoom changed to:', zoomLevel + '%');
  }

  // Pan functionality
  onPanStart(event: MouseEvent) {
    if (this.currentZoom <= 100) return;
    
    this.isPanning = true;
    this.startX = event.clientX - this.panX;
    this.startY = event.clientY - this.panY;
    event.preventDefault();
  }

  onPanMove(event: MouseEvent) {
    if (!this.isPanning || this.currentZoom <= 100) return;
    
    this.panX = event.clientX - this.startX;
    this.panY = event.clientY - this.startY;
    event.preventDefault();
  }

  onPanEnd() {
    this.isPanning = false;
  }

  // Keyboard navigation for panning
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.currentZoom <= 100) return;
    
    const panStep = 20;
    let handled = false;
    
    switch (event.key) {
      case 'ArrowUp':
        this.panY += panStep;
        handled = true;
        break;
      case 'ArrowDown':
        this.panY -= panStep;
        handled = true;
        break;
      case 'ArrowLeft':
        this.panX += panStep;
        handled = true;
        break;
      case 'ArrowRight':
        this.panX -= panStep;
        handled = true;
        break;
      case 'Home':
        // Reset pan to center
        this.panX = 0;
        this.panY = 0;
        handled = true;
        break;
    }
    
    if (handled) {
      event.preventDefault();
    }
  }

  // Reset pan to center
  onPanReset() {
    this.panX = 0;
    this.panY = 0;
  }

  // Wheel/scroll panning (with Shift key for horizontal scroll)
  onWheel(event: WheelEvent) {
    if (this.currentZoom <= 100) return;
    
    event.preventDefault();
    
    const panSpeed = 2;
    
    if (event.shiftKey) {
      // Horizontal panning when Shift is held
      this.panX -= event.deltaY * panSpeed;
    } else {
      // Vertical panning (default)
      this.panY -= event.deltaY * panSpeed;
    }
  }
}