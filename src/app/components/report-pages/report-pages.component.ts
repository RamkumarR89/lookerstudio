import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ReportPage {
  id: string;
  name: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-report-pages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="report-pages-sidebar" [class.collapsed]="isCollapsed">
      
      <!-- Simple Page Numbers (like in Looker Studio) -->
      <div class="page-numbers">
        <div class="page-number-item active">1</div>
        <div class="page-number-item">2</div>
      </div>

    </div>
  `,
  styleUrl: './report-pages.component.scss'
})
export class ReportPagesComponent {
  @Input() isCollapsed = false;
  @Output() pageSelected = new EventEmitter<ReportPage>();
  @Output() sidebarToggled = new EventEmitter<void>();

  searchTerm = '';
  
  pages: ReportPage[] = [
    { id: 'page-1', name: 'Untitled Page', isActive: true },
    { id: 'page-2', name: 'Untitled Page', isActive: false }
  ];

  filteredPages = [...this.pages];

  filterPages() {
    if (!this.searchTerm.trim()) {
      this.filteredPages = [...this.pages];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredPages = this.pages.filter(page =>
      page.name.toLowerCase().includes(term)
    );
  }

  selectPage(page: ReportPage) {
    this.pages.forEach(p => p.isActive = false);
    page.isActive = true;
    this.pageSelected.emit(page);
  }

  getPageNumber(pageId: string): string {
    const index = this.pages.findIndex(p => p.id === pageId);
    return (index + 1).toString();
  }

  toggleSidebar() {
    this.sidebarToggled.emit();
  }
}