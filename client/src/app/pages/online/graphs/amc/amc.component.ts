import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { Account } from '../../../../models/Account';
import { TimezoneService } from '../../../../services/timezone.service';

@Component({
  selector: 'ngx-amc',
  templateUrl: './amc.component.html',
  styleUrls: ['./amc.component.scss']
})
export class AmcComponent implements OnInit {

  list: Object = {
    0:'Check-In for the day',
    1:'Going out for break',
    2:'Going out for meeting',
    3:'Return from break',
    4:'Return from meeting',
    5:'Check-Out/Going for Meeting',
    6:'Check-Out for the Day',
  }

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  am: any = [];
  timezone: string;
  now_user: Account;
  themeSubscription: any;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    public datepipe: DatePipe,
    private tz: TimezoneService,
  ) { }
  single: any;
  colorScheme: any;
  source:any = new LocalDataSource();
  dataL: any;
  optionsL: any;
  rel: any;
  algoId = 18;

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    this.timezone = this.tz.offSetToTimezone(new Date().getTimezoneOffset())
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: 'id_account'
    }
      this.serv.am(this.now_user['id_account'],l).subscribe(
        res=>{
          this.am = res['data']
          this.rel = res['rel']
          for(var m of this.am.raw){
            m['picture']  = this.sanitizer.bypassSecurityTrustUrl(`${api}/pictures/${this.now_user['id_account']}/${m['id_branch']}/am/${m['pName']}`)
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', this.timezone)
          }
          this.source = this.am.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))
        },
        err => {
          console.error(err)
          this.am = undefined;
        }
      )

  }

  settings = {
    mode: 'external',
    actions: false,
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager : {
      display : true,
      perPage:5
      },
    noDataMessage: "No data found",
    columns: {
      picture: {
        title: 'PICTURE',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponentPic,
        onComponentInitFunction:(instance) => {
          instance.save.subscribe((row: string)  => {
          });
        }
      },
      time: {
        title: 'TIME',
        type: 'string',
        filter: false
      },
      name: {
        title: 'NAME',
        type: 'string',
        filter: false
      },
      camId: {
        title: 'CAM',
        type: 'string',
        filter: false
      },
      event: {
        title: 'EVENT',
        type: 'string',
        filter: false,
        valuePrepareFunction: (event) => { 
          return this.list[event]
        }
      }
    },
  };

}

@Component({
  selector: 'button-view',
  template: `
    <img [src]="rowData.picture" width='60' height='60'>
  `,
})
export class ButtonViewComponentPic implements ViewCell, OnInit {

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}
