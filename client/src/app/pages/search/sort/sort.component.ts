import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacesService } from '../../../services/faces.service';
import { api } from '../../../models/API';
import { DomSanitizer } from '@angular/platform-browser';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Pipe, PipeTransform } from '@angular/core';
import { NbCalendarRange, NbDateService, NbPopoverDirective, NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { DeleteWinComponent } from '../../delete-win/delete-win.component';
import { AnalyticsVirgComponent } from '../analytics-virg/analytics-virg.component';
import { DatePipe } from '@angular/common';
import { ImagebigComponent } from '../../online/graphs/imagebig/imagebig.component';

@Component({
  selector: 'ngx-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private faces: FacesService,
    public sanitizer: DomSanitizer,
    private router: Router,
    private windowService: NbWindowService,
    protected dateService: NbDateService<Date>,
    private changeDetectorRef: ChangeDetectorRef,
    public datepipe: DatePipe,
  ) {
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    const a = this.dateService.addDay(this.dateService.today(), 0);
    this.fin = new Date(a.setHours(a.getHours() + 23));
    this.fin = new Date(this.fin.setMinutes(this.fin.getMinutes() + 59));
    this.fin = new Date(this.fin.setSeconds(this.fin.getSeconds() + 59));
    this.selectedDate = this.dateService.addDay(this.dateService.today(), 0);
    this.range = {
      start: this.max,
      end: this.fin,
    };
    if(this.testing){
      this.view = true
      this.result = [
        {
          "output_file": "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/25f92b1e-2666-47d0-90fb-5c9548284077_processed.mp4",
          "location": "/usr/src/app/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/25f92b1e-2666-47d0-90fb-5c9548284077_processed.mp4"
        },
        {
          "output_file": "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/c9ead321-7d67-4f0a-af84-a171ce318624_processed.mp4",
          "save_paths": [
            "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/0a8d4041-ecf3-41d8-9f83-82d0a2d1f592/56d28e30-4557-474e-b04c-f87344ffc395.JPG",
            "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/0a8d4041-ecf3-41d8-9f83-82d0a2d1f592/56d28e30-4557-474e-b04c-f87344ffc395.JPG",
            "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/0a8d4041-ecf3-41d8-9f83-82d0a2d1f592/56d28e30-4557-474e-b04c-f87344ffc395.JPG",
            "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/0a8d4041-ecf3-41d8-9f83-82d0a2d1f592/56d28e30-4557-474e-b04c-f87344ffc395.JPG",
            "/home/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/pictures/0a8d4041-ecf3-41d8-9f83-82d0a2d1f592/56d28e30-4557-474e-b04c-f87344ffc395.JPG"
          ],
          "location": "/usr/src/app/resources/3333-666666-cccccc-nnnnnn/3333-666666-cccccc-nnnnnn/videos/c9ead321-7d67-4f0a-af84-a171ce318624_processed.mp4"
        },
        "**The video contains the following information that was retrieved by the Graymatics Video Summarization's GenAI Module:**\n\n**Summary:**\nThe video footage depicts an altercation involving multiple individuals at various points throughout the recording. At 0:00:02, six people are visible in the frame, with one individual standing and another lying on the ground. Two more individuals join the scene at 0:00:04, bringing the total number of people involved to eight. By 0:00:06, nine individuals are present, with some engaging in physical altercations. Throughout the video, there are seven distinct instances of violence, each occurring at a unique timestamp.\nIn terms of clothing, most of the individuals are dressed in casual attire, such as t-shirts and jeans. However, two individuals (identified at 0:00:02 and 0:00:04) wear dark-colored jackets, which may indicate they are trying to blend in or conceal themselves. Additionally, one individual (seen at 0:00:06) wears a red hat, which could serve as a distinguishing feature.\nPositions-wise, the individuals can be broadly categorized into three groups: those standing, those lying on the ground, and those running or moving around. At 0:00:02, four individuals are standing, while five are lying down. By 0:00:04, the numbers have shifted to three standing and seven lying down. Finally, at 0:00:06, there are two standing individuals and six lying down.\nActions-wise, the individuals exhibit a range of behaviors, including standing, walking, running, and fighting. Some individuals appear to be arguing or shouting at each other, while others are engaged in physical confrontations. At 0:00:02, one individual appears to be hitting another, while at 0:00:04, two individuals are seen pushing each other. Furthermore, several individuals can be observed fleeing the scene between 0:00:04 and 0:00:06."
      ]
      this.resultCache = JSON.parse(JSON.stringify(this.result));
      this.maxSavePathsLength = this.calculateMaxSavePathsLength();

      for(let i = 0; i < this.result.length; i++){
        if(this.result[i].output_file){
          this.result[i].output_file = this.result[i].output_file.replace('/home/resources/', `${api}/pictures/`)
          this.result[i].disabled = false
          if(this.result[i].save_paths){
            const step = Math.ceil(this.result[i].save_paths.length / (this.result.length - 1));
  
            // Filter with step
            let filteredPaths = this.result[i].save_paths.filter((_, index) => index % step === 0);
        
            // Ensure at least 4 values
            if (filteredPaths.length < 4) {
              filteredPaths = this.result[i].save_paths.slice(0, 4); // Take the first 4 images
            }
        
            // Sanitize URLs
            this.result[i].save_paths = filteredPaths.map(img =>
              this.sanitizer.bypassSecurityTrustUrl(
                img.replace('/home/resources/', `${api}/pictures/`)
              )
            );
          }
        }else{
          this.summary = this.result[i].replace(/\\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        }
      }
      console.log(this.result)
    }
   }
   mess:string;

   videos:Array<any>;
   loading: boolean = false
   view: boolean = false
   result: any
   resultCache: any
   summary: string = '';

   testing:boolean = false

   location: string = null

   @ViewChild(NbPopoverDirective) rangeSelector: NbPopoverDirective;
   @ViewChild("dateTimePicker", { static: false }) dateTime: ElementRef;
  selectedDate: Date;
  range: NbCalendarRange<Date>;
  currentSelection: string = "Date";
  dateTouched: boolean = false;
  addRange: boolean = false;
  showIt: boolean = true;
  showRange: boolean;
  max: Date;
  fin: Date;
  algos: Array<any>;
  timezone: any;

  selectRangeType(type) {
    this.currentSelection = type;
  }

  showRangeSelector(show: boolean) {
    if (show) {
      this.addRange = true;
      this.rangeSelector.show();
      this.showIt = !this.showIt;
    } else {
      this.rangeSelector.hide();
      this.showIt = !this.showIt;
    }
  }

  setDate(event) {
    this.selectedDate = event;
    if (this.selectedDate) {
      this.dateTouched = true;
      const start = this.selectedDate;
      // Add one data and minus 1 sec to set time to end of the day
      let end = this.dateService.addDay(start, 1);
      end = new Date(end.getTime() - 1000);
      this.range = {
        start: new Date(start),
        end: new Date(end),
      };
      this.showRangeSelector(false);
    }
  }

  changeRange(event) {
    if (event.end !== undefined) {
      this.dateTouched = true;
      this.showRange = false;
      event.end = new Date(event.end.setHours(event.end.getHours() + 23));
      event.end = new Date(event.end.setMinutes(event.end.getMinutes() + 59));
      event.end = new Date(event.end.setSeconds(event.end.getSeconds() + 59));
      this.range = {
        start: new Date(event.start),
        end: new Date(event.end),
      };
      this.showRangeSelector(false);
    } else {
      this.showRange = true;
    }
  }

  ngOnInit(): void {
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.mess = this.activatedRoute.snapshot.params.uuid
    const ready = this.activatedRoute.snapshot.params.ready
    if(ready === 'nr'){
      this.faces.batchVideos(this.mess).subscribe(
        res => {
          this.videos = res['data']
          let i = 0
          for(let vid of this.videos){
            vid['order'] = i
            vid['displayPath'] = this.sanitizer.bypassSecurityTrustUrl(`${api}/pictures/${vid['id_account']}/${vid['id_branch']}/videos/${vid['stored_name']}`)
            vid['description'] = ''
            vid['directLink'] = `${api}/pictures/${vid['id_account']}/${vid['id_branch']}/videos/${vid['stored_name']}`
            vid['event'] = 'DU'
            vid['type'] = "CCTV"
            i++
          }
          this.faces.getAlgos().subscribe(
            res =>{
              this.algos = res['data']
            },
            err => {
              console.error(err)
            }
          )
        },
        err => {
          console.error(err)
        }
      )
    }else if(ready === 're') {
      this.faces.sendNewInfo(this.videos, this.mess).subscribe(
        res => {
          this.loading = false
          this.result = res['data']
          this.resultCache = JSON.parse(JSON.stringify(this.result));
          this.maxSavePathsLength = this.calculateMaxSavePathsLength();
          for(let i = 0; i < this.result.length; i++){
            if(this.result[i].output_file){
              this.result[i].output_file = this.result[i].output_file.replace('/home/resources/', `${api}/pictures/`)
              this.result[i].event = this.videos[i]['event']
              this.result[i].description = this.videos[i]['description']
              this.result[i].disabled = false
              if (this.result[i].save_paths) {
                const step = Math.ceil(this.result[i].save_paths.length / (this.result.length - 1));
  
                // Filter with step
                let filteredPaths = this.result[i].save_paths.filter((_, index) => index % step === 0);
  
                // Ensure first and last values are included
                if (filteredPaths[0] !== this.result[i].save_paths[0]) {
                  filteredPaths.unshift(this.result[i].save_paths[0]); // Add the first value
                }
                if (filteredPaths[filteredPaths.length - 1] !== this.result[i].save_paths[this.result[i].save_paths.length - 1]) {
                  filteredPaths.push(this.result[i].save_paths[this.result[i].save_paths.length - 1]); // Add the last value
                }
  
                // Ensure at least 4 values
                if (filteredPaths.length < 4) {
                  const additionalValues = this.result[i].save_paths.slice(0, 4 - filteredPaths.length);
                  filteredPaths = Array.from(new Set([...filteredPaths, ...additionalValues])); // Ensure no duplicates
                }
  
                // Sanitize URLs
                this.result[i].save_paths = filteredPaths.map(img =>
                  this.sanitizer.bypassSecurityTrustUrl(
                    img.replace('/home/resources/', `${api}/pictures/`)
                  )
                );
              }
            }else{
              this.summary = this.result[i].replace(/\\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            }
          }
          this.view = true
        },
        err => {
          this.loading = false
          console.error(err)
        }
      )
    }
  }

  updateDateInText(text: string): string {
    // Extract the date inside the && markers
    const match = text.match(/&&(.+?)&&/);
    if (match && match[1]) {
      const originalDate = match[1];
      // Transform the date to desired format
      const formattedDate = this.datepipe.transform(originalDate, 'MMMM dd yyyy', this.timezone);

      if (formattedDate) {
        // Replace the original date with the formatted date
        return text.replace(/&&.*?&&/, `${formattedDate}`);
      }
    }

    return text; // Return original text if no match or transformation
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.videos, event.previousIndex, event.currentIndex);
    this.videos.forEach((video, index) => {
        video.order = index;
    });
    this.changeDetectorRef.markForCheck(); // Notify Angular to check for changes
  }

  sliderValue: number = 4;
  maxSavePathsLength: number = 10;

  sendData(){
    this.loading = true
    for(const vi of this.videos){
      vi['location'] = this.location
      if(this.dateTouched === false){
        vi['date'] = null
      }else {
        vi['date'] = this.range
      }
      // const utcTime = this.range.start.toISOString();  
      // console.log(utcTime, this.range.start)
    }
    const algoList = [], videoList = [...this.videos]
    for(const alg of this.algos){
      if(alg.available === 1){
        algoList.push(alg)
      }
    }
    videoList.push(algoList)
    this.faces.sendNewInfo(videoList, this.mess).subscribe(
      res => {
        this.loading = false
        this.result = res['data']
        this.resultCache = JSON.parse(JSON.stringify(this.result));
        this.maxSavePathsLength = this.calculateMaxSavePathsLength();
        for(let i = 0; i < this.result.length; i++){
          if(this.result[i].output_file){
            this.result[i].output_file = this.result[i].output_file.replace('/home/resources/', `${api}/pictures/`)
            this.result[i].event = this.videos[i]['event']
            this.result[i].description = this.videos[i]['description']
            this.result[i].disabled = false

            if (this.result[i].save_paths) {
              this.filterImages(i, this.sliderValue);
            }
            
          }else{
            this.summary = this.result[i].replace(/\\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          }
        }
        console.log(this.result)
        this.view = true
      },
      err => {
        this.loading = false
        console.error(err)
      }
    )
  }

  calculateMaxSavePathsLength(): number {
    return this.result.reduce((max, item) => {
      if (item.save_paths && Array.isArray(item.save_paths)) {
        return Math.max(max, item.save_paths.length);
      }
      return max;
    }, 0);
  }

  filterImages(index: number, numImages: number): void {
    const originalPaths = this.resultCache[index]?.save_paths;
  
    if (originalPaths && Array.isArray(originalPaths) && originalPaths.length > 0) {
      let filteredPaths: string[] = [];
  
      // Always include the first image
      filteredPaths.push(originalPaths[0]);
  
      if (numImages > 1 && originalPaths.length > 1) {
        // Add the last image if numImages >= 2
        if (numImages > 1) {
          filteredPaths.push(originalPaths[originalPaths.length - 1]);
        }
  
        if (numImages > 2 && originalPaths.length > 2) {
          // Calculate the step for middle images
          const middleImagesCount = numImages - 2;
          const step = Math.max(1, Math.floor((originalPaths.length - 2) / middleImagesCount));
  
          // Add middle images
          for (let i = step; i < originalPaths.length - 1 && filteredPaths.length < numImages; i += step) {
            filteredPaths.push(originalPaths[i]);
          }
        }
      }
      // Ensure no duplicates and limit to numImages
      filteredPaths = Array.from(new Set(filteredPaths)).slice(0, numImages);
  
      // Sanitize the filtered URLs
      this.result[index].save_paths = filteredPaths.sort((a, b) => a.localeCompare(b)).map(img =>
        this.sanitizer.bypassSecurityTrustUrl(img.replace('/home/resources/', `${api}/pictures/`))
      );
    }
  }
  onSliderChange(): void {
    // Recalculate filtered images for each result based on the slider value
    this.filterImages(this.result.length - 2, this.sliderValue);
  }

  openIm(img){
    let data = {
      picture : img
    }
    this.windowService.open(ImagebigComponent, { title: `View image`, context: { data: data} });
  }

  openWindowForm() {
    this.windowService.open(AnalyticsVirgComponent, {
      title: `Analytics Selection`,
      context: {
        onChange: (changes) => {
          this.algos = changes;
        },
        algos: this.algos,
      },
    });
  }

  // delete(cam, index){
  //   cam['stored_vid'] = this.videos[index].fullPath
  //   cam['id'] = this.videos[index].id
  //   this.faces.deletePairOfVideos(cam).subscribe(
  //     res => {
  //       console.log(res)
  //     },
  //     err => {
  //       console.error(err)
  //     }
  //   )
  // }

  delete(cam, index) {
    cam['stored_vid'] = this.videos[index].fullPath
    cam['id'] = this.videos[index].id
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true,
    }
    const windowRef = this.windowService.open(DeleteWinComponent, { title: `This action will delete both original and proceessed video, do you want to proceed?`, context: { type: 7, data: { body: cam }}, buttons:  buttonsConfig, closeOnBackdropClick:true, closeOnEsc: true })
    windowRef.onClose.subscribe((data) => {
      if(data === true){
        this.result[index].disabled = true;
      }
    });
  }

  get sanitizedString() {
    // Replace \n with <br> for HTML line breaks
    const formattedString = this.summary.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(formattedString);
  }

}

@Pipe({
  name: 'newlineToBreak'
})
export class NewlineToBreakPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/\\n/g, '<br>') : value; // Replace \n with <br>
  }
}
