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
export class BarChartComponent implements OnInit {
  @Input() title: string = 'Bar Chart';
  @Input() data: any[] = [];

  barChartData!: ChartData<'bar'>;
  barChartOptions: ChartOptions<'bar'> = {
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
        },
        ticks: {
          maxRotation: 45,
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
    }
  };

  ngOnInit() {
    this.setupChartData();
  }

  private setupChartData() {
    // Default sample data if no data provided
    const sampleData = this.data.length > 0 ? this.data : [
      { label: 'Princess Cruise Line', value: 17 },
      { label: 'Costa Crociere S p A', value: 11 },
      { label: 'Carnival Cruise Line', value: 8 },
      { label: 'AIDA Cruises', value: 7 },
      { label: 'Holland America Line', value: 7 },
      { label: 'P&O Cruises', value: 4 }
    ];

    this.barChartData = {
      labels: sampleData.map(item => item.label),
      datasets: [{
        data: sampleData.map(item => item.value),
        backgroundColor: ['#4285f4', '#ea4335', '#fbbc04', '#34a853', '#ff6d01', '#9c27b0'],
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: 2
      }]
    };
  }
}