import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'ngx-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  
  constructor() { }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if(this.rowData.reviewed != null && this.rowData.reviewed != 'null' && this.rowData.reviewed != 'NULL'){
      this.rowData.status = 1
    }else{
      this.rowData.status = 0
    }
  }
}
