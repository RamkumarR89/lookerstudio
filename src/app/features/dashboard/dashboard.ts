import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { ReportCanvasComponent } from '../../components/report-canvas/report-canvas.component';
import { ThemePanelComponent } from '../../components/theme-panel/theme-panel.component';
import { AddDataModalComponent } from '../../components/add-data-modal/add-data-modal.component';
import { AddChartModalComponent } from '../../components/add-chart-modal/add-chart-modal.component';
import { PropertiesPanelComponent } from '../../components/properties-panel/properties-panel.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, SidebarComponent, ReportCanvasComponent, ThemePanelComponent, AddDataModalComponent, AddChartModalComponent],
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
      <div class="main-layout">
        <!-- Report Canvas (Left) -->
        <div class="canvas-area">
          <app-report-canvas 
            (componentSelected)="onComponentSelected($event)">
          </app-report-canvas>
        </div>

        <!-- Right Side: Vertical Tabs and Data Panel -->
        <div class="sidebar-tabs-layout">
          <!-- Tab Content Panel (Data/Properties/Filter) -->
          <div class="sidebar-tab-content">
            <app-sidebar 
              [isVisible]="true"
              [selectedComponent]="selectedComponent"
              [panelType]="sidebarPanelType"
              (toggleSidebar)="toggleRightDataPanel()"
              (addDataClicked)="openAddDataModal()">
            </app-sidebar>
          </div>
          <!-- Vertical Tab Bar -->
          <div class="sidebar-tab-bar">
            <button class="vertical-tab" [class.active]="activeSidebarTab === 'data'" (click)="activeSidebarTab = 'data'">
              <div class="tab-icon">📊</div>
              <div class="tab-label">Data</div>
            </button>
            <button class="vertical-tab" [class.active]="activeSidebarTab === 'properties'" (click)="activeSidebarTab = 'properties'">
              <div class="tab-icon">🖊️</div>
              <div class="tab-label">Properties</div>
            </button>
            <button class="vertical-tab" [class.active]="activeSidebarTab === 'filter'" (click)="activeSidebarTab = 'filter'">
              <div class="tab-icon">⚒️</div>
              <div class="tab-label">Filter bar</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Theme Panel (Overlay) -->
      <app-theme-panel 
        [isVisible]="showThemePanel"
        (closePanel)="closeThemePanel()"
        (themeSelected)="onThemeSelected($event)">
      </app-theme-panel>
      
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
  showAddDataModal = false;
  showAddChartModal = false;
  showThemePanel = false;
  showRightDataPanel = true;
  showRightPropertiesPanel = true;
  selectedTheme: 'edge' | 'constellation' | 'groovy' = 'edge';
  selectedComponent: string | null = null;
  activeSidebarTab: 'data' | 'properties' | 'filter' = 'data';

  get sidebarPanelType(): 'data' | 'properties' {
    return this.activeSidebarTab === 'properties' ? 'properties' : 'data';
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