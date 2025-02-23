import { Component, OnInit, OnDestroy } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/Account';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { RecordingWinComponent } from '../recording-win/recording-win.component';
import { DeleteWinComponent } from '../../delete-win/delete-win.component';

@Component({
  selector: 'app-livestream',
  templateUrl: './livestream.component.html',
  styleUrls: ['./livestream.component.css'],
  animations: [
    trigger('flyInOut', [
      transition('void => *', [
        style({ transform: 'translateX(100%)' }),
        animate(400)
      ])
    ])
  ]
})
export class LivestreamComponent implements OnInit, OnDestroy {

  relations: Array<any> =[];
  dateMessage: string;
  cams: Array<any> = [];
  algos: Array<any> = [];
  rois: Array<any> = [];
  date:any;
  vms: String = null;
  heatmap: Boolean = false;
  remaining:  any = {
    cameras: 0
  }
  now_user: Account;
  constructor(
    private facesService: FacesService, 
    private AccountService:AccountService,
    private windowService: NbWindowService,
    private toastrService: NbToastrService,
    ) {}

    ngOnDestroy(){
      // if(this.date){
      //   clearInterval(this.date);
      // }
    }

    remain(){
      if(this.now_user.role != 'user'){
        this.AccountService.remaining().subscribe(
          res=>{
            this.remaining['cameras'] = res['data']['cameras']
          }
        )
      }
    }

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    // let currentDate = new Date();
    // this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString('en-US',{ hour12: true });
    // this.date = setInterval(()=>{
    //   let currentDate = new Date();
    //   this.dateMessage = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString('en-US',{ hour12: true });
    // }, 1000);
    this.remain()

      this.facesService.getLiveCameras().subscribe(
        res => {
          this.cams = res['data'];
          if(res['ds'] === '00-aa-321'){
            this.vms = 'cognyte'
          }
          this.facesService.getAllRelations().subscribe(
            res => {
              this.relations = res['data'];
              this.facesService.getAlgos().subscribe(
                res => {
                  this.algos = res['data'];
                  for(let i = 0; i < this.algos.length; i++){
                    if(this.algos[i]['name'] == 'Heatmap' && this.algos[i]['available'] == 1){
                      this.heatmap = true;
                    }
                  }
                  for(let u = 0; u < this.algos.length; u++){
                    for(let i = 0; i < this.cams.length; i++){
                      for(let e = 0; e < this.relations.length; e++){
                         if(this.algos[u]['name'] == 'Heatmap' && this.algos[u]['id'] == this.relations[e]['algo_id'] && this.relations[e]['camera_id'] == this.cams[i]['id']){
                            this.cams[i].hm = true;
                        }
                      }
                    }
                  }
                },
                err => console.error(err)
              );
            },
            err => console.error(err)
          );
        },
        err => console.error(err)
      );             
  }

  getCameras(){
    this.facesService.getCameras().subscribe(
      res => {
        console.log(res)
        this.cams = res['data'];
        // console.log(this.cams)
      },
      err => console.error(err)
    );
  }

  open(cam){
    const windowRef = this.windowService.open(RecordingWinComponent, { title: `Recording of ${cam.name}`, context: { data: cam} });
    windowRef.onClose.subscribe((data) => {
      if (data === true){
        this.showToast('Video is being processed', 0) // do the toastr
      }else if (data === false) {
        this.showToast('Video failled to be processed', 1)
      }
    });
  }

  destroyByClick = true;
  duration = 10000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus;
  
  private showToast( body: string, type) {
    switch (type){
      case 0: {
        this.status = 'primary';
        break;
      }
      case 1: {
        this.status = 'danger';
        break;
      }
    }
    const config = {
      status: this.status,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = 'Status';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

  deleteCamera(id: string){
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true,
    }
    const windowRef = this.windowService.open(DeleteWinComponent, { title: `Do you want to delete this camera?`, context: { type: 1, data: { id: id }}, buttons:  buttonsConfig, closeOnBackdropClick:true, closeOnEsc: true })
    windowRef.onClose.subscribe((data) => {
      if(data === true){
        this.facesService.getLiveCameras().subscribe(
          res => {
            this.cams = res['data'];
            this.remain();
          },
          err => console.error(err)          
        )
      }
    });
  }

}
