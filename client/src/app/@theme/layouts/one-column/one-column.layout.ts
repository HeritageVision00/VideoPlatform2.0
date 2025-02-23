import { Component, Input, OnInit } from '@angular/core';
import { ThreeColumnsLayoutComponent } from '..';
import { AuthService } from "../../../services/auth.service";
import { api } from '../../../models/API'

@Component({
  selector: 'ngx-one-column-layout',
  styleUrls: ['./one-column.layout.scss'],
  template: `
  <div style="overflow: hidden !important;">
    <nb-layout windowMode class="red">
      <nb-layout-header display = "none" fixed *ngIf='authService.isLoggedIn == true && showHeader'>
        <ngx-header *ngIf = "showHeader"></ngx-header>
      </nb-layout-header>

      <nb-sidebar #sidebar [state]="state" class="menu-sidebar" tag="menu-sidebar" responsive *ngIf='authService.isLoggedIn == true && show' [ngStyle]='display()'>
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column [ngClass]="{'no-padding': !showHeader, bgcon: !authService.isLoggedIn}" [ngStyle]="style()">
        <ng-content select="router-outlet">
        </ng-content>
      </nb-layout-column>
    </nb-layout>
    </div>
  `,
})
export class OneColumnLayoutComponent implements OnInit{
  @Input() showHeader: true;
  @Input() state: true;
  @Input() show:boolean;
constructor(
  public authService: AuthService,
){
}

ngOnInit(): void {
}

style(){
  let styles 
  if(!this.authService.isLoggedIn) {
    styles = {
      background:  `url(${api}/pictures/backgrounds/black.jpg)`,
      padding: '0px !important',
      'background-size': 'cover',  /* Cover the entire area */
      'background-repeat': 'no-repeat', /* No tiling */
      'background-position': 'center', /* Center the background image */
      'min-height': '100vh', /* Ensure at least full height */
      'min-width': '100vw', /* Ensure at least full width */
    }
  }else {
    styles = {
      padding: '0px !important',
      'max-width': '100%',
      'box-sizing': 'border-box'
    };
  }
  return styles;
}

display(){
  let show;
  if(this.show == true){
    show = '';
  }else{
    show = 'none'
  }
  let nc ={
    'display': show,
  }
  return nc;
}
}
