import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { FacesService } from "../../../services/faces.service";
import { api } from "../../../models/API";
import { Account } from "../../../models/Account";
import { DatePipe } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NbDialogRef,
  NbDialogService,
  NbWindowRef,
  NbWindowService,
} from "@nebular/theme";
import {
  SetngsComponent,
  WindowResultService,
} from "../setngs/setngs.component";
import { CheckComponent } from "../check/check.component";
import { AddIncidentComponent } from "../add-incident/add-incident.component";
import { MemoComponent } from "../memo/memo.component";
import { AuthService } from "../../../services/auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import { WindowOpenerComponent } from "../../online/graphs/window-opener/window-opener.component";
import { Router } from "@angular/router";
import { ResumeComponent } from "../resume/resume.component";

@Component({
  selector: "ngx-bar",
  templateUrl: "./bar.component.html",
  styleUrls: ["./bar.component.scss", '../../online/graphs/smart-table.scss'],
})
export class BarComponent implements OnInit, OnDestroy {
  dialogRef: NbDialogRef<any>;
  constructor(
    private face: FacesService,
    public datepipe: DatePipe,
    private formBuilder: FormBuilder,
    private windowService: NbWindowService,
    private dialogService: NbDialogService,
    public authService: AuthService,
    public sanitizer: DomSanitizer,
    private route: Router
  ) {}

  ngOnDestroy() {}

  searchSet: any;

  selectedNavItem(item: any) {
    this.searchSet = item;
  }

  ngOnInit(): void {
    // console.log(this.windowRef)
    this.registerForm = this.formBuilder.group({
      query: ["", [Validators.required]],
    });
    this.now_user = JSON.parse(localStorage.getItem("now_user"));
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
  }
  registerForm: FormGroup;
  timezone: any;
  results: Array<any> = [];
  query: string;
  touched: boolean = false;
  loading: boolean = false;
  source: any = new LocalDataSource();
  stuff: Array<any> = [];
  now_user: Account;
  video: boolean = false;
  filters: any = {};

  check() {
    // console.log(this.source);
  }

  videoStitch() {
    for (const log of this.source.data) {
      if (log.added == true) {
        // console.log(log);
      }
    }
  }

  addIncident() {
    this.dialogRef = this.dialogService.open<any>(AddIncidentComponent, {
      hasScroll: true,
      dialogClass: "model-full",
      closeOnBackdropClick: false,
    });

    this.dialogRef.onClose.subscribe((resp) => {
      console.log(resp);
    });
  }

  searchIncident(){
    let inp = this.registerForm.controls["query"].value;
    this.loading = true;
    this.touched = false;
    this.stuff = [];
    this.source.data = [];
    let sending = {
      query: inp,
      id: this.now_user.id_branch,
    };
    if (this.filters !== {}) {
      sending["filters"] = this.filters;
    }
    this.face.searchElastIncident(sending).subscribe(
      (res) => {
        this.loading = false;
        this.touched = true;
        this.results = res["data"];
        console.log(this.results)
        for (const m of this.results["hits"]) {
          if(m._source.description){
            m._source.description = this.updateDateInText(m._source.description);
          }
          if (m._source.time) {
            m._source['time'] = this.datepipe.transform(m._source['time'], 'yyyy-M-dd HH:mm:ss',this.timezone);
            this.stuff.push(m._source);
          }
        }
        this.source.load(
          this.stuff
            .slice()
            .sort((a, b) => +new Date(b.time) - +new Date(a.time))
        );
      },
      (err) => {
        this.loading = false;
        this.touched = true;
        console.error(err);
      }
    );
  }

  updateDateInText(text: string): string {
    return text.replace(/&&(.+?)&&/g, (match, originalDate) => {
      const formattedDate = this.datepipe.transform(originalDate, 'MMMM dd yyyy', this.timezone);
      return formattedDate ? formattedDate : match;
    });
  }

