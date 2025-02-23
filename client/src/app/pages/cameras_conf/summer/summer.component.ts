import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FacesService } from '../../../services/faces.service';
import { DisableService } from '../../../services/disable.service';
import { NbWindowService } from '@nebular/theme';
import { VideoComponent } from '../../online/graphs/video/video.component';
import { DatePipe } from '@angular/common';
import * as moment from "moment";

@Component({
  selector: 'ngx-summer',
  templateUrl: './summer.component.html',
  styleUrls: ['./summer.component.scss']
})
export class SummerComponent implements OnInit {
  videoLink: string | null = null
  videoLink2: string | null = null;
  videoLinkOverlay: string | null = null;
  textSummary: string = '';
  gptText: string | null = null
  cursorOnVideoScreen = {
    stitched: false,
    overlay: false,
    original: false
  };

  selectedSpeed = {
    stitched: 1,
    overlay: 1,
    original: 1
  };
  selectedSpeedone = {
    stitched: 1,
    overlay: 1,
    original: 1
  }
  forwardClicked = {
    stitched: false,
    overlay: false,
    original: false
  };
  forwardClickedtwo = {
    stitched: false,
    overlay: false,
    original: false
  };
  backwardClickedtwo = {
    stitched: false,
    overlay: false,
    original: false
  };
  backwardClicked = {
    stitched: false,
    overlay: false,
    original: false
  };
  Multiplayer = {
    stitched: false,
    overlay: false,
    original: false
  };
  receivedDatafromsummer: any;
  overspeeddata: any;
  timezone: any;
  intervalId: any;
  dataToSend: boolean;
  constructor(
    private face: FacesService,
    private activatedRoute: ActivatedRoute,
    public datepipe: DatePipe,
    private disableservice: DisableService,
    private windowService: NbWindowService
  ) { }

