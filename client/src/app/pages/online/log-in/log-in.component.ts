import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { api } from '../../../models/API'
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'ngx-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {


  googleOrMsDev: boolean = false;
  registerForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  
  error:any = {
    err: false,
    message : ''
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  values = {
    username: 'primary',
    password: 'primary',
    login: 'primary'
  }
  pic: string;

  constructor(    
    public authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router,
    private toastrService: NbToastrService,
    private socialAuthService: SocialAuthService,
    private msService: MsalService
    ) {
      this.pic = `${api}/pictures/heritageVision.png`
     }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
    remember: [false],
    });
    this.registerForm.get('username').valueChanges.subscribe(value => {
      if(this.registerForm.get('username').value != ''){
        this.waitUser = false;
      }
    });
    this.registerForm.get('password').valueChanges.subscribe(value => {
      if(this.registerForm.get('password').value != ''){
        this.waitPass = false;
      }
    });
  }

  get f() { return this.registerForm.controls; }

  iconGoogle(){
    let icon = {
    'background': "url('" + api + "/pictures/googleLogo.png') 100% 100% no-repeat",
    'display': 'inline-block',
    'vertical-align': 'middle',
    'width': '42px',
    'height': '42px',
    'background-size': '100%'
    }
    return icon;
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((data) => {
        this.authService.loginGoogle(data).subscribe(
          data => {
            this.authService.saveToken(data.user.accessToken);
            this.authService.saveUser(data.user);
            this.router.navigate(['/pages'])
            this.isLoggedIn = true;
            this.roles = this.authService.getUser().roles;
            window.location.reload()
          },
          err => {
            if(err.error.type == 'disable'){
              this.showToast(err.error.message)
            }
            if(err.error.type == 'logged'){
              this.showToast(err.error.message)
            }
            if(err.error.type == 'user'){
              this.showToast(err.error.message)
            }
            window.localStorage.clear();
            window.sessionStorage.clear();
          }
        )
      });
  }

  loginWithMs() {
    this.msService.loginPopup()
      .subscribe({
        next: (result) => {
          this.authService.loginMs(result).subscribe(
          data => {
            this.authService.saveToken(data.user.accessToken);
            this.authService.saveUser(data.user);
            this.router.navigate(['/pages'])
            this.isLoggedIn = true;
            this.roles = this.authService.getUser().roles;
            window.location.reload()
          },
          err => {
            if(err.error.type == 'disable'){
              this.showToast(err.error.message)
            }
            if(err.error.type == 'logged'){
              this.showToast(err.error.message)
            }
            if(err.error.type == 'user'){
              this.showToast(err.error.message)
            }
            window.localStorage.clear();
            window.sessionStorage.clear();            
          }
        )

        },
        error: (error) => {
          console.log(error)
        }
      });
  }
  loginDisplay: boolean = false

  iconMs(){
    let icon = {
      'background': "url('" + api + "/pictures/Microsoft_logo.svg.png') 100% 100% no-repeat",
      'display': 'inline-block',
      'vertical-align': 'middle',
      'width': '42px',
      'height': '42px',
      'background-size': '100%'
      }
      return icon;
  }

  waitUser: boolean = false;
  waitPass: boolean = false;
  onSubmit(){
    this.submitted = true;
    this.loading = true;
    this.waitUser = false
    this.waitPass = false
    this.values = {
      username: 'primary',
      password: 'primary',
      login: 'primary'
    }
    if (this.registerForm.status === "INVALID") {
      const controls = this.registerForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
            this.registerForm.controls[name].setErrors({required:true})
              this.values[name] = 'danger';
              if(name === 'username'){
                this.waitUser = true;
              }
              if(name === 'password'){
                this.waitPass = true;
              }
          }
      }
      this.errorMessage = "Input required"
      this.loading = false;
      return;
    }
    this.registerForm.controls['username'].setErrors(null)
    this.registerForm.controls['password'].setErrors(null)
    this.authService.login(this.registerForm.value).subscribe(
      data => {
        this.authService.saveToken(data.user.accessToken);
        this.authService.saveUser(data.user);
        this.isLoggedIn = true;
        this.roles = this.authService.getUser().roles;

        window.location.reload()
      },
      err => {
        this.errorMessage = err.error.message;
        if(err.error.type == 'user'){
          this.waitUser = true
          this.values.username = 'danger'
          this.registerForm.controls['username'].setErrors({required:true})
        }
        if(err.error.type == 'password'){
          this.waitPass = true
          this.values.password = 'danger'
          this.registerForm.controls['password'].setErrors({required:true})
        }
        if(err.error.type == 'disable'){
          this.values.login = 'danger'
          this.showToast(err.error.message)
        }
        if(err.error.type == 'logged'){
          this.values.login = 'danger'
          this.values.username = 'danger'
          this.values.password = 'danger'
          this.showToast(err.error.message)
        }
        this.loading = false;
      }
    );

    // this.authService.login(this.registerForm.value)
  }

  reloadPage() {
    window.location.reload();
  }

  destroyByClick = true;
  duration = 10000;
  hasIcon = true;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.TOP_RIGHT;
  preventDuplicates = false;
  status: NbComponentStatus = 'warning';
  
  private showToast( body: string) {
    const config = {
      status: this.status,
      destroyByClick: this.destroyByClick,
      duration: this.duration,
      hasIcon: this.hasIcon,
      position: this.position,
      preventDuplicates: this.preventDuplicates,
    };
    const titleContent = 'Warning';

    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

}