  search() {
    let inp = this.registerForm.controls["query"].value;
    this.loading = true;
    this.touched = false;
    this.stuff = [];
    this.source.data = [];
    let sending = {
      query: inp,
      id: this.now_user.id_branch,
    };
    if (this.filters !== {}) {
      sending["filters"] = this.filters;
    }
    this.face.searchElast(sending).subscribe(
      (res) => {
        this.loading = false;
        this.touched = true;
        this.results = res["data"];
        for (const m of this.results["hits"]) {
          if (m._source.time) {
            if(m._source.time.includes("_")){
              m._source.time= m._source.time.split("_").join(" ")
            }
            const utcDate = new Date(Date.UTC(
              parseInt(m._source.time.split('-')[0]), // Year
              parseInt(m._source.time.split('-')[1]) - 1, // Month (subtract 1 because months are 0-indexed)
              parseInt(m._source.time.split(' ')[0].split('-')[2]), // Day
              parseInt(m._source.time.split(' ')[1].split(':')[0]), // Hour
              parseInt(m._source.time.split(' ')[1].split(':')[1]), // Minute
              parseInt(m._source.time.split(' ')[1].split(':')[2]) // Second
            ));

            let desc
            // console.log(m._source.description.includes(m._source.time), m._source.description, m._source.time)
            if(m._source.description.includes(m._source.time)){
              desc = m._source.description.split(m._source.time)
              m["_source"]["time"] = this.datepipe.transform(
                utcDate,
                "yyyy-M-dd HH:mm:ss", this.timezone
              );
              // console.log(m["_source"]["time"])
              m._source.description = `${desc[0]}${m["_source"]["time"]}${desc[1]}`
            }

            if(!m._source.url){
              m["_source"]["url"] = "/assets/images/loading.jpg";
            }
            if(!m['_source'].url.includes('http://')){
              m['_source'].url = `http://${m['_source'].url}`
            }
            m["_source"]["base64"] = "/assets/images/loading.jpg";
            m["_source"]["id"] = m._id;
            m['_source'].filename = this.sanitizer.bypassSecurityTrustUrl(m['_source'].filename)
            m['_source'].url = this.sanitizer.bypassSecurityTrustUrl(m['_source'].url)
            if(!m['_source'].vid){
              m['_source'].vid = `${api}/pictures/${m['_source'].videoname}`
            }
            if(!m['_source'].vid.includes('http://')){
              m['_source'].vid = `${api}/pictures/${m['_source'].vid}`
            }
            // m['_source'].vid = this.sanitizer.bypassSecurityTrustUrl(m['_source'].vid)
            m['_source'].pic = `${api}/pictures/${m['_source'].filename}`
            m['_source'].pic = this.sanitizer.bypassSecurityTrustUrl(m['_source'].pic)
            this.stuff.push(m._source);
          }
        }

        this.source.load(
          this.stuff
            .slice()
            .sort((a, b) => +new Date(b.time) - +new Date(a.time))
        );
        // console.log(this.source)
        // this.face.getImagesElast().subscribe(res=>{
        //     let imgs = res['data'].hits.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time))
        //     for(let i = 0; i < this.source.data.length; i ++){
        //       this.source.data[i].time = this.datepipe.transform(this.source.data[i].time, 'yyyy-M-dd HH:mm:ss');
        //       this.source.data[i].base64 = imgs[i]._source.base64
        //     }
        //     this.source.load(this.source.data)
        //   }, err => {
        //     console.error(err)
        //   })
      },
      (err) => {
        this.loading = false;
        this.touched = true;
        console.error(err);
      }
    );
  }

  openWindowForm() {
    this.windowService.open(SetngsComponent, {
      title: `Filter Settings`,
      context: {
        onChange: (changes) => {
          this.filters = changes;
        },
        filters: this.filters,
      },
    });
  }

