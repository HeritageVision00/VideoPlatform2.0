import { Component } from '@angular/core'
import { AuthService } from '../services/auth.service'
import { Router, NavigationEnd } from '@angular/router'
import { MENU_ITEMSADMIN, MENU_ITEMSBRANCH, MENU_ITEMSCLIENT, MENU_ITEMSUSER,MENU_ITEMSBRANCHSIDE } from './pages-menu';
import { FacesService } from '../services/faces.service'
import { VehiclesComponent } from './online/vehicles/vehicles.component';
import { PersonComponent } from './online/person/person.component';
import { NbThemeService, NbWindowService,NbWindowState } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
import { ColorpalleteComponent } from './online/colorpallete/colorpallete.component';
import { VideospeedComponent } from './online/videospeed/videospeed.component';
import { TimerangeComponent } from './online/timerange/timerange.component';
import { ViolencesumComponent } from './online/violencesum/violencesum.component';
import { CollapsesumComponent } from './online/collapsesum/collapsesum.component';
import { AbardonedsumComponent } from './online/abardonedsum/abardonedsum.component';
import { WeaponsumComponent } from './online/weaponsum/weaponsum.component';
import { OverspeedsumComponent } from './online/overspeedsum/overspeedsum.component';
import { AnprsumComponent } from './online/anprsum/anprsum.component';
import { BlacklistedpersonsumComponent } from './online/blacklistedpersonsum/blacklistedpersonsum.component';
import { AccidentssumComponent } from './online/accidentssum/accidentssum.component';
import { DisableService } from '../services/disable.service';
import { WrongwaysumComponent } from './online/wrongwaysum/wrongwaysum.component';
import { ZigzagsumComponent } from './online/zigzagsum/zigzagsum.component';
import { AccountService } from '../services/account.service';


