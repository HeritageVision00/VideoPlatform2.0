import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbColorHelper, NbThemeService, NbWindowService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import JSMpeg from '@cycjimmy/jsmpeg-player';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { ImagebigComponent } from '../imagebig/imagebig.component';


@Component({
  selector: 'ngx-tamper',
  templateUrl: './tamper.component.html',
  styleUrls: ['./tamper.component.scss']
})
export class TamperComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  tamper: any = [];
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

  video: boolean = false;
  rtspIn: any;
  link: string;

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
    this.face.checkVideo(27, this.camera).subscribe(
      (res) => {
        this.video = res["video"];
        this.link = res["http_out"];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(
          res["http_out"]
        );
      },
      (err) => console.error(err)
    );
      this.serv.tamper(this.camera,l).subscribe(
        res=>{
          this.tamper = res['data']
          for(var m of this.tamper.raw){
            m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss')
            m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/alerts/' + m['cam_id'] + '/' + m['movie']);
            m["picture"] = this.sanitizer.bypassSecurityTrustUrl(
              api +
                "/pictures/" +
                this.now_user["id_account"] +
                "/" +
                m["id_branch"] +
                "/alerts/" +
                m["cam_id"] +
                "/" +
                m["picture"]
            );
            switch(m['alert_type']){
              case '0':{
                m['alert_type'] = 'Low';
                break;
              }
              case '1':{
                m['alert_type'] = 'Mid';
                break;
              }
              case '2':{
                m['alert_type'] = 'High';
                break;
              }
            }
          }
          this.source = this.tamper.raw.slice().sort((a, b) => +new Date(b.time) + +new Date(a.time))

          let labels = []
          for(var o of Object.keys(this.tamper.over)){
            o = o + ':00:00'
            labels.push(this.datepipe.transform(o, 'yyyy-M-dd HH:mm'))
          }

          this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;

            this.dataL = {
              labels: labels,
              datasets: [{
                label: 'Camera Tampering over time',
                backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
                data: Object.values(this.tamper.over),
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
          this.tamper = undefined;
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
        title: 'PICTURE',
        type: 'custom',
        filter: false,
        renderComponent: ButtonViewComponentPic,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string)  => {
          });
        },
      },
      time: {
        title: 'TIME',
        type: 'string',
        filter: false
      },
      cam_name: {
        title: 'CAM',
        type: 'string',
        filter: false
      },
      alert_type: {
        title: 'SEVERITY',
        type: 'string',
        filter: false
      }
    },
  };

}

@Component({
  styles: [''],
  template: `
    <img [src]="rowData.picture" width='60' height='60' (click)="openIm()" style='cursor: pointer;'>
  `,
})
export class ButtonViewComponentPic implements ViewCell, OnInit {

  constructor(
    private windowService: NbWindowService
  ){
  }

  openIm(){
    this.windowService.open(ImagebigComponent, { title: `View image for ${this.rowData.camera_name || this.rowData.cam_name}`, context: { data: this.rowData} });
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}
