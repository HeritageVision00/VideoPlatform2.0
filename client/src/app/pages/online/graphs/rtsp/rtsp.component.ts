import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FacesService } from '../../../../services/faces.service';
import * as JSMpeg from "@cycjimmy/jsmpeg-player";

@Component({
  selector: 'ngx-rtsp',
  templateUrl: './rtsp.component.html',
  styleUrls: ['./rtsp.component.scss']
})
export class RtspComponent implements OnInit, OnDestroy {
  @Input() data; 
  @ViewChild("streaming", { static: false }) streamingcanvas: ElementRef;
  player: any;
  constructor(
    private facesService: FacesService,
  ) { }

  ngOnInit(): void {
    const a = {
      rtspUrl: this.data
    }
    this.facesService.playCamera(a).subscribe(
      res => {
        this.player = new JSMpeg.Player(
          `${res["url"]}`,
          {
            canvas: this.streamingcanvas.nativeElement,
            autoplay: true,
            audio: false,
            loop: true,
          }
        );
      },
      err => {
        console.error(err)
      }
    )
  }

  ngOnDestroy() {
    this.destroy();
  }

  destroy() {
    if (this.player != undefined) {
      this.player.destroy();
      this.player = null;
      this.facesService.cameraStop().subscribe(
        (res) => {},
        (err) => console.error(err)
      );
    }
  }

}
