import { Component } from '@angular/core';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-draggable-list',
  standalone: true,
  imports: [CdkDropList, CdkDrag],
  template: `
    <div cdkDropList cdkDropListOrientation="mixed" class="example-list" (cdkDropListDropped)="drop($event)">
      @for (item of items; track item) {
        <div class="example-box" cdkDrag>{{item}}</div>
      }
    </div>
  `,
  styleUrl: './draggable-list.component.scss'
})
export class DraggableListComponent {
  items = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
