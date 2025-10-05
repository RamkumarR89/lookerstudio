import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Top Header -->
    <header class="looker-header">
      <div class="header-left">
        <div class="logo">📊</div>
        <div class="report-title">
          <input type="text" value="Untitled Report" class="title-input">
        </div>
      </div>
      
      <div class="header-right">
        <button class="header-btn">💾 Save</button>
        <button class="header-btn primary">📤 Share</button>
        <button class="header-btn">👁️ View</button>
        <button class="header-btn">⋮</button>
      </div>
    </header>
    
    <!-- Main Toolbar -->
    <div class="main-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn icon-btn" title="Undo">↶</button>
        <button class="toolbar-btn icon-btn" title="Redo">↷</button>
        <div class="separator"></div>
        <div class="page-navigation">
          <span class="page-info">Page 1 of 2</span>
          <button class="nav-btn" title="Previous page">←</button>
          <button class="nav-btn" title="Next page">→</button>
        </div>
      </div>
      
      <div class="toolbar-center">
        <button class="toolbar-btn primary-btn" (click)="onAddData()">
          <span class="btn-icon">📊</span>
          Add data
        </button>
        <button class="toolbar-btn">
          <span class="btn-icon">🔄</span>
          Blend
        </button>
        <button class="toolbar-btn dropdown-btn" (click)="onAddChart()">
          <span class="btn-icon">📈</span>
          Add a chart
          <span class="dropdown-arrow">▼</span>
        </button>
        <button class="toolbar-btn dropdown-btn">
          <span class="btn-icon">🎛️</span>
          Add a control
          <span class="dropdown-arrow">▼</span>
        </button>
        <button class="toolbar-btn icon-btn" title="More options">⋮</button>
        <button class="toolbar-btn icon-btn" title="Mobile view">📱</button>
        <button class="toolbar-btn icon-btn" title="Preview">👁️</button>
      </div>
      
      <div class="toolbar-right">
        <button class="theme-layout-btn" (click)="onThemePanel()">Theme and layout</button>
        <button class="toolbar-btn">
          <span class="btn-icon">⏸️</span>
          Pause updates
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