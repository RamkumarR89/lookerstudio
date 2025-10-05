import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, LineController } from 'chart.js';
import { CommonModule } from '@angular/common';

// Register Chart.js components
Chart.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, LineController);

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="line-chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas 
          baseChart 
          [data]="lineChartData" 
          type="line"
          [options]="lineChartOptions">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .line-chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 16px;
    }
    .chart-title {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      text-align: center;
    }
    .chart-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
    }
  `]
})
export class LineChartComponent implements OnInit {
  @Input() title: string = 'Line Chart';
  @Input() data: any[] = [];

  lineChartData!: ChartData<'line'>;
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  ngOnInit() {
    this.setupChartData();
  }

  private setupChartData() {
    // Default sample data if no data provided
    const sampleData = this.data.length > 0 ? this.data : [
      { label: 'Jan', value: 17 },
      { label: 'Feb', value: 11 },
      { label: 'Mar', value: 8 },
      { label: 'Apr', value: 7 },
      { label: 'May', value: 12 },
      { label: 'Jun', value: 15 }
    ];

    this.lineChartData = {
      labels: sampleData.map(item => item.label),
      datasets: [{
        data: sampleData.map(item => item.value),
        borderColor: '#FF6384',
        backgroundColor: 'rgba(255, 99, 132, 0.1)',
        fill: true,
        borderWidth: 2
      }]
    };
  }
}