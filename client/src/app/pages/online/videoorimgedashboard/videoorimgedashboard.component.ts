import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NbDialogRef, NbDialogService, NbWindowService } from '@nebular/theme';
import { ImagebigComponent } from "../graphs/imagebig/imagebig.component"
import { DisableService } from '../../../services/disable.service';
import { VideoComponent } from '../graphs/video/video.component';

@Component({
  selector: 'ngx-videoorimgedashboard',
  templateUrl: './videoorimgedashboard.component.html',
  styleUrls: ['./videoorimgedashboard.component.scss']
})
export class VideoorimgedashboardComponent implements OnInit {
  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  val: string;
  videonumber: any=false;
  openedWindow: NbDialogRef<ImagebigComponent>;
  imgvalue: any=false;

  constructor(  private windowService: NbWindowService,private disableservice: DisableService, 
    private dialogService: NbDialogService, ) { }
  openIm(){
    this.windowService.open(ImagebigComponent, { title: `View image for ${this.rowData.camera_name || this.rowData.cam_name}`, context: { data: this.rowData} });
  }
  openWindowForm() {
    this.windowService.open(VideoComponent, { title: `Play Incident of ${this.rowData.camera_name || this.rowData.cam_name}`, context: { data: this.rowData} });
  }
  mouserenterr(){
    this.videonumber=true
    this.disableservice.setImgsrc(this.rowData.picture)
    this.disableservice.setVideosrc(this.rowData.movie)
    this.disableservice.videoenble(this.videonumber)
    //console.log(this.disableservice.videoenble(this.videonumber),'teju')
  }
  
  mouseleavee(){
    this.videonumber=false
    this.disableservice.setImgsrc(null)
    this.disableservice.setVideosrc(null)
    this.disableservice.videoenble(this.videonumber)
    
  }
  mouserenterrrr(){
    this.imgvalue=true
    this.disableservice.setImgsrc(this.rowData.picture)
    this.disableservice.setVideosrc(this.rowData.movie)
    this.disableservice.imgphotorecvid(this.imgvalue)
  }
  mouseleaveee(){
    this.imgvalue=false
    this.disableservice.setImgsrc(null)
    this.disableservice.setVideosrc(null)
    this.disableservice.imgphotorecvid(this.imgvalue)

  }

  // mouseenterrimg() {
  //   this.openedWindow = this.dialogService.open(ImagebigComponent, {
  //     context: { data: this.rowData },
  //   });
  //   this.openedWindow.componentRef.instance.title = `View image for ${this.rowData.camera_name || this.rowData.cam_name}`;
  // }
  // mouseleaveeimg(){
     
  //   if (this.openedWindow) {
  //     this.openedWindow.close();
  //   }
  // }

  ngOnInit(): void {
    // if(this.rowData.type ==  'People Count'){
    //   this.val ="People Count" // this.rowData.level
    // }else {
    //   this.val = 'img'
    // }
    this.disableservice.videoenble(this.videonumber)
    // console.log(this.disableservice.videoenble(this.videonumber),'teju')
    // console.log(this.videonumber,'teju')
     

    if(this.rowData.type == "People Count"){
      this.val = "People Count"
    }
    else{
      this.val='img'
    }
    // else if(this.rowData.level == undefined){
    //   this.val = this.rowData.severity
    // }
    // if(this.rowData.alert_type !== undefined){
    //   this.val = JSON.stringify(this.rowData.alert_type - 1)
    // }
  }

}
