import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbThemeService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { SeverityComponent } from '../../severity/severity.component';
import { utils, writeFileXLSX } from 'xlsx';
import { v4 as uuidv4 } from 'uuid';
import { WindowOpenerComponent } from '../window-opener/window-opener.component';

@Component({
  selector: 'ngx-ppe',
  templateUrl: './ppe.component.html',
  styleUrls: ['./ppe.component.scss']
})
export class PpeComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  ppe: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};
  algo_id: number = 71;

  @ViewChild('streaming', { static: false }) streamingcanvas: ElementRef;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router,
    private theme: NbThemeService,
  ) { }
  single: any;
  colorScheme: any;
  source: any = new LocalDataSource();
  dataL: any;
  optionsL: any;
  rtspIn: any;

  ngOnDestroy() {
    if (this.player !== undefined) {
      this.player.destroy();
      this.face.cameraStop().subscribe(
        res => {
        },
        err => console.error(err),
      );
    }
  }

  @ViewChild('videoPlayer', { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  videoFile: string = '';
  pass(vid: string) {
    this.videoplayer.nativeElement.src = vid;
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();

  }

  video: boolean = false;

  ngOnInit(): void {
    // // if(api.length <= 4){
    //   if(api.length <= 1){
    //   setTimeout(()=>{
    //     this.face.camera({id: this.camera}).subscribe(
    //       res =>{
    //         console.log(res)
    //         this.player = new JSMpeg.Player(`ws://localhost:${res['port']}`, {
    //           canvas: this.streamingcanvas.nativeElement, autoplay: true, audio: false, loop: true
    //         })
    //       },
    //       err=> console.error(err)
    //     )
    //   },500)
    // }
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    this.timezone = this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    let type;
    if (this.now_user.id_branch !== '0000') {
      type = 'cam_id';
    } else {
      type = 'id_account';
    }
    const l = {
      start: this.range.start,
      end: this.range.end,
      type: type,
    };
    this.face.checkVideo(this.algo_id, this.camera).subscribe(
      res => {
        this.video = res['video'];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(res['http_out']);
        if (this.video === true) {
          this.settings['columns']['picture'] = {
            title: 'VIDEO',
            type: 'custom',
            filter: false,
            renderComponent: ButtonViewComponent,
            onComponentInitFunction: (instance) => {
              instance.save.subscribe((row: string)  => {
                this.pass(row);
              });
            },
          };
          this.settings = Object.assign({}, this.settings);
        }
      }, err => console.error(err),
    );
    this.serv.ppe(this.camera, l).subscribe(
      res => {
        this.ppe = res['data'];
        for (const m of this.ppe.raw) {
          m['picture'] = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/ppe/' + m['cam_id'] + '/' + m['picture']);
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss',this.timezone);
          m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/ppe/' + m['cam_id'] + '/' + m['movie']);
        }
        this.source = this.ppe.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
        const labels = []
        for (let o of Object.keys(this.ppe.alerts[0])){
          o = o + ':00';
          labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm',this.timezone));
        }
  
        this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
          const colors: any = config.variables;
          const cols = {
            0: colors.primary,
            1: colors.warning,
            2: colors.success,
            3: colors.info,
            4: colors.danger
          }
          const chartjs: any = config.variables.chartjs;
          const datasetsLow = []
          for(let i = 0; i < this.ppe.alerts.length; i++){
            let r:string
            switch (i) {
              case 0: {
                r = 'No equipment'
                break
              }
              case 1: {
                r = 'No helmet'
                break
              }
              case 2: {
                r = 'No vest'
                break
              }
            }
            datasetsLow.push({
              label: `${r}`,
              data: Object.values(this.ppe.alerts[i]),
              borderColor: cols[i],
              backgroundColor: cols[i],
              fill: false,
              pointRadius: 2,
              pointHoverRadius: 5,
            })

          }
          this.dataL = {
            labels: labels,
            datasets: datasetsLow,
          };

          this.options = {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
              position: "bottom",
              labels: {
                fontColor: chartjs.textColor,
              },
            },
            hover: {
              mode: "index",
            },
            scales: {
              xAxes: [
                {
                  display: false,
                  scaleLabel: {
                    display: false,
                    labelString: "Month",
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
                    display: true,
                    // labelString: 'Value',
                  },
                  gridLines: {
                    display: true,
                    color: chartjs.axisLineColor,
                  },
                  ticks: {
                    fontColor: chartjs.textColor,
                    beginAtZero: true,
                    stepSize: 1
                  },
                },
              ],
            },
          };
        })
      },
      err => {
        console.error(err);
        this.ppe = undefined;
      },
    );

  }
  got(id) {
    this.route.navigate([`/pages/tickets`]);
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
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: 'No data found',
    columns: {
      picture: {
        title: 'PHOTO',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
      movie: {
        title: 'VIDEO',
        type: 'custom',
        filter: false,
        renderComponent: WindowOpenerComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
      time: {
        title: 'TIME',
        type: 'string',
        filter: false,
      },
      cam_name: {
        title: 'CAM',
        type: 'string',
        filter: false,
      },
      // alert_type: {
      //   title: 'SEVERITY',
      //   type: 'custom',
      //   filter: false,
      //   renderComponent: SeverityComponent,
      //   onComponentInitFunction(instance) {
      //     instance.save.subscribe(row => {
      //       alert(`${row.name} saved!`);
      //     });
      //   },
      // },
      // alert_message: {
      //   title: 'ALERT',
      //   type: 'string',
      //   filter: false,
      // },
      uniform_type: {
        title: 'UNIFORM',
        type: 'string',
        filter: false,
      },
    },
  };
  csvAlerts: Object = {
    alerts: false,
    count: false
  }
  showAlert: boolean = false;
  showData: boolean = false;

  async csv(algo){
    this.csvAlerts[algo] = true
    let type;
    if(this.now_user.id_branch != '0000'){
      type = 'cam_id';
    }else{
      type = 'id_account'
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type,
      ham: true,
      algo: algo
    }
    ;(await this.serv.report1(this.algo_id, this.camera, l)).subscribe(
      async (res) => {
        let data: Array<any>;
        data = res['data']
        for (let m of data) {
          m['picture'] = 'http://localhost' + api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/ppe/' + m['cam_id'] + '/' + m['picture']
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss', this.timezone);
        }
        const ws = utils.json_to_sheet(data);
        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Data");
        await writeFileXLSX(wb, `${uuidv4()}.xlsx`);
        this.csvAlerts[algo] = false
      },
      err => {
        console.error(err)
        this.csvAlerts[algo] = false
        if(algo === 'count'){
          this.showData = true;
        }
        if(algo === 'alerts'){
          this.showAlert = true;
        }
      }
    )
  }
}

@Component({
  selector: 'button-view',
  template: `
    <img [src]="rowData.picture" width='60' height='60'>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {

  constructor() {
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}

