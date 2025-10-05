import { Component, Input, OnInit } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartData, ChartOptions, PointElement, LinearScale, Tooltip, Legend, ScatterController } from 'chart.js';
import { CommonModule } from '@angular/common';

// Register Chart.js components
Chart.register(PointElement, LinearScale, Tooltip, Legend, ScatterController);

@Component({
  selector: 'app-scatter-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="scatter-chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="chart-wrapper">
        <canvas 
          baseChart 
          [data]="scatterChartData" 
          type="scatter"
          [options]="scatterChartOptions">
        </canvas>
      </div>
    </div>
  `,
  styles: [`
    .scatter-chart-container {
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
export class ScatterChartComponent implements OnInit {
  @Input() title: string = 'Distribution of MT QTY by EXWH PRICE';
  @Input() data: any[] = [];

  scatterChartData!: ChartData<'scatter'>;
  scatterChartOptions: ChartOptions<'scatter'> = {
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
        display: true,
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 10,
            family: 'Google Sans'
          },
          padding: 8
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: (${context.parsed.x}, ${context.parsed.y})`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'MT QTY',
          font: {
            size: 10,
            family: 'Google Sans'
          }
        },
        grid: {
          color: '#f1f3f4'
        },
        ticks: {
          font: {
            size: 9
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'EXWH PRICE',
          font: {
            size: 10,
            family: 'Google Sans'
          }
        },
        grid: {
          color: '#f1f3f4'
        },
        ticks: {
          font: {
            size: 9
          }
        }
      }
    },
    elements: {
      point: {
        radius: 3,
        hoverRadius: 5,
        backgroundColor: '#4285f4',
        borderColor: '#4285f4'
      }
    }
  };

  ngOnInit() {
    this.setupChartData();
  }

  private setupChartData() {
    // Generate scatter plot data similar to Looker Studio example
    const sampleData = this.data.length > 0 ? this.data : this.generateScatterData();

    this.scatterChartData = {
      datasets: [{
        label: 'SHIP',
        data: sampleData,
        backgroundColor: '#4285f4',
        borderColor: '#4285f4',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    };
  }

  private generateScatterData() {
    // Generate sample data that looks like the Looker Studio scatter plot
    const data = [];
    
    // Main cluster around lower values (like in the screenshot)
    for (let i = 0; i < 15; i++) {
      data.push({
        x: Math.random() * 5000 + 1000, // MT QTY between 1000-6000
        y: Math.random() * 500 + 200    // EXWH PRICE between 200-700
      });
    }
    
    // A few outliers at higher values
    data.push({ x: 60000, y: 400 }); // High MT QTY outlier
    data.push({ x: 75000, y: 1800 }); // High value outlier
    
    return data;
  }
}