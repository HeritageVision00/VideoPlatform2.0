import { Component, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { AccountService } from '../../services/account.service';
import { Account } from '../../models/Account';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service'

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {


  constructor(
    private themeService: NbThemeService,
    private accountserv: AccountService, 
    public authService: AuthService,
    private notificationService: NotificationService
  ) { }
  
    
  now_user:Account;
  
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
    // console.log('changig')
  }

  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'))
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
  }

  changeTheme(themeName: string) {
    try{
      this.handleChange('corporate')
      this.handleChange(themeName)
      this.authService.updateTheme(themeName)
    } catch (err){
      console.error(err)
    }
    
    this.accountserv.changeTheme({theme:themeName}, this.now_user.id).subscribe(
      res => {
      },
      err => console.error(err)
    )
  }

  requestPermission() {
    this.notificationService.requestPermission();
  }

  sendNotification() {
    this.notificationService.showNotification('Hello!', {
      body: 'This is a desktop/browser notification.',
      icon: '', // Optional: Path to an icon
    });
  }
}