  loading: boolean = false
  ngOnInit(): void {
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.loadContent();

    this.disableservice.setData(true);

    this.disableservice.real$.subscribe(data => {
      if(data && data.data){
          let startTime = new Date()
          let endTime = new Date()

          if(data.data.startdateTimePicker){
            startTime.setHours(data.data.startdateTimePicker.getHours())
            startTime.setMinutes(data.data.startdateTimePicker.getMinutes())
            startTime.setSeconds(data.data.startdateTimePicker.getSeconds())
          }

          if(data.data.enddateTimePicker){
            endTime.setHours(data.data.enddateTimePicker.getHours())
            endTime.setMinutes(data.data.enddateTimePicker.getMinutes())
            endTime.setSeconds(data.data.enddateTimePicker.getSeconds())
          }

          let outcome = JSON.parse(localStorage.getItem("outcome"))

          let filtereDataByAlgorithm = outcome.filter(elem => Number(elem.alg) === data.algorithmId)
          let filteredDataByTime = [];

          if(filtereDataByAlgorithm && filtereDataByAlgorithm.length > 0){
            for(let outcomeData of filtereDataByAlgorithm){
              let clipTime = moment(outcomeData.timestamp, "hh:mm:ss")

              if(clipTime && clipTime.toDate() >= startTime && clipTime.toDate() < endTime){
                filteredDataByTime.push(outcomeData)
              }
            }
          }

          if(filteredDataByTime && filteredDataByTime.length > 0){
            this.receivedDatafromsummer = filteredDataByTime
            this.overspeeddata = this.receivedDatafromsummer

            let filteredDataByContextParam = []
            let isContextParamUsed = false

            //Different context param here

            //Filter based on object detected
            if(data.data.object && data.data.object.toLowerCase() !== 'all'){
              isContextParamUsed = true
              for(let outcomeData of filteredDataByTime){
                let clipstring = outcomeData.string
  
                if(clipstring && clipstring.toLowerCase().includes(data.data.object.toLowerCase())){
                  filteredDataByContextParam.push(outcomeData)
                }
              }
            }

            //Filter based on gender detected
            if(data.data.gender){
              isContextParamUsed = true
              for(let outcomeData of filteredDataByTime){
                let clipstring = outcomeData.string
  
                if(clipstring && clipstring.toLowerCase().includes(data.data.gender.toLowerCase())){
                  filteredDataByContextParam.push(outcomeData)
                }
              }
            }

            //Filter based on speed
            if(data.data.maxSpeed){
              if(data.data.maxSpeed === 'none'){
                data.data.maxSpeed = 0
              }

              isContextParamUsed = true
              for(let outcomeData of filteredDataByTime){
                let clipstring = outcomeData.string
                
                let matches = clipstring.match(/Speeding of \d*\.?\d*/)

                let speed
    
                if (matches) {
                    speed = matches[0].replace('Speeding of ', '')
                }
            
              if(speed && Number(speed) >= Number(data.data.maxSpeed)){
                  filteredDataByContextParam.push(outcomeData)
                }
              }
            }

            if(isContextParamUsed && filteredDataByContextParam && filteredDataByContextParam.length > 0){
              this.receivedDatafromsummer = filteredDataByContextParam
              this.overspeeddata = filteredDataByContextParam
            } else if(isContextParamUsed){
              this.receivedDatafromsummer = null
              this.overspeeddata = null
            }
        } else {
          this.receivedDatafromsummer = null
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.videoLink = null;
    this.videoLink2 = null;
    this.textSummary = '';
    this.videoLinkOverlay = null
    clearInterval(this.intervalId);
    this.receivedDatafromsummer = null;
  }
  //************************** */

  //****************** */

  loadContent(): void {
    this.loading = true
    const params = this.activatedRoute.snapshot.params.id;
    // if(params.includes('_')){
    //   this.disableservice.paramesiddata(params)
    //   const obj = []
    //   for(const id of params.split('_')){
    //     obj.push(id)
    //   }
    //   this.face.summarizeMultiple(obj).subscribe(
    //     res => {
    //       console.log(res)
    //     },
    //     err => {
    //       console.error(err)
    //     }
    //   )
    //   return
    // }
    this.disableservice.paramesiddata(params)
    this.face.summOverlay(params).subscribe(
      res => {
        this.videoLinkOverlay = res['data'].link
        this.face.summarize(params).subscribe(
          res => {
            this.loading = false
            this.videoLink = res['data'].sumVid
            this.videoLink2 = res['data'].oriVid
            let outcome = res['data'].outcome
            let par = ''
            for (const out of outcome){
              out.time = this.datepipe.transform(out.time, 'yyyy-M-dd HH:mm:ss', this.timezone)
              let time = this.datepipe.transform(out.time, 'yyyy-M-dd HH:mm:ss', this.timezone)
              if(out.timestamp !== 0){
                time = out.timestamp
              }
              out.string = `${out.string}${time}. `
              par = par + out.string
              out.vid = 'api/pictures/' + out.clip
              out.type = out.string
            }
            localStorage.setItem("outcome", JSON.stringify(outcome));
            this.textSummary = par
            const val = {
              paragraph: par,
              outcome: outcome,
              id: params
            }
            this.face.gpt(val).subscribe(
              res => {
                this.gptText = res['data'].gpt_summary_of_vs
                if(this.gptText.includes('Of course!')){
                  this.gptText = res['data'].gpt_summary_of_vs.split('Of course!').join('')
                }
              },
              err => {
                console.error(err)
              }
            )
          },
          err => {
            this.loading = false
          }
        )
         
      },
      err => {
        this.face.summarize(params).subscribe(
          res => {
            this.loading = false
            this.videoLink = res['data'].sumVid
            this.videoLink2 = res['data'].oriVid
            let outcome = res['data'].outcome
            let par = ''
            for (const out of outcome){
              const str = `${out.string}${this.datepipe.transform(out.time, 'yyyy-M-dd HH:mm:ss', this.timezone)}. `
              par = par + str
              out.vid = 'api/pictures/' + out.clip
              out.type = out.string
            }
            this.textSummary = par
            localStorage.setItem("outcome", JSON.stringify(outcome));
          },
          err => {
            this.loading = false
          }
        )
      }
    )
  }

  playSummarizedVideo(): void {
    const videoContainer = document.getElementById('summarizedVideo');
    if (videoContainer && this.videoLink) {
      videoContainer.innerHTML = `<video controls width="100%"><source
src="${this.videoLink}" type="video/mp4">Your browser does not support
HTML5 video.</video>`;

    }
  }
  playOriginalVideo(): void {
    const videoContainer = document.getElementById('originalVideo');
    if (videoContainer && this.videoLink2) {
      videoContainer.innerHTML = `<video controls width="100%"><source
src="${this.videoLink2}" type="video/mp4">Your browser does not support
HTML5 video.</video>`;
    }
  }

  adjustSpeed(action: '+' | '-', type): void {
    if (action === '+' && this.selectedSpeed[type] === 0.5) {
      this.selectedSpeed[type] = 1;
      return; // Exit the function after handling the specific case
    }
    if (action === '+' && this.selectedSpeed[type] < 30) {
      this.selectedSpeed[type] = this.selectedSpeed[type] + 1;
    } else if (action === '-' && this.selectedSpeed[type] > 1) {
      this.selectedSpeed[type] = this.selectedSpeed[type] - 1;
    }
    else if (action === '-' && this.selectedSpeed[type] === 1) {
      // Special case: if current speed is 1X and decreasing, set it to0.5X
      this.selectedSpeed[type] = 0.5;
    }
  }
  openWindowForm(data) {
    this.windowService.open(VideoComponent, { title: `Play Incident`, context: { data: data} });
  }

  adjustSpeedone(action: 'h' | 'l', type): void {
    if (action === 'h' && this.selectedSpeedone[type] === 0.5) {
      this.selectedSpeedone[type] = 1;
      return; // Exit the function after handling the specific case
    }
    if (action === 'h' && this.selectedSpeedone[type] < 30) {
      this.selectedSpeedone[type] = this.selectedSpeedone[type] + 1;
    } else if (action === 'l' && this.selectedSpeedone[type] > 1) {
      this.selectedSpeedone[type] = this.selectedSpeedone[type] - 1;
    }
    else if (action === 'l' && this.selectedSpeedone[type] === 1) {
      // Special case: if current speed is 1X and decreasing, set it to0.5X
      this.selectedSpeedone[type] = 0.5;
    }
    this.Multiplayer[type] = true
    setTimeout(() => {
      this.Multiplayer[type] = false;
    }, 500);
  }
  restartVideo(type): void {
    const videoElement = document.getElementById('singleVideoone') as
      HTMLVideoElement;

    if (videoElement) {
      videoElement.currentTime = 0;
      this.selectedSpeedone[type] = 1 // Set video current time to 0 to restart
      videoElement.play(); // Optionally, start playing after resetting
    }
  }
  restartVideotwo(type): void {
    const videoElement = document.getElementById('singleVideotwo') as
      HTMLVideoElement;

    if (videoElement) {
      videoElement.currentTime = 0;
      this.selectedSpeed[type] = 1 // Set video current time to 0 to restart
      videoElement.play(); // Optionally, start playing after resetting

    }
  }

  skipTimef(videoElement: HTMLVideoElement, seconds: number, type): void {
    if (videoElement) {
      const newTime = videoElement.currentTime + seconds;

      if (newTime < 0) {
        videoElement.currentTime = 0;
      } else {
        videoElement.currentTime = newTime;
      }
      this.forwardClicked[type] = true;

      setTimeout(() => {
        this.forwardClicked[type] = false;
      }, 500);
    }
  }
  skipTimeb(videoElement: HTMLVideoElement, seconds: number, type): void {
    if (videoElement) {
      const newTime = videoElement.currentTime + seconds;
      if (newTime < 0) {
        videoElement.currentTime = 0;
      } else {
        videoElement.currentTime = newTime;
      }
      this.backwardClicked[type] = true;
      setTimeout(() => {
        this.backwardClicked[type] = false;
      }, 500);
    }
  }
  skipTimetwof(videoElement: HTMLVideoElement, seconds: number, type): void {
    if (videoElement) {
      const newTime = videoElement.currentTime + seconds;

      if (newTime < 0) {
        videoElement.currentTime = 0;
      } else {
        videoElement.currentTime = newTime;
      }
      this.forwardClickedtwo[type] = true;

      setTimeout(() => {
        this.forwardClickedtwo[type] = false;
      }, 500);
    }
  }
  skipTimetwob(videoElement: HTMLVideoElement, seconds: number, type): void {
    if (videoElement) {
      const newTime = videoElement.currentTime + seconds;

      if (newTime < 0) {
        videoElement.currentTime = 0;
      } else {
        videoElement.currentTime = newTime;
      }
      this.backwardClickedtwo[type] = true;

      setTimeout(() => {
        this.backwardClickedtwo[type] = false;
      }, 500);
    }
  }
}
