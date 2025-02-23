import { Component, Input, OnInit,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-linegraphs',
  templateUrl: './linegraphs.component.html',
  styleUrls: ['./linegraphs.component.scss']
})
export class LinegraphsComponent implements OnInit {
  @Input() tabes:string[]=[];
  @Output() ontabchange= new EventEmitter <number>();
  activetab:number=0;

  constructor() { }

  ngOnInit(): void {
  }
  settab(indexx:number){
    this.activetab=indexx;
    this.ontabchange.emit(this.activetab)

  }

}
