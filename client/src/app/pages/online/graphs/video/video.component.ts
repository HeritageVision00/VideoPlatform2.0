import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  constructor(
    public sanitizer: DomSanitizer,
  ) { }

  @Input() path: any;
  @Input() data: any;
  @ViewChild('videoPlayer') videoplayer: any;

  ngOnInit(): void {
    // console.log(this.data.vid, this.data.video, this.data.videoClip)
    // if(this.data.vid){
    //   if (!this.data.vid.includes('http')) {
    //     this.data.vid = `http://${this.data.vid}`
    //   }
    //   this.data['videoClip'] = this.sanitizer.bypassSecurityTrustUrl(this.data.vid)
    // }
    // if(this.data.video){
    //   if (!this.data.video.includes('http')) {
    //     this.data.video = `http://${this.data.video}`
    //   }
    //   this.data['videoClip'] = this.sanitizer.bypassSecurityTrustUrl(this.data.video)
    // }
  }

  playVideo(event) {
    event.toElement.play()
 }

}
