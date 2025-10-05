
export interface ChartPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartData {
  id: string;
  type: 'pie' | 'bar' | 'line' | 'table';
  title: string;
  data: any[];
  position?: ChartPosition;
  gridsterItem?: import('angular-gridster2').GridsterItem;
}


import { Component, Input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

export interface ChartPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ChartData {
  id: string;
  type: 'pie' | 'bar' | 'line' | 'table';
  title: string;
  data: any[];
  position?: ChartPosition;
  gridsterItem?: import('angular-gridster2').GridsterItem;
}

@Component({
  selector: 'app-draggable-chart',
  standalone: true,
  imports: [CdkDrag],
  template: `
    <div class="draggable-chart"
         cdkDrag
         cdkDragBoundary=".canvas-area"
         [style.width.px]="chartData.position?.width"
         [style.height.px]="chartData.position?.height"
         [style.transform]="getTransform()">
      <div class="chart-header">
        <h3>{{ chartData.title }}</h3>
      </div>
      <div class="chart-content">
        <!-- Chart rendering logic here -->
          @if (chartData.type === 'pie') {
            Pie Chart
          }
          @if (chartData.type === 'bar') {
            Bar Chart
          }
          @if (chartData.type === 'line') {
            Line Chart
          }
          @if (chartData.type === 'table') {
            Table Chart
          }
      </div>
    </div>
  `,
  styleUrl: './draggable-chart.component.scss'
})
export class DraggableChartComponent {
  @Input() chartData!: ChartData;

  getTransform(): string {
    if (this.chartData.gridsterItem) {
      // Gridster handles positioning, so no transform needed
      return '';
    }
    if (this.chartData.position) {
      return `translate3d(${this.chartData.position.x}px, ${this.chartData.position.y}px, 0)`;
    }
    return '';
  }
}