@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout [showHeader] = "showHeader" [state] = "state" [show] = "show">
      <nb-menu style='font-family: Poppins !important;' [items]="menuAdmin" *ngIf='authService.isAdmin'></nb-menu>
      <nb-menu style='font-family: Poppins !important;' [items]="menuClient" *ngIf='authService.isClient && !authService.isClientBranch'></nb-menu>
      <nb-menu style='font-family: Poppins !important;' [items]="menuBranch" *ngIf='authService.isBranch || authService.isClientBranch' (click)='onclick()'></nb-menu>
      <nb-menu style='font-family: Poppins !important;' [items]="menuUser" *ngIf='authService.isUser'></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
    <ngx-two-columns-layout *ngIf='summerbutton == true' [showHeader] = "showHeader" [state] = "state" [show] = "show">
    <nb-menu [items]="menuSider" *ngIf='authService.isBranch || authService.isClientBranch' (click)="color($event)"></nb-menu>
    </ngx-two-columns-layout>
  `,
})
export class PagesComponent {
  hola: string = 'Made By Alex Kaiser';
  contact: string = 'i93kaiser@hotmail.com';
  showHeader: boolean = false;
  state: string = "collapsed";
  show:boolean = false;
  menuAdmin = MENU_ITEMSADMIN;
  menuClient = MENU_ITEMSCLIENT;
  menuBranch = MENU_ITEMSBRANCH;
  menuUser = MENU_ITEMSUSER;
  menuSider=MENU_ITEMSBRANCHSIDE;
  dataToSend: boolean;
  fr = {              
    title: 'FR Users',
    icon: 'browser-outline',
    link: 'management'
  }
  am = {              
    title: 'Attendance Management',
    icon: 'book-open-outline',
    link: 'attendance'
  }
  vs = {
    title: 'Video Summarization',
    icon: 'browser-outline',
    link: 'summarization'
  }
  vsd = {
    title: 'Video incident Report Gen',
    icon: 'browser-outline',
    link: 'uploadZip'
  }
  nextiva = {
    title: 'Nextiva Recordings',
    icon: 'browser-outline',
    link: 'recordings'
  }
  mic = {
    title: "Microphones",
    icon: "mic-outline",
    children: [
      {
        title: "Microphone List",
        link: "microphoneList",
      },
      {
        title: "Add Microphone",
        link: "microphone/add",
      },
    ],
  }

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];
  themeNow: any = {
    value: '',
    name: ''
  }
  handleChange(theme: string): void {
    this.themeService.changeTheme(theme);
  }

  private openedWindow: any;
  receivedData: any;
  summerbutton: any;
  constructor( 
    public authService: AuthService, 
    private router: Router,
    // private windowService: NbWindowService,
    private dialogService: NbDialogService, 
    private service: FacesService,
    private disableservice: DisableService,
    private accountserv: AccountService, 
    private themeService: NbThemeService,
  ) {
    if(authService.isLoggedIn && !authService.isAdmin){
      console.log('Latest Version...')
      this.service.setMenu().subscribe(
        res => {
          if(this.menuBranch.length === 8){
            if(res['data'].fr){
              this.menuClient.push(this.fr)
              this.menuBranch.push(this.fr)
            }
            if(res['data']['am']){
              this.menuClient.push(this.am)
              this.menuBranch.push(this.am)
            }
            if(res['data']['mic']){
              this.menuClient.push(this.mic)
              this.menuBranch.push(this.mic)
            }
            if(res['data']['vsd']){
              this.menuClient.push(this.vsd)
              this.menuBranch.push(this.vsd)
              this.menuBranch = this.menuBranch.filter(item => item.title !== "Cameras" && item.title !== "Dashboards" && item.title !== "Tickets" && item.title !== "Dashboards" && item.title !== "Accounts");
              this.menuBranch[2] =   {
                title: "Stored Videos",
                icon: "film-outline",
                children: [
                  {
                    title: "Forensic Search",
                    link: "search/bar",
                  },
                ],
              }
            }
            if(res['data']['vms'] === 'Nextiva'){
              this.menuClient.push(this.nextiva)
              this.menuBranch.push(this.nextiva)
            }
            // if(res['data']['vs']){
            //   this.menuClient.push(this.vs)
            //   this.menuBranch.push(this.vs)
            // }            
          }
          this.accountserv.getTheme(JSON.parse(localStorage.getItem('now_user')).id).subscribe(
            res => {
              const theme = res['theme']
              for(const them of this.themes){
                if(them.value === theme){
                  this.themeNow = {
                    value: theme,
                    name: them.name
                  }
                  break;
                }
              }
              try{
                if(theme != null){
                  this.handleChange('corporate')
                  this.handleChange(theme)
                }
              } catch (err){
                console.error(err)
              }          
            },
            err => console.error(err)
          )
        },
        err => console.error(err)
      )
    }
    if(authService.isAdmin){
      router
    }
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        if(val.url == '/pages/graphs'){
          this.showHeader = false;
          this.state = "collapsed";
          this.show = false;
        }else{
          this.show = true
          this.showHeader = true;
          this.state = "compacted";
        }
        if(val.url.split('/').length === 7 ){
          this.state ="collapsed"
          this.showHeader = false;
        }
        
      }
  });
  // sidebar//**************************** */
  const intervalId = setInterval(() => {
    this.receivedData = this.disableservice.getData();
    this.summerbutton=this.receivedData
    // console.log(this.receivedData,'hhhhhhhhhhhhhhhhppppppppppppp')
}, 1000);
// sidebar//**************************** */
  }
  
  
  // color(title: string) {
  //   // Access the clicked item here
  //   // if (item && item.title) {
  //   //   console.log(item.title);
  //   // }
  //   //  console.log(item);
  //   console.log(title); 
  //(click)="color($event.target.innerText.trim())"
  
  // }
  color(event: any) {
    const targetTitle = event.target.getAttribute('title');
    const targetText = event.target.innerText ? event.target.innerText.trim() : null;
    //const title=targetText || event || ' ';const target = event.target as HTMLElement;
    const title = targetTitle || targetText ;
    //const title = event.target.innerText.trim();
    const componentMap: Record<string, any> = {
      'Car (Vehicles)': VehiclesComponent,
      'Person Attributes':PersonComponent,
      'Colour':ColorpalleteComponent,
      'video Speed':VideospeedComponent,
      'Time Range':TimerangeComponent,
      'Violence':ViolencesumComponent,
      "Collapse":CollapsesumComponent,
      "Abandoned objects":AbardonedsumComponent,
      "Weapons":WeaponsumComponent,
      'Over Speeding':OverspeedsumComponent,
      'Vehicle Lookup (ANPR)':AnprsumComponent ,
      "Blacklisted Person":BlacklistedpersonsumComponent,
      'Accidents':AccidentssumComponent,
      'Wrong way':WrongwaysumComponent,
      'Zig-zag':ZigzagsumComponent,
      
      // Add more mappings as needed for other menu items
    };

    const component = componentMap[title];
    if (component) {
      //this.windowService.close();
      if (this.openedWindow) {
        this.openedWindow.close();
      }
      this.openedWindow=this.dialogService.open(component, {
        context: {
          title: 'New Window',
          template: 'newwindow',
        }, 
        
      });
    } else {
      console.error('Component not found for menu item:', title);
    }
  }
  //******************* */windowService
  // color(event: any) {
  //   // Access the clicked item's title property
  //   const title = event.target.innerText.trim(); // real working
  //   console.log(title);
  // }
  //******************* */
  // openWindow() {
  //   this.windowService.open(VehiclesComponent, {
  //     context: {
  //       title: 'New Window',
  //       template: 'newwindow',
  //     },
  //   });
  // }
  ngOnDestroy() {
     
    if (this.openedWindow) {
      this.openedWindow.close();
    }
  }
  onclick(){
    this.dataToSend = false;
    this.disableservice.setData(this.dataToSend);
  }

}
