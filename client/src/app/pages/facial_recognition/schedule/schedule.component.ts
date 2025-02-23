import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Day } from '../../../models/Day';
import { FacesService } from '../../../services/faces.service';
import { NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { DeleteWinComponent } from '../../delete-win/delete-win.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {


  day: Day = {
    id: 0,
    user_id: 0,
    day: 0,
    entrance: "",
    leave: ""
  };

  data: any = [
    ["", "", "", "", "", "", ""],
    ["", "", "", "", "", "", ""]
  ]

  oriStart: string[] = ["", "", "", "", "", "", ""];
  oriEnd: string[] = ["", "", "", "", "", "", ""];

  constructor(
    private activatedRoute: ActivatedRoute,
    private facesService: FacesService,
    private router: Router,
    private windowService: NbWindowService,
  ) { }
  all:boolean = false;
  days:boolean[] = [false,false,false,false,false,false,false];
  in:boolean = false;
  out:boolean = false;
  time:any;
  empty: boolean = true;

change(i){
  if(i == 0){
    this.in = true;
    this.out = false;
  }else if(i == 1){
    this.in = false;
    this.out = true;
  }
}

  addThem(){
    if(this.in == true){
      for(var a in this.oriStart){
        if(this.days[a] == true){
          this.oriStart[a] = this.time;
        }
      }
    }else if(this.out == true){
      for(var a in this.oriEnd){
        if(this.days[a] == true){
          this.oriEnd[a] = this.time;
        }
      }
    }
  }

delThis(io:number,day:number){
if(io == 0){
  this.oriStart[day] = "";
}else if(io == 1){
  this.oriEnd[day] = "";
}
}

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    this.day.user_id = params.id;
    this.init_sub();
  }

  init_sub() {
    this.facesService.getAllSchedule(this.day.user_id)
        .subscribe(
          (res:any[]) => {
            console.log(res)
            if(res['data'].length !== 0){
              this.empty = false
            }
            for(const day of res['data']){
              this.data[0][day.day] = day.entrance
              this.data[1][day.day] = day.leave_time
              this.oriStart[day.day] = day.entrance
              this.oriEnd[day.day] = day.leave_time
            }
          },
          err => console.error(err)
      )
  }

  allSel(){
    if(this.all == false){
      this.days[0] = true;
      this.days[1] = true;
      this.days[2] = true;
      this.days[3] = true;
      this.days[4] = true;
      this.days[5] = true;
      this.days[6] = true;
    }else if(this.all == true){
      this.days[0] = false;
      this.days[1] = false;
      this.days[2] = false;
      this.days[3] = false;
      this.days[4] = false;
      this.days[5] = false;
      this.days[6] = false;
    }
  }

  submit(startOne, startTwo, startThr, startFou, startFif, startSix, startSev,
  endOne, endTwo, endThr, endFou, endFif, endSix, endSev) {
    this.submit_sub(startOne, endOne, 0);
    this.submit_sub(startTwo, endTwo, 1);
    this.submit_sub(startThr, endThr, 2);
    this.submit_sub(startFou, endFou, 3);
    this.submit_sub(startFif, endFif, 4);
    this.submit_sub(startSix, endSix, 5);
    this.submit_sub(startSev, endSev, 6);
    this.router.navigate(['/pages/management']);
  }

  deleteSchedule(){
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true,
    }
    const windowRef = this.windowService.open(DeleteWinComponent, { title: `Do you want to delete this schedule?`, context: { type: 3, data: { id: this.day.user_id }}, buttons:  buttonsConfig, closeOnBackdropClick:true, closeOnEsc: true })
    windowRef.onClose.subscribe((data) => {
      if(data === true){
        this.router.navigate(['/pages/management']);
      }
    });
  }

  submit_sub(start, end, day){
    if(start === this.data[0][day] && end === this.data[1][day]){
      return
    }
        let current_day : Day = {
          id: 0,
          user_id: this.day.user_id,
          day: day,
          entrance: start,
          leave_time: end
        };
            if(this.data[0][day] == ""){
              this.facesService.saveSchedule(current_day)
              .subscribe(
                res=>{
                  this.oriStart[day] = start;
                  this.oriEnd[day] = end;
                },
                err => console.error(err)
                )
              } else {
                delete current_day.id
                this.facesService.updateSchedule(current_day)
                .subscribe(
                  res=>{
                    this.oriStart[day] = start;
                    this.oriEnd[day] = end;
                  },
                  err => console.error(err)
                )
              }
      }
  // }
}
