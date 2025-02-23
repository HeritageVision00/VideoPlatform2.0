import { Component, OnDestroy, OnInit, HostListener } from '@angular/core';
import { FacesService } from '../../../../services/faces.service';
import { Account } from '../../../../models/Account';
import { AccountService } from '../../../../services/account.service';
import { api } from '../../../../models/API'
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService, NbToastRef, NbToastrConfig } from '@nebular/theme';
import { WsService } from '../../../../services/ws.service';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from '../../../../models/WsMess';
import { interval } from 'rxjs';
import { DisableService } from '../../../../services/disable.service';

@Component({
  selector: 'ngx-center',
  templateUrl: './center.component.html',
  styleUrls: ['./center.component.scss'],
  styles: [ ':host {height: 100% !important}']
})
export class CenterComponent implements OnInit, OnDestroy {
  alertbel: any;
  valuetrue:Boolean=true;
  andata: any;
  andataEntries: [string, unknown][];
  loitalert: any;
  analyticname: any;
  specificanalyticvalue: boolean=false;
  realanalyticname: any;

  constructor(
    private accountserv: AccountService,
    private face: FacesService,
    private toastrService: NbToastrService,
    private ws: WsService,
    private disableservice: DisableService,
    ) { 
      this.wsConnection = this.ws.connection()
      // this.ws.onMessage().subscribe((message) => {
      //   console.log('Received message:', message);
      //   // this.messages.push(message);
      // });
    }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    const screenWidth = window.innerWidth;
    this.isCollapsed = screenWidth < 1057;
  }

  info: any = []
  cameras: Array<any> = [];
  dispCameras: Array<any> = [];
  camera = '';
  rel:boolean = false;
  reCache: number;
  now_user: Account;
  analytics: Array<any>
  analytic ={
    algo_id: -1,
    name: ''
  }
  overview ={
    algo_id: -3,
    name: 'General Dashboard',
    status: "'primary'"
  }

  liveView  = {
    algo_id: -4,
    name: 'Live View',
    status: "'primary'"
  }