  @ViewChild("videoPlayer", { static: false }) videoplayer: ElementRef;
  isPlay: boolean = false;
  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
  }
  videoFile: string = "";
  pass(ev) {
    this.video = true;
    console.log(ev);
    ev = ev.data.clip_path;
    this.videoplayer.nativeElement.src = ev;
    this.videoplayer.nativeElement.load();
    this.videoplayer.nativeElement.play();
  }

  isChecked: boolean = false; // Initial state of the toggle

  toggle() {
    this.isChecked = !this.isChecked; // Toggle the state
  }

  got(event) {
    const ele = this.windowService.open(ResumeComponent, { title: `Incident report`, context: { data: event.data} });
    const element = ele.componentRef.location.nativeElement;
    element.style.width = '80vw';
    // this.route.navigate([`pages/search/order/${event.data.batch_id}/re`]);
  }

  settings = {
    mode: "external",
    // actions: {
    //   position: 'right',
    //   add: false,
    //   edit: true,
    //   columnTitle: 'ACTIONS',
    //   delete: false,
    // },
    actions: false,
    edit: {
      editButtonContent: '<i class="fas fa-play"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: "No data found",
    columns: {
      add: {
        title: "Summary",
        type: "custom",
        filter: false,
        renderComponent: CheckComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {});
        },
      },
      pic: {
        title: "Picture",
        type: "custom",
        filter: false,
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {
            this.pass(row);
          });
        },
      },
      // vid: {
      //   title: 'Video',
      //   type: 'custom',
      //   filter: false, 
      //   renderComponent: WindowOpenerComponent,
      //   onComponentInitFunction(instance) {
      //     instance.save.subscribe(row => {
      //       alert(`${row.name} saved!`);
      //     });
      //   },
      // },
      description: {
        title: "Description",
        type: "string",
        filter: false,
      },
      time: {
        title: "Time",
        type: "string",
        filter: false,
      },
      cam_name: {
        title: "Camera",
        type: "string",
        filter: false,
      },
      button: {
        title: "Actions",
        type: "custom",
        valuePrepareFunction: (value, row, cell) => {
          return row;
        },
        renderComponent: MemoComponent,
        filter: false,
      },
    },
  };
  settings2 = {
    mode: "external",
    actions: {
      position: 'right',
      add: false,
      edit: true,
      columnTitle: 'Videos',
      delete: false,
    },
    // actions: false,
    edit: {
      editButtonContent: '<i class="fas fa-ellipsis-h"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: "No data found",
    columns: {
      // add: {
      //   title: "Summary",
      //   type: "custom",
      //   filter: false,
      //   renderComponent: CheckComponent,
      //   onComponentInitFunction: (instance) => {
      //     instance.save.subscribe((row: string) => {});
      //   },
      // },
      // pic: {
      //   title: "Picture",
      //   type: "custom",
      //   filter: false,
      //   renderComponent: ButtonViewComponent,
      //   onComponentInitFunction: (instance) => {
      //     instance.save.subscribe((row: string) => {
      //       this.pass(row);
      //     });
      //   },
      // },
      // vid: {
      //   title: 'Video',
      //   type: 'custom',
      //   filter: false, 
      //   renderComponent: WindowOpenerComponent,
      //   onComponentInitFunction(instance) {
      //     instance.save.subscribe(row => {
      //       alert(`${row.name} saved!`);
      //     });
      //   },
      // },
      description: {
        title: "Description",
        type: "string",
        filter: false,
      },
      time: {
        title: "Time",
        type: "string",
        filter: false,
      },
      // cam_name: {
      //   title: "Camera",
      //   type: "string",
      //   filter: false,
      // },
    },
  };
}

@Component({
  selector: "button-view",
  styles: [
    ".play-btn { position: absolute; left: 50%; top: 50%; margin-top: -17px; margin-left: -20px; color: #f7f9fc47}",
  ],
  template: `
    <div class="card border-info" style="width:63px; height: 62px">
      <img [src]="rowData.url" width="60" height="60" />
    </div>
  `,
})
export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: string;

  constructor() {}

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  openVideo() {
    this.save.emit(this.rowData.clip_path);
  }

  ngOnInit() {
    this.renderValue = this.value.toString().toUpperCase();
  }
}