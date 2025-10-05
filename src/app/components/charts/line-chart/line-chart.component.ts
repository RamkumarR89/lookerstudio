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
    .chart-wrapper {
      flex: 1;
      display: flex;
      align-items: stretch;
      justify-content: center;
      position: relative;
      min-height: 0;
      width: 100%;
      overflow: hidden;
    }
    .chart-wrapper canvas {
      max-height: 100% !important;
      max-width: 100% !important;
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
    resizeDelay: 0,
    animation: {
      duration: 0
    },
    layout: {
      padding: {
        top: 10,
        bottom: 5,
        left: 5,
        right: 5
      }
    },
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
        },
        ticks: {
          font: {
            size: 10
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          font: {
            size: 10
          }
        }
      }
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 3,
        hoverRadius: 5
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