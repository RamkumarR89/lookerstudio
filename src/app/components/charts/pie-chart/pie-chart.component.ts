import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, ArcElement, Tooltip, Legend, PieController } from 'chart.js';
import { CommonModule } from '@angular/common';

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, PieController);

@Component({
  selector: 'app-pie-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="pie-chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas 
          baseChart 
          [data]="pieChartData" 
          type="pie"
          [options]="pieChartOptions">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .pie-chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 20px;
      background: #fff;
    }
    .chart-title {
      margin: 0 0 16px 0;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      text-align: left;
      font-family: 'Google Sans', Roboto, sans-serif;
      border-bottom: 1px solid #f1f3f4;
      padding-bottom: 12px;
    }
    .chart-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 180px;
      position: relative;
    }
  `]
})
export class PieChartComponent implements OnInit {
  @Input() title: string = 'Pie Chart';
  @Input() data: any[] = [];

  pieChartData!: ChartData<'pie'>;
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
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
      { label: 'Holland America', value: 11 },
      { label: 'Carnival Cruise', value: 8 },
      { label: 'AIDA Cruises', value: 7 },
      { label: 'Costa Crociere', value: 7 },
      { label: 'P&O Cruises', value: 4 }
    ];

    this.pieChartData = {
      labels: sampleData.map(item => item.label),
      datasets: [{
        data: sampleData.map(item => item.value),
        backgroundColor: [
          '#FF6384',
          '#36A2EB', 
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }
}