import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tree-list',
  template: `
    <ul *ngIf="data"  class="list-group">
      <li *ngFor="let item of data" class="list-group-item">
        <p> {{item.children? '↘': '' }} {{ item.name }}</p>
        <app-tree-list [data]="item.children"></app-tree-list>
      </li>
    </ul>
  `,
  styles: []
})
export class TreeListComponent {
  @Input() data: any[];
}
