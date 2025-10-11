import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DataConnector {
  id: string;
  name: string;
  description: string;
  icon: string;
  provider: string;
  category: string;
  isPreview?: boolean;
}

@Component({
  selector: 'app-add-data-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Modal Overlay -->
    <div class="modal-overlay" *ngIf="isVisible" (click)="onClose()">
      <div class="bottom-panel show" (click)="$event.stopPropagation()">
      
      <!-- Panel Header -->
      <div class="panel-header">
        <div class="panel-title">
          <h2>Add data to report</h2>
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
        
        <!-- Tab Navigation -->
        <div class="tab-navigation">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'connect'"
            (click)="setActiveTab('connect')">
            Connect to data
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'sources'"
            (click)="setActiveTab('sources')">
            My data sources
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          
          <!-- Connect to Data Tab -->
          <div class="connect-tab" *ngIf="activeTab === 'connect'">
            
            <!-- Search Bar -->
            <div class="search-section">
              <div class="search-input">
                <span class="search-icon">🔍</span>
                <input 
                  type="text" 
                  placeholder="Search" 
                  [(ngModel)]="searchTerm"
                  (input)="filterConnectors()">
              </div>
            </div>

            <!-- Google Connectors Section -->
            <div class="connectors-section">
              <div class="section-header">
                <h3>Google Connectors ({{ filteredConnectors.length }})</h3>
                <p class="section-subtitle">Connectors built and supported by Looker Studio <a href="#" class="learn-more">Learn more</a></p>
              </div>

              <!-- Connectors Grid -->
              <div class="connectors-grid">
                <div 
                  class="connector-card" 
                  *ngFor="let connector of filteredConnectors"
                  (click)="selectConnector(connector)">
                  
                  <div class="card-header">
                    <div class="connector-icon">
                      <span [innerHTML]="connector.icon"></span>
                    </div>
                    <button class="card-menu-btn">⋯</button>
                  </div>
                  
                  <div class="card-content">
                    <h4 class="connector-name">
                      {{ connector.name }}
                      <span *ngIf="connector.isPreview" class="preview-badge">PREVIEW</span>
                    </h4>
                    <p class="connector-provider">By {{ connector.provider }}</p>
                    <p class="connector-description">{{ connector.description }}</p>
                  </div>
                  
                </div>
              </div>
            </div>

          </div>

          <!-- My Data Sources Tab -->
          <div class="sources-tab" *ngIf="activeTab === 'sources'">
            <div class="empty-state">
              <p>You haven't connected to any data sources yet.</p>
              <button class="btn-primary" (click)="setActiveTab('connect')">
                Connect to data
              </button>
            </div>
          </div>

        </div>
      </div>

      </div>
    </div>
  `,
  styleUrl: './add-data-modal.component.scss'
})
export class AddDataModalComponent {
  @Input() isVisible = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() connectorSelected = new EventEmitter<DataConnector>();

  activeTab: 'connect' | 'sources' = 'connect';
  searchTerm = '';
  isMinimized = false;
  
  connectors: DataConnector[] = [
    {
      id: 'looker',
      name: 'Looker',
      description: 'Connect to your Looker semantic models.',
      icon: '🔵',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      description: 'Connect to Google Analytics.',
      icon: '📊',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'google-ads',
      name: 'Google Ads',
      description: 'Connect to Google Ads performance report data.',
      icon: '🎯',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      description: 'Connect to Google Sheets.',
      icon: '📝',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'bigquery',
      name: 'BigQuery',
      description: 'Connect to BigQuery tables and custom queries.',
      icon: '🔷',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'appsheet',
      name: 'AppSheet',
      description: 'Connect to AppSheet app data.',
      icon: '📱',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'csv-upload',
      name: 'CSV File Upload',
      description: 'Connect to CSV (comma-separated values) files.',
      icon: '📄',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'excel',
      name: 'Microsoft Excel',
      description: 'Connect to Microsoft Excel files.',
      icon: '📗',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'amazon-redshift',
      name: 'Amazon Redshift',
      description: 'Connect to Amazon Redshift.',
      icon: '🟦',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'apigee',
      name: 'Apigee',
      description: 'Connect to Apigee API analytics and usage data.',
      icon: '⚙️',
      provider: 'Google',
      category: 'google',
      isPreview: true
    },
    {
      id: 'campaign-manager',
      name: 'Campaign Manager 360',
      description: 'Connect to Campaign Manager 360.',
      icon: '🎯',
      provider: 'Google',
      category: 'google'
    },
    {
      id: 'cloud-spanner',
      name: 'Cloud Spanner',
      description: 'Connect to Google Cloud Spanner.',
      icon: '⭐',
      provider: 'Google',
      category: 'google'
    }
  ];

  filteredConnectors = [...this.connectors];

  setActiveTab(tab: 'connect' | 'sources') {
    this.activeTab = tab;
  }

  filterConnectors() {
    if (!this.searchTerm.trim()) {
      this.filteredConnectors = [...this.connectors];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredConnectors = this.connectors.filter(connector =>
      connector.name.toLowerCase().includes(term) ||
      connector.description.toLowerCase().includes(term)
    );
  }

  selectConnector(connector: DataConnector) {
    this.connectorSelected.emit(connector);
    console.log('Selected connector:', connector);
  }

  toggleMinimized() {
    this.isMinimized = !this.isMinimized;
  }

  onClose() {
    this.closeModal.emit();
  }
}