import { Component, OnInit } from '@angular/core';
// import { AnalyticsService } from './@core/utils/analytics.service';
// import { SeoService } from './@core/utils/seo.service';
// import { Title } from '@angular/platform-browser';
// import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
// import { filter, map } from 'rxjs/operators';
import { TimezoneService } from './services/timezone.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'ngx-app',
  template: '<nb-layout><nb-layout-column style="padding-right: 0 !important; padding-left: 0 !important; padding-top: 0 !important; overflow:hidden !important;"><router-outlet></router-outlet></nb-layout-column></nb-layout>',
})
export class AppComponent implements OnInit {

  constructor(
    // private analytics: AnalyticsService, 
    // private seoService: SeoService,
    // private titleService: Title,
    // private router: Router,
    // private activatedRoute: ActivatedRoute,
    private timezone: TimezoneService,
    private authService: AuthService,
    ) {
  }
  info:any;

  ngOnInit(): void {
    this.info = JSON.parse(localStorage.getItem('info'))
    if(this.info === null){
      const timeZoneOffset = new Date().getTimezoneOffset();
      this.authService.saveInfo({
        timezone: this.timezone.offSetToTimezone(timeZoneOffset)
      });
    }
    // this.analytics.trackPageViews();
    // this.seoService.trackCanonicalChanges();
    // const appTitle = this.titleService.getTitle();
    // this.router
    //   .events.pipe(
    //     filter(event => event instanceof NavigationEnd),
    //     map(() => {
    //       let child = this.activatedRoute.firstChild;
    //       console.log(child.firstChild)
    //       console.log(child.snapshot.data['title'])
    //       while (child.firstChild) {
    //         child = child.firstChild;
    //       }
    //       if (child.snapshot.data['title']) {
    //         return child.snapshot.data['title'];
    //       }
    //       return appTitle;
    //     })
    //   ).subscribe((ttl: string) => {
    //     this.titleService.setTitle(ttl);
    //   });
  }
}
