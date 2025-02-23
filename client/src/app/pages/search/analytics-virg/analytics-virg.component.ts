import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';

@Component({
  selector: 'ngx-analytics-virg',
  templateUrl: './analytics-virg.component.html',
  styleUrls: ['./analytics-virg.component.scss']
})
export class AnalyticsVirgComponent implements OnInit {

  constructor(
    protected windowRef: NbWindowRef,
  ){
  }

  allAct: boolean = true;
  changeAll(){
      for(const alg of this.algos){
        alg.available = this.allAct
      }
  }

  save(){
    for(const alg of this.algos){
      if(alg.available === false){
        alg.available = 0
      }else{
        alg.available = 1
      }
    }
    this.onChange(this.algos);
    this.windowRef.close();
  }

  @Input() onChange: Function;
  @Input() algos: Array<any>;
  @Output() settings: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    for(const alg of this.algos){
      if(alg.available === 0){
        alg.available = false
      }else{
        alg.available = true
      }
    }
  }
}
