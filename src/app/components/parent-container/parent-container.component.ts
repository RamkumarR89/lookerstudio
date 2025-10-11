import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-parent-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="chart-container" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f0f0f0; border-radius: 8px;">
      <div style="text-align: center; padding: 20px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Sample Chart Widget</h3>
        <div style="width: 80px; height: 80px; background: linear-gradient(45deg, #4285f4, #34a853); border-radius: 50%; margin: 0 auto 10px auto;"></div>
        <p style="margin: 0; color: #666; font-size: 12px;">Dynamic Component Loaded</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .chart-container {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
  `]
})
export class ParentContainerComponent implements OnInit {

  ngOnInit() {
    console.log('ParentContainerComponent loaded dynamically');
  }
}