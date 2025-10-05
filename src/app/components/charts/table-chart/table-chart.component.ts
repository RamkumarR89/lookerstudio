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
      padding: 16px;
    }
    .chart-title {
      margin: 0 0 12px 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #333;
      text-align: center;
    }
    .table-wrapper {
      flex: 1;
      overflow: auto;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    .data-table th,
    .data-table td {
      padding: 8px 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .data-table th {
      background-color: #f5f5f5;
      font-weight: 600;
      color: #555;
    }
    .data-table tbody tr:hover {
      background-color: #f9f9f9;
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