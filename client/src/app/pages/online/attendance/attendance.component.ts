import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
// import { Observable, Subject } from 'rxjs';
// import { Buffer } from 'buffer'
import { AnalyticsService } from '../../../services/analytics.service';
import { NbWindowService } from '@nebular/theme';
import { WebcamComponent } from '../../facial_recognition/webcam/webcam.component';
import { DatePipe } from '@angular/common';
import{ TimezoneService } from '../../../services/timezone.service'

@Component({
  selector: 'ngx-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {

  constructor(
    private windowService: NbWindowService,
    public datepipe: DatePipe,
    private timezone: TimezoneService
  ) { }

  list: Object = {
    0:'Check-In for the day',
    1:'Going out for break',
    2:'Going out for meeting',
    3:'Return from break',
    4:'Return from meeting',
    5:'Check-Out/Going for Meeting',
    6:'Check-Out for the Day',
  }
  
  data: any;
  message: string = null;
  tz: string = '+0100'

  ngOnInit(): void {
    const timeZoneOffset = new Date().getTimezoneOffset();
    this.tz = this.timezone.offSetToTimezone(timeZoneOffset)
    // WebcamUtil.getAvailableVideoInputs()
    // .then((mediaDevices: MediaDeviceInfo[]) => {
    //   this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
    // });
    // // this.startVideoStream()
  }

  // socket:WebSocket = new WebSocket('ws://127.0.0.1:3301/ws/test');

  ngOnDestroy(): void {
    // this.socket.close()
  }

  openWindowForm(event) {
    const windowRef = this.windowService.open(WebcamComponent, { title: `Register picture`, context: { data: event}});
    windowRef.onClose.subscribe((data) => {
      if(data){
        this.data = data.data
        this.data.time = this.datepipe.transform(this.data.time, 'HH:mm:ss yyyy-M-dd', this.tz);
        this.message = `${this.data.name} was registered for ${this.list[parseInt(event)]} at ${this.data.time}`
      }
    });
  }

  selected(event){
    this.message = null
    this.openWindowForm(event)
  }

  // videoStream: MediaStream;

  // startVideoStream() {
  //   console.log("Starting socket")
  //   this.socket.onopen = () => {
  //     console.log("Connected to Websocket")
  //     navigator.mediaDevices.getUserMedia({ video: true })
  //     .then(stream => {
  //       console.log(stream)
  //       const video = this.videoElement['nativeVideoElement'];
  //       video['srcObject'] = stream;
  
  //       // Create a canvas element and set its dimensions
  //       this.canvas = document.createElement('canvas');
  //       this.canvas.width = 1280;
  //       this.canvas.height = 720;
  //       // console.log(this.canvas, video, this.videoElement['width'])
  //       // Continuously capture and send video frames
  //       const interval = 30
  //       this.socket.send(JSON.stringify({width: this.canvas.width, height: this.canvas.height, framerate: interval }));
  //       setInterval(() => {
  //         this.captureAndSendFrame(interval)
  //       }, 1000 / interval); // Adjust the frame rate as needed
  //     })
  //     .catch(error => {
  //       console.error('Error accessing webcam:', error);
  //     });
  //     console.log('WebSocket connection established');
  //   };
    
  //   // Handle WebSocket close event
  //   this.socket.onclose = () => {
  //     console.log('WebSocket connection closed');
  //   };
    
  //   // Handle WebSocket error event
  //   this.socket.onerror = error => {
  //     console.error('WebSocket error:', error);
  //   };
  // }

  // @ViewChild('videoElement') videoElement: ElementRef;
  // canvas: HTMLCanvasElement;

  // captureAndSendFrame(interval) {
  //   const video = this.videoElement['nativeVideoElement'];
  //   const context = this.canvas.getContext('2d');
  
  //   // Draw the current video frame on the canvas
  //   context.drawImage(video, 0, 0, this.canvas.width, this.canvas.height);
  //   // Get the base64-encoded image data from the canvas
  //   const imageData = this.canvas.toDataURL('image/jpeg');
  //   const videoData = Buffer.from(imageData, 'base64');
  //   console.log(videoData.byteLength)
  //   // Send the image data over the WebSocket connection
  //   this.socket.send(JSON.stringify({video: imageData, width: this.canvas.width, height: this.canvas.height, framerate: interval }));
  // }

  // public webcamImage: WebcamImage = null;
  // private trigger: Subject<void> = new Subject<void>();

  // public handleInitError(error: WebcamInitError): void {
  //   if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
  //     console.warn("Camera access was not allowed by user!");
  //   }
  // }
  
  // public handleImage(webcamImage: WebcamImage): void {
  //   this.webcamImage = webcamImage;
  //   console.log(webcamImage.imageAsBase64)
  //   const data = {
  //     base64: webcamImage.imageAsBase64,
  //   }
  //   this.service.am(data).subscribe(
  //     res => {
  //       console.log(res)
  //     },
  //     err => {
  //       console.error(err)
  //     }
  //   )
  // }

  // public triggerSnapshot(): void {
  //   // console.log(this.trigger, this.webcamImage)
  //   this.trigger.next();
  // }

  // public get triggerObservable(): Observable<void> {
  //   return this.trigger.asObservable();
  // }

  // public videoOptions: MediaTrackConstraints = {
  //   // width: {ideal: 1024},
  //   // height: {ideal: 576}
  // };

}
