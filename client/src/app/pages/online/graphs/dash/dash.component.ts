import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild, OnChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbColorHelper, NbDateService, NbThemeService, NbWindowService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { AccountService } from '../../../../services/account.service';
import { ReportService } from '../../../../services/report.service';
import { SeverityComponent } from '../../severity/severity.component';
import { TimezoneService } from '../../../../services/timezone.service';
import { CardComponent } from '@swimlane/ngx-charts';
import { ImagebigComponent } from '../imagebig/imagebig.component';

@Component({
  selector: 'ngx-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss', '../smart-table.scss'],
  providers: [DatePipe]
})
export class DashComponent implements OnInit , OnDestroy, OnChanges {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  @Input() analytic;
  tickets: any = [];
  player: any;
  now_user: Account;
  queue: any = {}
  pc: any = {}
  counts = {
    aod: {type: "", count: 0},
    loit: {type: "", count: 0},
    vault: {type: "", count: 0},
    violence: {type: "", count: 0},
    helm: {type: "", count: 0},
    noMask: {type: "", count: 0},
    social: {type: "", count: 0},
    intr: {type: "", count: 0}
  }

  @ViewChild('streaming', {static: false}) streamingcanvas: ElementRef; 

  constructor(
    private serv: AccountService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router,
    protected dateService: NbDateService<Date>,
    private rep: ReportService,
    private tz: TimezoneService,
  ) { }
  source:any = new LocalDataSource();
  max: Date;
  fin: Date;
  timezone: string;
  themeSubscription: any;
  dataPre: any;
  optionsPre: any;
  dataThr: any;
  optionsThr: any;
  dataBPre: any;
  optionsBPre: any;
  dataBThr: any;
  optionsBThr: any;
  premises: any;
  threats: any;

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes)
  }

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
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    var type;
    if(this.now_user.id_branch != '0000'){
      type = 'id_branch';
    }else{
      type = 'id_account'
    }
    // var l = {
    //   start: this.range.start,
    //   end: this.range.end,
    //   type: type
    // }
    const a = {
      type: 'id_branch',
      id: this.now_user.id_branch,
      cam: this.camera,
      range: {},
      order : 'DESC'
    };
    if(typeof this.analytic === 'number' ){
      a['algo_id'] = this.analytic
    }
    // console.log(this.analytic)
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    const b = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(b.setHours(b.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 58));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    
    if(this.range.end.getTime() === this.fin.getTime() && this.range.start.getTime() === this.max.getTime() && this.camera === ''){
      this.source = this.serv.tickets(a)
    }else if(this.range.end.getTime() === this.fin.getTime() && this.range.start.getTime() === this.max.getTime()){
      a.cam = this.camera
      this.source = this.serv.tickets(a)
    }else {
      a.cam = this.camera
      a.range = this.range
      this.source = this.serv.tickets(a)
    }
  }
  

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }

  videoFile:string = "";

  csvAlerts: Boolean = false
  showData: Boolean = false

  async report(){
    this.showData = false
    this.csvAlerts = true
    try{
      await this.rep.csv(this.range, -1, this.now_user, -1, 0, this.timezone)
      this.csvAlerts = false
    }catch(err){
      this.csvAlerts = false
      if(err.error === true){
        this.showData = true
      }
    }
  }
  
  pass(vid:string){
    this.videoplayer.nativeElement.src = vid    
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();
  }

  got(id){
    this.route.navigate([`/pages/tickets`])
  }
  
  settings = {
    mode: 'external',
    actions: false,
    pager: {
      perPage: 50
    },
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
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
            alert(`${row.name} saved!`);
          });
        },
      },
      type: {
        title: 'INCIDENT TYPE',
        type: 'string',
        filter: false
      },
      createdAt: {
        title: 'TIME',
        type: 'string',
        filter: false,
        valuePrepareFunction: (createdAt) => {
          createdAt = createdAt.replace(' ', 'T') + 'Z'
          const date = new Date(createdAt)
          return this.datepipe.transform(date, 'yyyy-M-dd HH:mm', this.timezone);
        }
      },
      cam_name: {
        title: 'CAMERA',
        type: 'string',
        filter: false,
      },
      level: {
        title: 'SEVERITY',
        type: 'custom',
        filter: false,
        renderComponent: SeverityComponent,
        onComponentInitFunction(instance) {
          instance.save.subscribe(row => {
            alert(`${row.name} saved!`);
          });
        },
      },
    },  

  };

}

@Component({
  selector: 'button-view',
  styles: [''],
  template: `
    <img [src]="rowData.picture" width='60' height='60' (click)="openIm()" style='cursor: pointer;'>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  constructor(private windowService: NbWindowService) {}

  openIm() {
    this.windowService.open(ImagebigComponent, {
      title: `View image for ${
        this.rowData.camera_name || this.rowData.cam_name
      }`,
      context: { data: this.rowData },
    });
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}
}
