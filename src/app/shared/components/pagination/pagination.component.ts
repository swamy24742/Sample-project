import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  @Input() page: any;
  @Input() pageSize: any;
  @Input() maxSize: any;
  @Input() collectionSize: any;
  @Output() pageChanged = new EventEmitter<any>();

  constructor() { }

  pageChange(){
    this.pageChanged.emit(this.page);
  }

}
