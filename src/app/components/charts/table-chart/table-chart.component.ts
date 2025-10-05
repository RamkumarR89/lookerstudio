import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-chart-container">
      <h3 class="chart-title">{{ title }}</h3>
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Value</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let item of tableData">
              <td>{{ item.label }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.percentage }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .table-chart-container {
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
    .table-wrapper {
      flex: 1;
      overflow: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      font-family: 'Google Sans', Roboto, sans-serif;
    }
    .data-table th,
    .data-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #e8eaed;
    }
    .data-table th {
      background-color: #f8f9fa;
      font-weight: 500;
      color: #5f6368;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .data-table td {
      color: #202124;
    }
    .data-table tbody tr:hover {
      background-color: #f8f9fa;
    }
  `]
})
export class TableChartComponent implements OnInit {
  @Input() title: string = 'Data Table';
  @Input() data: any[] = [];

  tableData: any[] = [];

  ngOnInit() {
    this.setupTableData();
  }

  private setupTableData() {
    // Default sample data if no data provided
    const sampleData = this.data.length > 0 ? this.data : [
      { label: 'Princess Cruise Line', value: 17 },
      { label: 'Holland America', value: 11 },
      { label: 'Carnival Cruise', value: 8 },
      { label: 'AIDA Cruises', value: 7 },
      { label: 'Costa Crociere', value: 7 },
      { label: 'P&O Cruises', value: 4 }
    ];

    const total = sampleData.reduce((sum, item) => sum + item.value, 0);
    
    this.tableData = sampleData.map(item => ({
      label: item.label,
      value: item.value,
      percentage: ((item.value / total) * 100).toFixed(1)
    }));
  }
}