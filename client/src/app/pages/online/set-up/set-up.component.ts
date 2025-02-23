import { EventEmitter, Output, Renderer2, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { Account } from '../../../models/Account';
import { MustMatch } from '../../../services/must-match.service';
import{ DisableService }from '../../../services/disable.service';
import { AnnotationsService } from '../../../services/annotations.service';


@Component({
  selector: 'ngx-set-up',
  templateUrl: './set-up.component.html',
  styleUrls: ['./set-up.component.scss'],
})
export class SetUpComponent implements OnInit {
  //@Output() realChange = new EventEmitter<boolean>();

  constructor(
    private accountserv: AccountService,
    // private disableservice: DisableService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    // private renderer: Renderer2, 
    private formBuilder: FormBuilder,
    private annserv: AnnotationsService,
  ) {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
      if (this.now_user.role === 'admin'){
          this.un_role = 'client';
          this.getAlgos();
      }else if (this.now_user.role === 'client'){
        this.un_role = 'branch';
      }else if (this.now_user.role === 'branch'){
        this.un_role = 'user';
      }

      this.registerForm = this.formBuilder.group({
        algorithm: ['', Validators.required],
        unique: [true],
        password: ['', [Validators.required, Validators.minLength(10), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{10,}$')]],
        email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
        username: ['', [Validators.required]],
        confirmPassword: ['', Validators.required],
        cameras: [10],
        analytics: [10],
        disabled: [false],
        am: [false],
        vs: [false],
        mic: [false],
        vsd: [false],
        vms: [''],
        formatPic: ['']
    }, {
      validators: [
        MustMatch('password', 'confirmPassword'),
      ],
    });
   }
  registerForm: FormGroup;
  edit: boolean = false;
  user: Account;
  is_saving: boolean = false;
  mess0: boolean = false;
  submitted: boolean = false;
  now_user: Account;
  un_role: string;
  algos: any = [];
  algorithms: Array<string>;
  type: string = 'client';
  errorCount: number = 0
  values: any = {
    email: 'primary',
    username: 'primary',
    password: 'primary',
    confirmPassword: 'primary',
    algorithm: 'primary',
    vms: 'primary',
    submit: 'success'
  };
  real: boolean = false;
  vmsList: Array<string> = ['Pelco','Honeywell Maxpro','Cognyte', 'Nextiva'];

  @ViewChild("fileInput") fileInputVariable: any;
  fileName:string = "";
  available: boolean = false;
  upload: any = {
    base64: '',
    format: '',
    name: '',
    idBranch: '',
    idAccount: ''
  }
  base64textString: string;

  change(){
    this.fileName = ''
    if(this.fileInputVariable.nativeElement.files.length != 0){
      this.available = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]['name']
    }else{
      this.available = false;
    }
  }

  uploa(){
    const files = this.fileInputVariable.nativeElement.files[0];
    this.upload.format = this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1]
    var reader = new FileReader();
    reader.onload =this._handleReaderLoaded.bind(this);
    reader.readAsBinaryString(files);
  }

  _handleReaderLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           this.base64textString= btoa(binaryString);
           this.base64textString = ';base64,' + this.base64textString
           this.upload.base64 = this.base64textString
           this.annserv.postLogo(this.upload).subscribe(
            res =>{
              this.router.navigate(['/pages/accounts']);
            },
            err => console.error(err)
          )
   }

  allAct: boolean = false;
  changeAll(){
      for(const alg of this.algos){
        alg.act = this.allAct
      }
  }

  ngOnInit() {
    const params = this.activatedRoute.snapshot.params;
    if (params.id){
      this.edit = true;
      if (this.now_user.role === 'admin'){
        this.accountserv.getOneAd(params.id)
        .subscribe(
          res => {
            this.user = res['data'];
            this.registerForm.controls['username'].setValue(this.user.username);
            this.registerForm.controls['email'].setValue(this.user.email);
            this.registerForm.controls['analytics'].setValue(this.user.analytics);
            this.registerForm.controls['cameras'].setValue(this.user.cameras);
            this.registerForm.controls['vms'].setValue(this.user.vms);
            this.type = this.user.role;
            if (this.user.am === 0){
              this.registerForm.controls['am'].setValue(false);
            }else if (this.user.am === 1){
              this.registerForm.controls['am'].setValue(true);
            }
            if (this.user.vs === 0){
              this.registerForm.controls['vs'].setValue(false);
            }else if (this.user.vs === 1){
              this.registerForm.controls['vs'].setValue(true);
            }
            if (this.user.disabled === 0){
              this.registerForm.controls['disabled'].setValue(false);
            }else if (this.user.disabled === 1){
              this.registerForm.controls['disabled'].setValue(true);
            }
            console.log(this.user)
            if (this.user.vsd === 0){
              this.registerForm.controls['vsd'].setValue(false);
            }else if (this.user.vsd === 1){
              this.registerForm.controls['vsd'].setValue(true);
            }
            if (this.user.id_branch !== '0000'){
              this.registerForm.controls['unique'].setValue(true);
            }
            for (const a of this.user.algorithm){
              for (const b of this.algos){
                if (a === b.name){
                  b.act = true;
                }
              }
            }
          },
          err => console.error(err),
        );
      }else {
        this.accountserv.getOne(params.id)
        .subscribe(
          res => {
            this.user = res['data'];
            this.registerForm.controls['username'].setValue(this.user.username);
            this.registerForm.controls['email'].setValue(this.user.email);
            if (this.user.id_branch !== '0000'){
              this.registerForm.controls['unique'].setValue(true);
            }
            if (this.user.disabled === 0){
              this.registerForm.controls['disabled'].setValue(false);
            }else if (this.user.disabled === 1){
              this.registerForm.controls['disabled'].setValue(true);
            }
            if (this.user.am === 0){
              this.registerForm.controls['am'].setValue(false);
            }else if (this.user.am === 1){
              this.registerForm.controls['am'].setValue(true);
            }
            if (this.user.vs === 0){
              this.registerForm.controls['vs'].setValue(false);
            }else if (this.user.vs === 1){
              this.registerForm.controls['vs'].setValue(true);
            }
          },
          err => console.error(err),
        );
      }
    }
  }

  get f() { return this.registerForm.controls; }

  view1(){
    console.log(this.registerForm.controls);
  }

  onFr(){
    if(this.algos[0]['act']){
      if(this.algos[0]['act'] === true){
        this.algos[18]['act'] = false
        this.algos[0]['act'] = false
      }else{
        this.algos[0]['act'] = true
        this.algos[18]['act'] = true
      }
    }else{
      this.algos[0]['act'] = true
      this.algos[18]['act'] = true
    }
  }

  onAu(){
    if(this.algos[80]['act']){
      if(this.algos[80]['act'] === true){
        this.algos[80]['act'] = false
      }else{
        this.algos[80]['act'] = true
      }
    }else{
      this.algos[80]['act'] = true
    }
  }

  view: boolean = false;
  typePass: string = 'password';
  changeView(){
    if (this.view === false){
      this.typePass = 'password';
    }else if (this.view === true){
      this.typePass = 'text';
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorCount = 0
    this.values = {
      email: 'primary',
      username: 'primary',
      password: 'primary',
      confirmPassword: 'primary',
      algorithm: 'primary',
      vms: 'primary',
      submit: 'success'
    };
    this.registerForm.controls['algorithm'].setErrors(null);
    if (this.edit === true){
      this.registerForm.controls['password'].setErrors(null);
      this.registerForm.controls['confirmPassword'].setErrors(null);
    }
    let found = false;
    this.algorithms = [];
    for (const a of this.algos){
      if (a['act'] === true){
        found = true;
        this.algorithms.push(a['name']);
      }
    }
    if (this.now_user.role === 'client'){
      found = true;
    }
    if (this.registerForm.invalid || found === false) {
      const controls = this.registerForm.controls;
      for (const name in controls) {
          if (controls[name].invalid) {
            this.errorCount++
            this.values.submit = 'danger'
              this.values[name] = 'danger';
          }
      }

      if (found === false && this.now_user.role === 'admin'){
        this.errorCount++
        this.values.algorithm = 'danger';
        this.values.submit = 'danger'
        this.registerForm.controls['algorithm'].setErrors({required: true});
      }
      return;
    }
    // stop here if form is invalid

    if (this.now_user.role !== 'admin'){
      this.registerForm.controls['analytics'].setValue(this.now_user.analytics);
      this.registerForm.controls['cameras'].setValue(this.now_user.cameras);
    } else if(this.fileInputVariable.nativeElement.files.length != 0){
        this.registerForm.controls['formatPic'].setValue(this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1])
    }
    this.registerForm.controls['algorithm'].setValue(this.algorithms);
    
    // if (this.fileInputVariable.nativeElement){
    //   if(this.fileInputVariable.nativeElement.files.length != 0){
    //     this.registerForm.controls['formatPic'].setValue(this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1])
    //   }
    // }
    
    this.is_saving = true;
    if (this.edit === false){
      let role = this.un_role;
      if (this.now_user.role === 'admin'){
        role = this.type;
      }
      if (this.now_user.role === 'client' && this.now_user.id_branch !== '0000'){
        role = 'user';
      }

      this.accountserv.addAccount(this.registerForm.value, role).subscribe(
        res => {
          if (this.now_user.role === 'admin'){
            if(this.fileInputVariable.nativeElement.files.length != 0){
              const files = this.fileInputVariable.nativeElement.files[0];
              this.upload.format = this.fileInputVariable.nativeElement.files[0]['name'].split('.')[1]
              var reader = new FileReader();
              this.upload.idAccount = res['data'].idAccount
              this.upload.idBranch = res['data'].idBranch
              reader.onload =this._handleReaderLoaded.bind(this);
              reader.readAsBinaryString(files);
            }
          }
          this.router.navigate(['/pages/accounts']);

        },
        err => {
          this.is_saving = false;
          this.values.submit = 'danger'
          if (err.error.repeated === 'Username'){
            this.values.username = 'danger';
            this.errorCount++
            this.registerForm.controls['username'].setErrors({cantMatch: true});
          }
          if (err.error.repeated === 'Email'){
            this.values.email = 'danger';
            this.errorCount++
            this.registerForm.controls['email'].setErrors({cantMatch: true});
          }
        },
      );
    }else if (this.edit === true){
      const params = this.activatedRoute.snapshot.params.id;
      let role = this.un_role;
      if (this.now_user.role === 'admin'){
        role = this.type;
      }
      if (this.now_user.role === 'client' && this.now_user.id_branch !== '0000'){
        role = 'user';
      }
      this.accountserv.editAccount(this.registerForm.value, params, role).subscribe(
        res => {
          if (this.now_user.role === 'admin'){
            const send = {
              algorithm: this.registerForm.controls['algorithm'].value,
            };
            this.accountserv.editAlgo(params, send).subscribe(
              res => {
                this.router.navigate(['/pages/accounts']);
              },
              err => console.log(err),
            );
          }else {
            this.router.navigate(['/pages/accounts']);
          }
        },
        err => {
          this.is_saving = false;
          if (err.error.repeated === 'Username'){
            this.values.username = 'danger';
            this.registerForm.controls['username'].setErrors({cantMatch: true});
          }
          if (err.error.repeated === 'Email'){
            this.values.email = 'danger';
            this.registerForm.controls['email'].setErrors({cantMatch: true});
          }
        },
      );
    }

  }

  handleError(error) {
    console.log('Error: ', error);
  }

  scroll(){
    let newClass = {
      height: '43rem',
    }
    if(this.errorCount !== 0){
      let val = 43
      val = val - ( this.errorCount + 4)
      newClass.height = `${val}rem`
    }
    return newClass;
  }

  getAlgos(){
    this.accountserv.getAlg().subscribe(
      res => {
        this.algos = res['data'];
      },
      err => console.log(err),
    );
  }


// This function is for further use when getVMS() method is available in Account Service
// getVMSystems() {
//   this.accountserv.getVMS().subscribe(
//     res => {
//       this.vmsList = res['data'];
//     },
//     err => console.log(err),
//   );
// }

}
