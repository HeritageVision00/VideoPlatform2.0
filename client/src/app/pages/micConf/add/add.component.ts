import { Component, OnInit, HostBinding } from '@angular/core';
import { Camera } from '../../../models/Camera';
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbWindowService } from '@nebular/theme';
import { Account } from '../../../models/Account';
import { FileComponent } from '../file/file.component';

@Component({
  selector: 'ngx-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AddComponent implements OnInit {
  @HostBinding('class') classes ='row';

  camera: Camera = {
    id: '',
    name: '',
    rtsp_in: '',
    atributes : {
      longitude: "",
      latitude: ""
    }
  };
  values: any = {
    rtsp: 'primary',
    name: 'primary'
  }
  now_user: Account;
  edit : boolean = false;
  submitted: boolean = false;
  is_saving : boolean = false;

  constructor(
    private facesService: FacesService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private toastrService: NbToastrService,
    private windowService: NbWindowService,
    ) { }

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    const params = this.activatedRoute.snapshot.params;
    if(params.uuid){
      this.facesService.getCamera(params.uuid)
      .subscribe(
        res =>{
          this.camera = res['data'];
          this.edit = true;
        },
        err => console.error(err)
      )
    }
  }

  saveCamera(){
    this.submitted = true;
    this.values = {
      rtsp: 'primary',
      name: 'primary'
    }
    if(this.camera.name != ''){
      if(this.camera.rtsp_in != ''){
    this.is_saving = true;
    this.facesService.saveMic(this.camera)
    .subscribe(
      res=>{
        this.router.navigate(['/pages/microphoneList']);
      },
      err => {
        // console.error(err)
        this.is_saving = false;
        if(err.error.type == 'rtsp'){
          this.values.rtsp = 'warning'
        }
        if(err.error.type == 'camera'){
          this.showToast(err.error.message)
        }
      }
    )
  }else{
    this.values.rtsp = 'danger'
  }
  }else{
    this.values.name = 'danger'
  };
}


destroyByClick = true;
duration = 10000;
hasIcon = true;
position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
preventDuplicates = false;
status: NbComponentStatus = 'warning';

private showToast( body: string) {
  const config = {
    status: this.status,
    destroyByClick: this.destroyByClick,
    duration: this.duration,
    hasIcon: this.hasIcon,
    position: this.position,
    preventDuplicates: this.preventDuplicates,
  };
  const titleContent = 'Warning';

  this.toastrService.show(
    body,
    `${titleContent}`,
    config);
}

updateCamera(){
  this.is_saving = true;
  this.facesService.updateCamera(this.camera.id, this.camera)
  .subscribe(
  res => {
    this.router.navigate(['/pages/camerasList']);
  },
  err => console.log(err)
);
}

openWindowForm() {
  const windowRef = this.windowService.open(FileComponent, { title: `Upload Audio File`, context: { }});
  windowRef.onClose.subscribe((data) => {
    if(data){
      // this.data = data.data
      // this.data.time = this.datepipe.transform(this.data.time, 'HH:mm:ss yyyy-M-dd', this.tz);
      // this.message = `${this.data.name} was registered for ${this.list[parseInt(event)]} at ${this.data.time}`
    }
  });
}
}
