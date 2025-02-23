import { Component, OnDestroy, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { DeleteWinComponent } from '../../delete-win/delete-win.component';
import { Router } from '@angular/router';
import{ DisableService }from '../../../services/disable.service';
import { Subscription } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { WsService } from '../../../services/ws.service';

@Component({
  selector: 'ngx-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  disableValue: boolean = false;
  componentBoolean: boolean;
  isDisabled: boolean;
  private subscription: Subscription;
  dataToSend: boolean=false;

  constructor(
    private face: FacesService,
    private windowService: NbWindowService,
    private disableservice: DisableService,
    private router: Router,
    private ws: WsService,
    ) { 
      //this.disableValue = this.disableService.getInitialValue();
      this.wsConnection = this.ws.status()

    // Subscribe to changes in the real$ observable
    this.subscription=this.disableservice.real$.subscribe(updatedValue => {
      this.disableValue = updatedValue;
      // console.log('Updated value in component:', this.disableValue);
    });
    this.disableservice.real$.subscribe(updatedValue => {
      // console.log('Updated real value from service:', updatedValue);
    });
    this.disableservice.real$.subscribe(updatedValue => {
      // console.log('Updated real value from service:', updatedValue);
    });
    }
     

    // displaySummarizedVideo(): void {
    //    this.router.navigate(['/summarized-videos'], {
    //   //   queryParams: {
    //   //     link1: videoLink,
    //   //     link2: videoLink2
    //   //   }
    //   // });
    // });
    // }

    ngOnDestroy(): void {
      this.end()
    }
    statusCam = {}

    end(){
      this.wsConnection.complete();
      const data = {
        start: false
      }
      this.ws.startStop(data).subscribe()
    }

    status(id) {
      if (this.statusCam[id] <= 25) {
        return 'danger';
      } else if (this.statusCam[id] <= 50) {
        return 'warning';
      } else if (this.statusCam[id] <= 75) {
        return 'info';
      } else {
        return 'success';
      }
    }
  
    wsConnection: WebSocketSubject<any>;

    statusMult: boolean = false
    vs: boolean = false
    test: boolean = true
    multSum(status){
      this.statusMult = true
      if(status === true){
        const vids = {}
        let param = ''
        for(const vid of this.videos){
          if (vid.sum) {
            vids[vid.id] = true
            if(param === ''){
              param = vid.id
            }else{
              param = `${param}_${vid.id}`
            }
          }
        }
        this.router.navigate([`/pages/cameras_conf/summer/${param}`]);
      }
    }
    cancelMultSum(){
      this.statusMult = false
    }

    videos: Array<any> = [];
      relations: Array<any> =[];
        algos: Array<any> =[];
         summarized: Array<any> = [];
          heatmap: Boolean = false;

  ngOnInit(): void {
    this.face.setMenu().subscribe(
      res => {
        if(res['data']['vs']){
          this.vs = true
          const data = {
            start: true
          }
          this.ws.startStop(data).subscribe(
            res => {
              this.wsConnection.subscribe(
                (message) => {
                  if(message.cams){
                    this.statusCam = message.cams
                    let count = 0
                    for(const stats of Object.keys(this.statusCam)){
                      if(this.statusCam[stats] === 5){
                        continue
                      }
                      if(this.statusCam[stats] === 300){
                        count++
                      }
                      this.statusCam[stats] = (Math.round((this.statusCam[stats] / 3)* 100) / 100)
                    }
                    if(count === Object.keys(this.statusCam).length){
                      this.end()
                    }
                  }
                },
                (error) => {
                  console.error(error);
                  // this.ws.tryReconnect()
                },
                () => {
                  // console.error('damn')
                  // this.ws.tryReconnect()
                }
              );
            },
            err => {
              console.error(err)
            }
          )
        }            
      },
      err => console.error(err)
    )
    //this.isDisabled = this.disableService.getInitialValue();
    // this.disableservice.real$.subscribe(updatedValue => {
    //   this.disableValue = updatedValue;
    //   console.log('Updated value in component:', this.disableValue);
    // });
    // this.disableservice.real$.pipe(startWith(this.disableservice.realSubject.value))
    //   .subscribe(updatedValue => {
    //     this.disableValue = updatedValue;
    //     console.log('Updated value in component:', this.disableValue);
    //   });
    // this.disableservice.getCurrentRealValue().subscribe(initialValue => {
    //   this.disableValue = initialValue;
    //   console.log('Initial value in component:', this.disableValue);
    // });

    // // Subscribe to changes in the real$ observable
    // this.disableservice.real$.subscribe(updatedValue => {
    //   this.disableValue = updatedValue;
    //   console.log('Updated value in component:', this.disableValue);
    // });
    this.disableservice.real$.subscribe(value => {
      this.componentBoolean = value;
      // console.log('Received value in component:', this.componentBoolean);
    });
    this.disableservice.real$.subscribe(updatedValue => {
      // console.log('Updated real value from service:', updatedValue);
    });
    //console.log(this.disableService.data)
    this.getVids();
  }
  sendData() {
    this.dataToSend = true;
    this.disableservice.setData(this.dataToSend);
  }

  getVids(){
    this.face.viewVids().subscribe(
      res => {
        this.videos = res['data'];
          this.face.getAllRelations().subscribe(
            res => {
              this.relations = res['data'];
              this.face.getAlgos().subscribe(
                res => {
                  this.algos = res['data'];
                  for(let i = 0; i < this.algos.length; i++){
                    if(this.algos[i]['name'] == 'Heatmap' && this.algos[i]['available'] == 1){
                      this.heatmap = true;
                    }
                  }
                  for(let u = 0; u < this.algos.length; u++){
                    for(let i = 0; i < this.videos.length; i++){
                      this.statusCam[this.videos[i]['id']] = 0
                      for(let e = 0; e < this.relations.length; e++){
                         if(this.algos[u]['name'] == 'Heatmap' && this.algos[u]['id'] == this.relations[e]['algo_id'] && this.relations[e]['camera_id'] == this.videos[i]['id']){
                            this.videos[i].hm = true;
                        }
                      }
                    }
                  }
                  this.videos = this.videos.slice().sort(this.sortByDate);
                },
                err => console.error(err)
              );
            },
            err => console.error(err)
          );
      },
      err => {
        console.error(err);
      },
    );
  }

  sortByName(a, b) {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  }

  sortByDate(a, b) {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    return dateB - dateA;
  }

  deleteVideo(camera) {
    let camName = camera.name
    if(camera.rtsp_in.split('videos/')[1].split('/').length > 1){
      camName = camera.rtsp_in.split('videos/')[1]
    }
    const body = {
      vidName: camName,
      uuid: camera.id,
      which: camera.stored_vid
    };
    const buttonsConfig: NbWindowControlButtonsConfig = {
      minimize: false,
      maximize: false,
      fullScreen: false,
      close: true,
    }
    const windowRef = this.windowService.open(DeleteWinComponent, { title: `Do you want to delete this video?`, context: { type: 4, data: { body: body }}, buttons:  buttonsConfig, closeOnBackdropClick:true, closeOnEsc: true })
    windowRef.onClose.subscribe((data) => {
      if(data === true){
        this.getVids();
      }
    });
  }

}
