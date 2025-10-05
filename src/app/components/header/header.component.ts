import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Exact Looker Studio Header -->
    <header class="looker-header">
      <div class="header-content">
        <!-- Left: Logo and Title -->
        <div class="header-left">
          <div class="logo">📊</div>
          <span class="report-title">Untitled Report</span>
        </div>
        
        <!-- Center: Menu Items -->
        <nav class="header-nav">
          <span class="nav-item">File</span>
          <span class="nav-item">Edit</span>
          <span class="nav-item">View</span>
          <span class="nav-item">Insert</span>
          <span class="nav-item">Page</span>
          <span class="nav-item">Arrange</span>
          <span class="nav-item">Resource</span>
          <span class="nav-item">Help</span>
        </nav>
        
        <!-- Right: Action Buttons -->
        <div class="header-right">
          <button class="header-btn reset-btn">
            <span class="icon">↺</span>
            Reset
          </button>
          
          <button class="header-btn share-btn">
            <span class="icon">�</span>
            Share
            <span class="dropdown-arrow">▼</span>
          </button>
          
          <button class="header-btn primary view-btn">
            <span class="icon">👁️</span>
            View
          </button>
          
          <button class="header-btn icon-only">⋮</button>
          <button class="header-btn icon-only">❓</button>
          
          <div class="user-avatar">R</div>
        </div>
      </div>
    </header>
    
    <!-- Main Toolbar -->
    <div class="main-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn icon-btn">↶</button>
        <button class="toolbar-btn icon-btn">↷</button>
        <button class="toolbar-btn icon-btn">🖱️</button>
        <button class="toolbar-btn icon-btn">🔍</button>
        <span class="separator"></span>
        
        <button class="toolbar-btn primary-btn">
          📄 Add page
        </button>
        
        <button class="toolbar-btn primary-btn" (click)="onAddData()">
          📊 Add data
        </button>
        
        <button class="toolbar-btn">
          ⚫ Blend
        </button>
        
        <button class="toolbar-btn dropdown-btn" (click)="onAddChart()">
          📈 Add a chart ▼
        </button>
        
        <button class="toolbar-btn dropdown-btn">
          🎛️ Add a control ▼
        </button>
        
        <span class="separator"></span>
        
        <button class="toolbar-btn icon-btn">📋</button>
        <button class="toolbar-btn icon-btn">&lt;/&gt;</button>
        <button class="toolbar-btn icon-btn">📏</button>
        
        <span class="separator"></span>
        
        <button class="toolbar-btn icon-btn">⊞</button>
      </div>
      
      <div class="toolbar-right">
        <span class="theme-text" (click)="onThemePanel()">Theme and layout</span>
        <button class="toolbar-btn pause-btn">
          ⏸️ Pause updates
        </button>
      </div>
    </div>
  `,
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() addDataClicked = new EventEmitter<void>();
  @Output() addChartClicked = new EventEmitter<void>();
  @Output() themePanelClicked = new EventEmitter<void>();

  onAddData() {
    this.addDataClicked.emit();
  }

  onAddChart() {
    this.addChartClicked.emit();
  }

  onThemePanel() {
    this.themePanelClicked.emit();
  }
}