import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { FacesService } from "../services/faces.service";
import { NbWindowControlButtonsConfig, NbWindowService } from '@nebular/theme';
import { DeleteWinComponent } from '../pages/delete-win/delete-win.component';

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    public authService: AuthService,
    public router: Router,
    public facesService: FacesService,
    private windowService: NbWindowService,
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
      if(this.authService.isAdminClientBranch !== true){
        if(this.authService.isLoggedIn !== true) {
              return this.router.navigate(['/pages/sign-in'])
        } else {
          return this.router.navigate(['/pages/accounts'])
        }
      }
      this.facesService.mess().subscribe(
        res => {
          // console.log(res)
        },
        err => {
            const buttonsConfig: NbWindowControlButtonsConfig = {
              minimize: false,
              maximize: false,
              fullScreen: false,
              close: false,
            }
            const windowRef = this.windowService.open(DeleteWinComponent, { title: `Session expired`, context: { type: 6, data: { }}, buttons:  buttonsConfig, closeOnBackdropClick:false, closeOnEsc: false })
            windowRef.onClose.subscribe(() => {
              window.localStorage.clear();
              window.sessionStorage.clear();
            });
          }
          )
          return true;
      }
}
