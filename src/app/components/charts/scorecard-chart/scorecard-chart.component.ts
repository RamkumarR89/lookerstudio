import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scorecard-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="scorecard-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="scorecard-content">
        <div class="scorecard-value">{{ value | number }}</div>
        <div class="scorecard-label">{{ label }}</div>
        <div class="scorecard-change" [class.positive]="change > 0" [class.negative]="change < 0">
          <span class="change-icon">{{ change > 0 ? '↗' : change < 0 ? '↘' : '→' }}</span>
          <span class="change-value">{{ Math.abs(change) }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .scorecard-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 16px;
      background: #fff;
      box-sizing: border-box;
      overflow: hidden;
    }
    .chart-title {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 500;
      color: #202124;
      text-align: left;
      font-family: 'Google Sans', Roboto, sans-serif;
      border-bottom: 1px solid #f1f3f4;
      padding-bottom: 8px;
      flex-shrink: 0;
    }
    .scorecard-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
    .scorecard-value {
      font-size: 36px;
      font-weight: 400;
      color: #202124;
      font-family: 'Google Sans', Roboto, sans-serif;
      margin-bottom: 4px;
    }
    .scorecard-label {
      font-size: 14px;
      color: #5f6368;
      margin-bottom: 12px;
      font-family: 'Google Sans', Roboto, sans-serif;
    }
    .scorecard-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      
      &.positive {
        color: #34a853;
      }
      
      &.negative {
        color: #ea4335;
      }
      
      .change-icon {
        font-size: 14px;
      }
    }
  `]
})
export class ScorecardChartComponent implements OnInit {
  @Input() title: string = 'Key Metric';
  @Input() value: number = 1168;
  @Input() label: string = 'Total Records';
  @Input() change: number = 5.2;
  @Input() data: any[] = [];

  // Expose Math for template
  Math = Math;

  ngOnInit() {
    // Setup scorecard data if provided
    if (this.data.length > 0) {
      // Use provided data to set scorecard values
      const latestData = this.data[this.data.length - 1];
      if (latestData) {
        this.value = latestData.value || this.value;
        this.label = latestData.label || this.label;
        this.change = latestData.change || this.change;
      }
    }
  }
}