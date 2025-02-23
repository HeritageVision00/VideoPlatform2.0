import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/Account';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  relations: Array<any> =[];
  dateMessage: string;
  cams: Array<any> = [];
  algos: Array<any> = [];
  rois: Array<any> = [];
  date:any;
  heatmap: Boolean = false;
  remaining:  any = {
    cameras: 0
  }
  now_user: Account;
  constructor(private facesService: FacesService, private AccountService:AccountService) {}

  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
      this.facesService.getLiveMics().subscribe(
        res => {
          this.cams = res['data'];
        },
        err => console.error(err)
      );             
  }

  getCameras(){
    this.facesService.getCameras().subscribe(
      res => {
        this.cams = res['data'];
      },
      err => console.error(err)
    );
  }


  deleteCamera(id: string){
    if(confirm('Do you want to delete this microphone?')){
      this.facesService.deleteMic(id).subscribe(
        res =>{
          this.facesService.getLiveMics().subscribe(
            res => {
              this.cams = res['data'];
            },
            err => console.error(err)          
            )
        },
        err => console.log(err)
      )
      }
}

}
