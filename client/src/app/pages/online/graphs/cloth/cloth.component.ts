import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NbCalendarRange, NbThemeService, NbWindowService } from '@nebular/theme';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { api } from '../../../../models/API';
import { AnalyticsService } from '../../../../services/analytics.service';
import { FacesService } from '../../../../services/faces.service';
import { Router } from '@angular/router';
import { Account } from '../../../../models/Account';
import { ImagebigComponent } from '../imagebig/imagebig.component';
import { WindowOpenerComponent } from '../window-opener/window-opener.component';


@Component({
  selector: 'ngx-cloth',
  templateUrl: './cloth.component.html',
  styleUrls: ['./cloth.component.scss']
})
export class ClothComponent implements OnInit, OnDestroy {

  @Input() range: NbCalendarRange<Date>;
  @Input() camera;
  cloth: any = [];
  player: any;
  timezone: any;
  now_user: Account;
  themeSubscription: any;
  options: any = {};

  @ViewChild('streaming', { static: false }) streamingcanvas: ElementRef;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
    private route: Router,
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
    const time = new Date();
    this.timezone = time.toString().match(/[\+,\-](\d{4})\s/g)[0].split(' ')[0].slice(0, 3);
    this.timezone = parseInt(this.timezone);
    let p = '';
    if (this.timezone > 0) {
      p = '+';
    }
    this.timezone = p + JSON.stringify(this.timezone) + '00';
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
    this.face.checkVideo(32, this.camera).subscribe(
      res => {
        this.video = res['video'];
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(res['http_out']);
        // if (this.video === true) {
        //   this.settings['columns']['picture'] = {
        //     title: 'VIDEO',
        //     type: 'custom',
        //     filter: false,
        //     renderComponent: ButtonViewComponent,
        //     onComponentInitFunction: (instance) => {
        //       instance.save.subscribe((row: string)  => {
        //         this.pass(row);
        //       });
        //     },
        //   };
        //   this.settings = Object.assign({}, this.settings);
        // }
      }, err => console.error(err),
    );
    this.serv.cloth(this.camera, l).subscribe(
      res => {
        this.cloth = res['data'];
        let id = 0
        for (const m of this.cloth.raw) {
          m['picture'] = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/clothing/' + m['cam_id'] + '/' + m['picture']);
          m['time'] = this.datepipe.transform(m['time'], 'yyyy-M-dd HH:mm:ss');
          m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(api + '/pictures/' + this.now_user['id_account'] + '/' + m['id_branch'] + '/clothing/' + m['cam_id'] + '/' + m['movie']);
          m['idTable'] = id
          id++
        }
        this.source = this.cloth.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
      },
      err => {
        console.error(err);
        this.cloth = undefined;
      },
    );
  }

  got(id) {
    this.route.navigate([`/pages/tickets`]);
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
      sleeve_length: {
        title: 'UPPERWEAR',
        type: 'string',
        filter: false,
      },
      top_colour: {
        title: 'TOP COLOR',
        type: 'string',
        filter: false,
      },
      bottom_length: {
        title: 'LOWERWEAR',
        type: 'string',
        filter: false,
      },
      bottom_colour: {
        title: 'BOTTOM COLOR',
        type: 'string',
        filter: false,
      },
      cam_name: {
        title: 'CAM',
        type: 'string',
        filter: false,
      },
    },
  };

}
@Component({
  selector: 'button-view',
  styles: ['.play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}'],
  template: `
    <div >
      <div style = "width:60px; height: 60px">
        <img [src]="rowData.picture" width='60' height='60'>
        <button class='btn btn-link play-btn' (click)="openVideo()"><i class="fas fa-play"></i></button>
      </div>
    </div>
  `,
})
export class ButtonViewComponentvideo implements ViewCell, OnInit {
  renderValue: string;

  constructor(){
  }

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openVideo(){
    this.save.emit(this.rowData.clip_path);
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}
@Component({
  selector: 'button-view',
  styles: ['.play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}'],
  template: `
    <img [src]="rowData.picture" width='60' height='60'>
    <button class='btn btn-link play-btn' (click)="openIm()"><i class="fas fa-play"></i></button>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {

  constructor(private windowService: NbWindowService) {
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

