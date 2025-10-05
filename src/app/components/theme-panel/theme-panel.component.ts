import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theme-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="theme-layout-panel" [class.show]="isVisible">
      <div class="panel-header">
        <h3>✏️ Theme and Layout</h3>
        <button class="close-btn" (click)="onClose()">×</button>
      </div>
      
      <div class="panel-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'theme'" (click)="activeTab = 'theme'">
          Theme
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'layout'" (click)="activeTab = 'layout'">
          Layout
        </button>
      </div>
      
      <div class="panel-content">
        <!-- Theme Tab -->
        <div class="tab-content" [class.active]="activeTab === 'theme'">
          <div class="theme-cards">
            <div class="theme-card" [class.selected]="selectedTheme === 'edge'" (click)="selectTheme('edge')">
              <div class="theme-preview edge-theme">
                <div class="preview-header">
                  <span class="preview-title">Text</span>
                  <div class="preview-charts">
                    <div class="bar-chart">
                      <div class="bar" style="height: 60%; background: #4285f4;"></div>
                      <div class="bar" style="height: 80%; background: #ea4335;"></div>
                      <div class="bar" style="height: 40%; background: #fbbc04;"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="theme-name">Edge</div>
            </div>

            <div class="theme-card" [class.selected]="selectedTheme === 'constellation'" (click)="selectTheme('constellation')">
              <div class="theme-preview constellation-theme">
                <div class="preview-header">
                  <span class="preview-title">Text</span>
                  <div class="preview-charts">
                    <div class="bar-chart">
                      <div class="bar" style="height: 60%; background: #4fc3f7;"></div>
                      <div class="bar" style="height: 80%; background: #ffb74d;"></div>
                      <div class="bar" style="height: 40%; background: #81c784;"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="theme-name">Constellation</div>
            </div>
          </div>
        </div>

        <!-- Layout Tab -->
        <div class="tab-content" [class.active]="activeTab === 'layout'">
          <div class="layout-section">
            <h4>Layout mode</h4>
            <div class="radio-group">
              <label class="radio-option">
                <input type="radio" name="layoutMode" value="freeform" [(ngModel)]="layoutMode">
                <span class="radio-label">Freeform</span>
              </label>
              <label class="radio-option">
                <input type="radio" name="layoutMode" value="responsive" [(ngModel)]="layoutMode">
                <span class="radio-label">Responsive</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './theme-panel.component.scss'
})
export class ThemePanelComponent {
  @Input() isVisible = false;
  @Output() closePanel = new EventEmitter<void>();
  @Output() themeSelected = new EventEmitter<string>();

  activeTab: 'theme' | 'layout' = 'theme';
  selectedTheme: 'edge' | 'constellation' = 'edge';
  layoutMode: 'freeform' | 'responsive' = 'freeform';

  selectTheme(theme: 'edge' | 'constellation') {
    this.selectedTheme = theme;
    this.themeSelected.emit(theme);
  }

  onClose() {
    this.closePanel.emit();
  }
}