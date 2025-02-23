import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { api } from '../../../models/API'
import { Account } from '../../../models/Account';
import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { DisableService } from '../../../services/disable.service';


@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

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

  currentTheme = 'dark';
  pic: string;
  now_user: Account;

  userMenu = [ { title: 'Profile' }, { title: 'Log out' } ];
  receivedData: any;
  summerbutton: boolean;
  dataToSend: boolean;

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private authservice: AuthService,
              public router: Router,
              private disableservice: DisableService,
              ) {
                this.pic = `${api}/pictures/heritageVision.png`
  }

  signOff(){
   const us = JSON.parse(localStorage.getItem('now_user'))['username']
   this.authservice.signOut(us).subscribe(
    res=>{
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.reload()
      // this.router.navigate(['/'])
    }, err =>{ 
      console.error(err)
      window.localStorage.clear();
      window.sessionStorage.clear();
      window.location.reload()
      // this.router.navigate(['/'])
    }
)
  }


  ngOnInit() {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
    this.currentTheme = this.themeService.currentTheme;
    // this.receivedData = this.disableservice.getData();
    this.receivedData = this.disableservice.getData();

// Set up setInterval with an arrow function to fetch data and update receivedData every 3 seconds

// sidebar//**************************** */
const intervalId = setInterval(() => {
    this.receivedData = this.disableservice.getData();
    this.summerbutton=this.receivedData
    // console.log(this.receivedData,'hhhhhhhhhhhhhhhh')
}, 1000);
// sidebar//**************************** */
 
    // console.log(this.receivedData,'hhhhhhhhhhhhhhhh')

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.nick);

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }
  toggleSidebarr(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebarr');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  onclick(){
    this.dataToSend = false;
    this.disableservice.setData(this.dataToSend);
  }
}
