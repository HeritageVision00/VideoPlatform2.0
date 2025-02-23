import { Component, Input, OnInit } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AnnotationsService } from '../../../services/annotations.service';
import { NbWindowRef } from '@nebular/theme';
import { AmService } from '../../../services/am.service';

@Component({
  selector: 'ngx-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss']
})
export class WebcamComponent implements OnInit {

  constructor(
    private annserv: AnnotationsService,
    protected windowRef: NbWindowRef,
    private service : AmService,
  ) { }

  @Input() user: any;
  @Input() data: any;

  ngOnInit(): void {
  }
  public webcamImage: WebcamImage = null;
  private trigger: Subject<void> = new Subject<void>();

  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  uploading:boolean = false;
  format: string

  public reTake(){
    this.webcamImage = null
  }

  public accept(){
    this.uploading = true
    if(this.user !== undefined){
      this.annserv.postImage({ base64: this.webcamImage.imageAsDataUrl, format: this.format,  name: this.user.name}, this.user.uuid).subscribe(
        res =>{
          this.uploading = false
          this.windowRef.close();
        },
        err => console.error(err)
      )
    }else{
      const data = {
        base64: this.webcamImage.imageAsBase64,
        event: this.data,
        format: this.format
      }
      this.service.am(data).subscribe(
        res => {
          this.uploading = false
          this.windowRef.close(res);
        },
        err => {
          this.uploading = false
          console.error(err)
        }
      )
    }
  }
  
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.format = webcamImage.imageAsDataUrl.split('/')[1].split(';')[0]
  }

  public triggerSnapshot(): void {
    // console.log(this.trigger, this.webcamImage)
    this.trigger.next();
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

}
