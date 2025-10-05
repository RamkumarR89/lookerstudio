import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TableData {
  opco: string;
  recordCount: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-table-container" [class.selected]="isSelected" (click)="onSelect()">
      <table class="data-table">
        <thead>
          <tr>
            <th>OPCO</th>
            <th>Record Count ▼</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of tableData; let i = index" [class.highlighted]="i === 4">
            <td>{{ row.opco }}</td>
            <td class="number-cell">{{ row.recordCount }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- Selection Handles -->
      <div class="selection-handles" *ngIf="isSelected">
        <div class="handle top-left"></div>
        <div class="handle top-right"></div>
        <div class="handle bottom-left"></div>
        <div class="handle bottom-right"></div>
        <div class="handle top-center"></div>
        <div class="handle bottom-center"></div>
        <div class="handle left-center"></div>
        <div class="handle right-center"></div>
      </div>
      
      <!-- Page indicator -->
      <div class="page-indicator">1 - 6 / 6</div>
    </div>
  `,
  styles: [`
    .data-table-container {
      position: relative;
      width: 320px;
      height: 240px;
      background: white;
      border: 1px solid #dadce0;
      border-radius: 4px;
      margin: 20px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &.selected {
        border: 2px solid #1a73e8;
        box-shadow: 0 0 0 1px #1a73e8;
      }
      
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
    
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
      
      th {
        background: #f8f9fa;
        padding: 8px 12px;
        text-align: left;
        font-weight: 500;
        color: #202124;
        border-bottom: 1px solid #e8eaed;
        
        &:last-child {
          text-align: right;
        }
      }
      
      td {
        padding: 6px 12px;
        border-bottom: 1px solid #f1f3f4;
        color: #202124;
        
        &.number-cell {
          text-align: right;
          font-variant-numeric: tabular-nums;
        }
      }
      
      tr {
        &:hover {
          background: #f8f9fa;
        }
        
        &.highlighted {
          background: #e3f2fd;
        }
      }
    }
    
    .selection-handles {
      .handle {
        position: absolute;
        width: 8px;
        height: 8px;
        background: #1a73e8;
        border: 1px solid white;
        border-radius: 2px;
        
        &.top-left { top: -4px; left: -4px; cursor: nw-resize; }
        &.top-right { top: -4px; right: -4px; cursor: ne-resize; }
        &.bottom-left { bottom: -4px; left: -4px; cursor: sw-resize; }
        &.bottom-right { bottom: -4px; right: -4px; cursor: se-resize; }
        &.top-center { top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
        &.bottom-center { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
        &.left-center { left: -4px; top: 50%; transform: translateY(-50%); cursor: w-resize; }
        &.right-center { right: -4px; top: 50%; transform: translateY(-50%); cursor: e-resize; }
      }
    }
    
    .page-indicator {
      position: absolute;
      bottom: 4px;
      right: 8px;
      font-size: 10px;
      color: #5f6368;
      background: rgba(255, 255, 255, 0.9);
      padding: 2px 4px;
      border-radius: 2px;
    }
  `]
})
export class DataTableComponent {
  @Input() isSelected = false;
  @Output() selected = new EventEmitter<void>();

  tableData: TableData[] = [
    { opco: 'Princess Cruise Line', recordCount: 17 },
    { opco: 'Holland America Line', recordCount: 11 },
    { opco: 'Carnival Cruise Line', recordCount: 8 },
    { opco: 'AIDA Cruises', recordCount: 7 },
    { opco: 'Costa Crociere S.p.A', recordCount: 7 },
    { opco: 'P&O Cruises', recordCount: 4 }
  ];

  onSelect() {
    this.selected.emit();
  }
}