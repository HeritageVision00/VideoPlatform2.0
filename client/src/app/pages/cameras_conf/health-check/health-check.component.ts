import { Component, OnInit, TemplateRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { NbWindowService } from '@nebular/theme';
import * as JSMpeg from '@cycjimmy/jsmpeg-player';

@Component({
  selector: 'ngx-health-check',
  templateUrl: './health-check.component.html',
  styleUrls: ['./health-check.component.scss']
})

export class HealthCheckComponent implements OnInit {

  cams: any;
  camName: any;
  camState: boolean = false;
  runningPid: any;
  private webSocket: WebSocket;
  private videoPlayer: HTMLVideoElement;
  private canvas: HTMLCanvasElement;
  private player: any;
  @ViewChild('canavs', { read: TemplateRef }) disabledEscTemplate: TemplateRef<HTMLElement>;
  constructor(
    private facesService: FacesService,
    private windowService: NbWindowService,
    private elementRef: ElementRef
  ) {

  }
  ngOnInit(): void {
    this.camState = false;
    // this.facesService.getHealthCheck().subscribe(res => {
    //   this.cams = res['data']
    // }, err => console.error(err));
  }

  playBtn(camera) {
    var details = {
      "rtspUrl": camera.rtsp_in,
      "wsIP": "192.168.1.159",
      "wsPort": "2233"
    }
    this.camName = camera.name
    // this.facesService.startHelthcheck(details).subscribe(res => {
    //   this.runningPid = res['pid'];
    //   this.te(res['url']);
    // }, err => console.error(err));
  }


  te(url) {
    this.camState = true;
    this.canvas = this.elementRef.nativeElement.querySelector('canvas');
    this.player = new JSMpeg.Player(url, { canvas: this.canvas });
  }

  destroyStream() {
    this.camState = false;
    var details = {
      "pid": this.runningPid
    }
    // this.facesService.killStream(details).subscribe(res => {

    // }, err => console.error(err));
  }
}