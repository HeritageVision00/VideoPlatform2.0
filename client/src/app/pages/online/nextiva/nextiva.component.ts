import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { Account } from '../../../models/Account';
import { NbDateService } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-nextiva',
  templateUrl: './nextiva.component.html',
  styleUrls: ['./nextiva.component.scss']
})
export class NextivaComponent implements OnInit {

  constructor(
    private face: FacesService,
    protected dateService: NbDateService<Date>,
    private router: Router, 
  ) { }

  cameras: Array<any> = [{
    "ResourceID": "1600",
    "SiteResourceID": "bc519538-98e5-45af-bb34-9ea440c63f6f",
    "Name": "ONROAD_BEHIND_LEKHRAJ_MARKET_CAM04",
    "IsPtz": "false"
}]

  camSelected: any = ''
  loading: boolean = false
  loadingCams: boolean = true
  max: Date;
  max2: Date;
  min: Date;
  fin: Date;
  now_user: Account;
  rec = {
    start: null,
    end: null
  }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
    this.max = this.dateService.addDay(this.dateService.today(), 0);
    this.max2 = this.max
    this.face.nextivaCams().subscribe(
      res =>{
        this.cameras = res['data']
        this.loadingCams = false
        console.log(this.cameras)
      },
      err => {
        console.log(this.cameras)
        this.loadingCams = false
        console.error(err)
      }
    )
  }

  setMax(event){
    this.max = this.dateService.addDay(event, 0);
  }

  setMin(event){
    this.min = this.dateService.addDay(event, 0);
  }

  getRecording(){
    this.loading = true
    const body = {
      id: this.camSelected.ResourceID,
      timeStart: this.rec.start,
      timeEnd: this.rec.end,
      name: this.camSelected.Name
    }
    this.face.nextivaRecording(body).subscribe(
      res => {
        this.router.navigate(['/pages/search/list']);
        console.log(res)
      },
      err => {
        this.loading = false
        console.error(err)
      }
    )
  }

}
