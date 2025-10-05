import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController } from 'chart.js';
import { CommonModule } from '@angular/common';

// Register Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, BarController);

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="bar-chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas 
          baseChart 
          [data]="barChartData" 
          type="bar"
          [options]="barChartOptions">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .bar-chart-container {
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
export class BarChartComponent implements OnInit {
  @Input() title: string = 'Bar Chart';
  @Input() data: any[] = [];

  barChartData!: ChartData<'bar'>;
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed.y}`;
          }
        }
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
    }
  };

  ngOnInit() {
    this.setupChartData();
  }

  private setupChartData() {
    // Default sample data if no data provided
    const sampleData = this.data.length > 0 ? this.data : [
      { label: 'Princess', value: 17 },
      { label: 'Holland', value: 11 },
      { label: 'Carnival', value: 8 },
      { label: 'AIDA', value: 7 },
      { label: 'Costa', value: 7 },
      { label: 'P&O', value: 4 }
    ];

    this.barChartData = {
      labels: sampleData.map(item => item.label),
      datasets: [{
        data: sampleData.map(item => item.value),
        backgroundColor: '#36A2EB',
        borderColor: '#2196F3',
        borderWidth: 1,
        borderRadius: 4
      }]
    };
  }
}