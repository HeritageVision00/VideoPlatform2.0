import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbColorHelper, NbThemeService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';


@Component({
  selector: 'ngx-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.scss', '../smart-table.scss']
})
export class VaultComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  vault: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private theme: NbThemeService,
    private route: Router
  ) { }
  single: any;
  colorScheme: any;
  source:any = new LocalDataSource();
  dataL: any;
  optionsL: any;

  ngOnDestroy(){
    if(this.player != undefined){
      this.player.destroy()
      this.face.cameraStop().subscribe(
        res =>{
        },
        err=> console.error(err)
      )
    }
  }

  ngOnInit(): void {
    if(api.length <= 1){
      setTimeout(()=>{
        this.face.camera({id: this.camera}).subscribe(
          res =>{
            this.player = new JSMpeg.Player(`ws://localhost:${res['port']}`, {
              canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
            })
          },
          err=> console.error(err)
        )
      },500)
    }
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    var time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0,3);
    this.timezone = parseInt(this.timezone);
    let p = ''
    if(this.timezone > 0){
      p = '+'
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
    let type;
    if(this.now_user.id_branch != '0000'){
      type = 'cam_id';
    }else{
      type = 'id_account'
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type
    }
      this.serv.vault(this.camera,l).subscribe(
        res=>{
          this.vault = res['data']
          for(var m of this.vault.org){
            m['picture']  = this.sanitizer.bypassSecurityTrustUrl(api + "/pictures/" + this.now_user['id_account']+'/' + m['id_branch']+'/vault/' + m['cam_id'] + '/' + m['picture'])
            m['time_in'] = this.datepipe.transform(m['time_in'], 'yyyy-M-dd HH:mm:ss')
            m['time_out'] = this.datepipe.transform(m['time_out'], 'yyyy-M-dd HH:mm:ss')
          }
          this.source = this.vault.org.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))

          let labels = []
          for(var o of Object.keys(this.vault.over)){
            o = o + ':00:00'
            labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm'))
          }

          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.dataL = {
              labels: labels,
              datasets: [{
                label: 'Openings and Closings Over Time',
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.vault.over),
                borderColor: colors.primary,
              }],
            };
      
            this.optionsL = {
              responsive: true,
              maintainAspectRatio: false,
              legend: {
                display: false,
                position: 'bottom',
                labels: {
                  fontColor: chartjs.textColor,
                },
              },
              hover: {
                mode: 'index',
              },
              scales: {
                xAxes: [
                  {
                    display: false,
                    scaleLabel: {
                      display: false,
                      labelString: 'Month',
                    },
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
                yAxes: [
                  {
                    display: true,
                    scaleLabel: {
                      display: false,
                      labelString: 'Value',
                    },
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
              },
            };

          });
        },
        err => {
          console.error(err)
          this.vault = undefined;
        }
      )

  }
  got(id){
    this.route.navigate([`/pages/tickets`])
    // this.route.navigateByUrl(`/pages/tickets/view/${id.data.id}`)
  }
  settings = {
    mode: 'external',
    actions: {
      position: 'right',
      columnTitle: 'ACTIONS',
      add: false,
      edit: true,
      delete: false,
    },
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
        title: 'PHOTO',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`)
          });
        }
      },
      time_in: {
        title: 'OPEN TIME',
        type: 'string',
        filter: false
      },
      time_out: {
        title: 'CLOSE TIME',
        type: 'string',
        filter: false
      },
      duration: {
        title: 'DURATION',
        type: 'string',
        filter: false
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
export class ButtonViewComponent implements ViewCell, OnInit {

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}