pic:string = `${api}/pictures/heritageVision.png`

  aaa(event){
    let id,type;
    id = this.analytic.algo_id
    if(typeof event !== 'number'){
      this.camera = event
    }

    if(this.analytic.algo_id !== -3){
      const cams = []
      for(const cam of this.dispCameras){
        let found = false;
        for(const rel of cam.rels){
          if(typeof event === 'number'){
            if(rel.algo_id === event){
              cams.push(cam)
              found = true;
              break;
            }
          }else {
            if(rel.algo_id === this.analytic.algo_id){
              cams.push(cam)
              found = true;
              break;
            }
          }
        }
        if (found) {
          continue;
        }
      }
      this.cameras = cams
    }else {
      this.cameras = this.dispCameras
    }
    
    if(this.reCache != undefined){
      id = this.reCache
    }
    if(this.now_user.id_branch == '0000'){
      type = 'show'
    }
    this.face.checkRel({id: this.camera, algo_id: id, type: type}).subscribe(res=>{
      if(this.analytic.algo_id != -1 && this.analytic.algo_id != -2 && this.analytic.algo_id !== 80){
        this.reCache = this.analytic.algo_id
      }
      let p = false;
      if(res['message']){
        p = false
      }else {
        p = res['fact']
      }
      this.rel = p;
      if(this.rel == false && this.camera != 'abc' && this.analytic.algo_id !== 80 && id !== -3 && id !== -6){
        this.analytic.algo_id = -2;
      }else{
        this.analytic.algo_id = this.reCache
      }
    },err => console.error(err))
  }

  reload(alg){
    if(this.analytic.algo_id !== -3){
      const cams = []
      for(const cam of this.dispCameras){
        let found = false;
        for(const rel of cam.rels){
          if(rel.algo_id === this.analytic.algo_id){
            cams.push(cam)
            found = true;
            break;
          }
        }
        if (found) {
          continue;
        }
      }
      this.cameras = cams
    }else {
      this.cameras = this.dispCameras
    }
    let id,type;
    id = this.analytic.algo_id
    if(this.reCache != undefined){
      id = this.reCache
    }
    if(this.now_user.id_branch == '0000'){
      type = 'show'
    }
    this.face.checkRel({id: this.camera, algo_id: id, type: type}).subscribe(res=>{
      if(this.analytic.algo_id != -1 && this.analytic.algo_id != -2 && this.analytic.algo_id !== 80){
        this.reCache = this.analytic.algo_id
      }
      let p = false;
      if(res['message']){
        p = false
      }else {
        p = res['fact']
      }
      this.rel = p;
      if(this.rel == false && this.camera != 'abc' && this.analytic.algo_id !== 80 && id !== -3 && id !== -6){
        this.analytic.algo_id = -2;
      }else{
          this.analytic.algo_id = this.reCache;
      }
    },err => console.error(err))
  
  }

  ngOnDestroy(): void {
    this.wsConnection.complete();
  }

  valuetrueee(){
    this.valuetrue=false
    this.specificanalyticvalue=  true
    this.andata=this.disableservice.retuanadata()
  }
  realgeneral(){
    this.valuetrue=true
    this.specificanalyticvalue= false
  }
  handleClick(alg: any): void {
    this.realanalyticname=alg.name
  }

  isMatch(name: string): boolean {
    return (this.alertbel && this.alertbel.hasOwnProperty(name));
  }
  getAlertValue(name: string): number {
    return this.alertbel[name] || 0;
  }

  dispThreats: boolean = false;
  wsConnection: WebSocketSubject<any>;
  private pingInterval: any;
  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    this.analytic = this.overview
    this.checkScreenWidth();
    // this.pingInterval = setInterval(() => {
    //   this.wsConnection.send(JSON.stringify({ type: 'ping' }));
    //   console.log('Sent ping');
    // }, 10000);

    // this.pingInterval = interval(10000).subscribe(() => {
    //   this.wsConnection.next({ type: 'ping' });
    //   console.log('Sent ping');
    // });
    this.ws.info().subscribe(
      res => {
        try {
          this.wsConnection.subscribe(
            (message) => {
              if(message.Analytic === 66){
                this.showToast(`Please look at camera ${message.Parameters.camera_name}`, 'danger', message.CameraId, 66);
              }
            },
            (error) => {
              // console.error(error);
              // this.ws.tryReconnect()
            },
            () => {
              // console.error('damn')
              // this.ws.tryReconnect()
            }
          );
        } catch (err) {
          
        }
      },
      err => {
      }
    )

    this.face.getDashboard().subscribe(
      res=>{
        this.info = res['data']
        if(this.info['analyticsT'].length != 0){
          this.dispThreats = true
        }
        this.analytics = this.info.analyticsP.concat(this.info.analyticsT)
        this.analytics.sort((a, b) => {
          if (a.name < b.name) return -1; // a comes before b
          if (a.name > b.name) return 1;  // a comes after b
          return 0; // names are equal
        })
        this.analytics = this.analytics.filter(analytic => analytic.algo_id !== -6)
        if(this.now_user.id_branch != '0000'){
          this.face.getCamerasAll().subscribe(
            res =>{
              this.cameras = res['data']
              this.dispCameras = res['data']
            },
            err => console.error(err)
          )
        }else{
          this.accountserv.getAccount('client').subscribe(
            res =>{
              this.cameras = res['data']
              this.dispCameras = res['data']
            },
            err => console.error(err)
          )
        }

      },
      err => console.error(err)
    )
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('.');
  }

  isCollapsed: boolean = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  getClassName(alg: any) {
    // Determine the theme suffix based on the user's theme
    const themeSuffix = (this.now_user.theme === 'dark') ? '-dark' 
                     : (this.now_user.theme === 'cosmic') ? '-cosmic' 
                     : '';

    // Determine the base class name based on the condition between analytic and alg
    const baseClassName = (this.analytic !== alg) ? 'algo-menu' : 'algo-menu-selected';

    // Combine them
    return baseClassName + themeSuffix;
  }

  getOverviewClassName() {
    // Determine the theme suffix based on the user's theme
    const themeSuffix = (this.now_user.theme === 'dark') ? '-dark' 
                     : (this.now_user.theme === 'cosmic') ? '-cosmic' 
                     : '';

    // Determine the base class name based on the condition between analytic and overview
    const baseClassName = (this.analytic !== this.overview) ? 'algo-menu' : 'algo-menu-selected';

    // Combine them
    return baseClassName + themeSuffix;
  }

  destroyByClick = true;
  duration = 20000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;

  private showToast( body: string, status: NbComponentStatus, camId: string, algoId: number) {
    const config = {
      status: status,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
      icon: 'alert-triangle-outline'
    };
    const titleContent = 'Fire!';

    const toastrRef: NbToastRef = this.toastrService.show(
      body,
      `${titleContent}`,
      config);
    ((<any>toastrRef)['toastContainer']).nativeElement.addEventListener('click', () => {
      for(const alg of [...this.info.analyticsP, ...this.info.analyticsT]){
        if(alg.algo_id === algoId){
          this.analytic = alg
          this.aaa(camId)
        }
      }
    })
  }

}
