import {
  Component,
  ViewChild,
  ViewContainerRef,
  OnInit,
  AfterViewInit,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PieChartComponent } from '../charts/pie-chart/pie-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { TableChartComponent } from '../charts/table-chart/table-chart.component';
import { ScatterChartComponent } from '../charts/scatter-chart/scatter-chart.component';

@Component({
  selector: 'widget',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-template #component></ng-template>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class WidgetComponent implements OnInit, AfterViewInit {

  @ViewChild('component', {read: ViewContainerRef}) component!: ViewContainerRef;
  @Input() chartType: string = 'scatter';
  @Input() chartData: any = null;

  ngOnInit() {
    // Component initialization
  }

  ngAfterViewInit() {
    this.loadChart();
  }

  public loadChart(): void {
    // Clear any existing component
    this.component.clear();
    
    // Load the appropriate chart component based on type
    switch(this.chartType) {
      case 'scatter':
        const scatterRef = this.component.createComponent(ScatterChartComponent);
        if (this.chartData) {
          scatterRef.instance.data = this.chartData;
        }
        break;
      case 'pie':
        const pieRef = this.component.createComponent(PieChartComponent);
        if (this.chartData) {
          pieRef.instance.data = this.chartData;
        }
        break;
      case 'line':
        const lineRef = this.component.createComponent(LineChartComponent);
        if (this.chartData) {
          lineRef.instance.data = this.chartData;
        }
        break;
      case 'bar':
        const barRef = this.component.createComponent(BarChartComponent);
        if (this.chartData) {
          barRef.instance.data = this.chartData;
        }
        break;
      case 'table':
        const tableRef = this.component.createComponent(TableChartComponent);
        if (this.chartData) {
          tableRef.instance.data = this.chartData;
        }
        break;
      default:
        // Default to scatter chart
        this.component.createComponent(ScatterChartComponent);
        break;
    }
  }
}