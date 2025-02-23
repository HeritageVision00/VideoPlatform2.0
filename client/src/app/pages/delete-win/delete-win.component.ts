import { Component, Input, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { FacesService } from '../../services/faces.service';
import { AnnotationsService } from '../../services/annotations.service';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'ngx-delete-win',
  templateUrl: './delete-win.component.html',
  styleUrls: ['./delete-win.component.scss']
})
export class DeleteWinComponent implements OnInit {

  constructor(
    protected windowRef: NbWindowRef,
    private facesService: FacesService,
    private annserv: AnnotationsService,
    private accountserv: AccountService,
  ) { }
  @Input() type: any;
  @Input() data: any;
  
  ngOnInit(): void {
  }

  cancel(){
    this.windowRef.close(false);
  }

  reload(){
    this.windowRef.close(true);
  }

  confirm(){
    if(this.type === 0){
      this.facesService.deleteUser(this.data.id, this.data.n).subscribe(
        res =>{
          this.windowRef.close(true);
        },
        err => {
          console.log(err)
          this.windowRef.close(true);
        }
      )
    }
    else if(this.type === 1){
      this.facesService.deleteCamera(this.data.id).subscribe(
        res =>{
          this.windowRef.close(true);
        },
        err => console.log(err)
      )
    }
    else if(this.type === 2){
      this.annserv.deleteImage(this.data.del).subscribe(
        res =>{
          this.windowRef.close(true);
        },
        err => {
          console.error(err)
          this.windowRef.close(true);
        }
      )
    }
    else if (this.type === 3){
      this.facesService.deleteSchedule(this.data.id).subscribe(
        res =>{
          this.windowRef.close(true);
        },
        err => console.log(err)
      )
    } else if(this.type === 4){
      this.facesService.delVid(this.data.body).subscribe(
        res => {
          this.windowRef.close(true);
        });
    } else if(this.type === 5){
      this.accountserv.deleteAccount(this.data.id,this.data.role).subscribe(
        res => {
          this.windowRef.close(true);
        }
      );
    } else if(this.type === 7){
      this.windowRef.close(true);
      this.facesService.deletePairOfVideos(this.data).subscribe(
        res => {
          this.windowRef.close(true);
        },
        err => {
          console.error(err)
        }
      )
    }
  }

}
