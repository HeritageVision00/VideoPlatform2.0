import { Component, Input, OnInit } from '@angular/core';
import { NbDateService, NbWindowRef } from '@nebular/theme';
import { VmsService } from '../../../services/vms.service';
import { FacesService } from '../../../services/faces.service';
import { Account } from '../../../models/Account';

@Component({
  selector: 'ngx-recording-win',
  templateUrl: './recording-win.component.html',
  styleUrls: ['./recording-win.component.scss']
})
export class RecordingWinComponent implements OnInit {

  constructor(
    protected dateService: NbDateService<Date>,
    private vmsService: VmsService,
    protected windowRef: NbWindowRef,
    private facesService: FacesService,
  ) { }

  rec = {
    start: null,
    end: null
  }
  values = {
    start: "primary",
    end: "primary"
  }
  is_saving: boolean = false
  max: Date;
  max2: Date;
  min: Date;
  fin: Date;
  showRange: boolean;
  error: String = null;
  now_user: Account;

  @Input() data: any;

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    this.max2 = this.max
  }

  setMax(event){
    this.max = this.dateService.addDay(event, 0);
  }

  setMin(event){
    this.min = this.dateService.addDay(event, 0);
  }

  send(){
    this.is_saving = true
    const a = {
      start: this.rec.start.getTime()/1000,
      end: this.rec.end.getTime()/1000,
      cam_name: this.data.id,
    }
    this.vmsService.recording(a).subscribe(
      res => {
        const b = {
          name: this.data.name,
          video_url: res['data'].video_url
        }
        this.facesService.videoLink(b).subscribe(
          res => {
            let response = {
              cameraId: res['id'],
              id_account: this.now_user['id_account'],
              id_branch: this.now_user['id_branch']
            };
            this.facesService.doOneImage(response).subscribe(
              (res) => {
                this.is_saving = false
                this.windowRef.close(true);
              },
              (err) => {
                this.is_saving = false
                this.error = err.message
                console.error(err)
              }
            );
          },
          err => {
            this.is_saving = false
            this.error = err.message
            console.error(err)
          }
        )

      },
      err => {
        console.error(err)
        this.is_saving = false
        this.windowRef.close(false);
      }
    )
  }

}
