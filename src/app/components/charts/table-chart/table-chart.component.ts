import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
            <tr *ngFor="let item of tableData; let i = index">
              <td>{{ item.label }}</td>
              <td>{{ item.value }}</td>
              <td>{{ item.percentage }}%</td>
            </tr>
          </tbody>
        </table>
        <p *ngIf="tableData.length === 0" class="no-data-message">No data available</p>
      </div>
    </div>
  `,
  styles: [`
    .table-chart-container {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      padding: 8px;
      background: #fff;
      box-sizing: border-box;
      overflow: hidden;
      border: none;
      border-radius: 0;
    }
    .chart-title {
      margin: 0 0 4px 0;
      font-size: 11px;
      font-weight: 500;
      color: #1a73e8;
      text-align: left;
      font-family: 'Google Sans', Roboto, sans-serif;
      border-bottom: 1px solid #f1f3f4;
      padding-bottom: 4px;
      flex-shrink: 0;
    }
    .table-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100%;
      height: calc(100% - 25px);
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11px;
      font-family: 'Google Sans', Roboto, sans-serif;
      margin: 0;
    }
    .data-table th,
    .data-table td {
      padding: 4px 8px;
      text-align: left;
      border-bottom: 1px solid #e8eaed;
    }
    .data-table th {
      background-color: #f8f9fa;
      font-weight: 500;
      color: #5f6368;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .data-table td {
      color: #202124;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100px;
    }
    .data-table tbody tr:hover {
      background-color: #f8f9fa;
    }
    .no-data-message {
      text-align: center;
      color: #5f6368;
      font-style: italic;
      padding: 20px;
      margin: 0;
    }
  `]
})
export class TableChartComponent implements OnInit, OnChanges {
  @Input() title: string = 'Data Table';
  @Input() data: any[] = [];

  tableData: any[] = [];

  ngOnInit() {
    this.setupTableData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.setupTableData();
    }
  }

  private setupTableData() {
    // Default sample data if no data provided
    const defaultSampleData = [
      { label: 'Princess Cruise Line', value: 17 },
      { label: 'Holland America', value: 11 },
      { label: 'Carnival Cruise', value: 8 },
      { label: 'AIDA Cruises', value: 7 },
      { label: 'Costa Crociere', value: 7 },
      { label: 'P&O Cruises', value: 4 }
    ];

    // Use provided data if available and not empty, otherwise use default sample data
    const sampleData = (this.data && this.data.length > 0) ? this.data : defaultSampleData;

    const total = sampleData.reduce((sum, item) => sum + item.value, 0);
    
    this.tableData = sampleData.map(item => ({
      label: item.label,
      value: item.value,
      percentage: ((item.value / total) * 100).toFixed(1)
    }));
  }
}