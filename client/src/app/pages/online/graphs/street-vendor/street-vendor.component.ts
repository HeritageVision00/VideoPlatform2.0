import { DatePipe } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NbCalendarRange, NbWindowService } from "@nebular/theme";
import { LocalDataSource, ViewCell } from "ng2-smart-table";
import { api } from "../../../../models/API";
import { AnalyticsService } from "../../../../services/analytics.service";
import { FacesService } from "../../../../services/faces.service";
import { Account } from "../../../../models/Account";
import { WindowOpenerComponent } from "../window-opener/window-opener.component";
import { ImagebigComponent } from "../imagebig/imagebig.component";

@Component({
  selector: 'ngx-street-vendor',
  templateUrl: './street-vendor.component.html',
  styleUrls: ['./street-vendor.component.scss']
})
export class StreetVendorComponent implements OnInit  {
  @Input() range: NbCalendarRange<Date>;
  @Input() camera: string;
  @Input() algoId: number;
  compData: any = [];
  timezone: any;

  constructor(
    private serv: AnalyticsService,
    public sanitizer: DomSanitizer,
    private face: FacesService,
    public datepipe: DatePipe,
  ) {}
  source: any = new LocalDataSource();
  rtspIn: any;

  ngOnInit(): void {
    const now_user: Account = JSON.parse(localStorage.getItem("now_user"));
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    let type;
    if (now_user.id_branch != "0000") {
      type = "cam_id";
    } else {
      type = "id_account";
    }
    let l = {
      start: this.range.start,
      end: this.range.end,
      type: type,
    };
    this.face.checkVideo(this.algoId, this.camera).subscribe(
      (res) => {
        this.rtspIn = this.sanitizer.bypassSecurityTrustResourceUrl(
          res["http_out"]
        );
      },
      (err) => console.error(err)
    );
    this.serv.compiledRequest(this.camera, l, this.algoId).subscribe(
      (res) => {
        this.compData = res["data"];
        for (var m of this.compData.raw) {
          const path = `${api}/pictures/${now_user["id_account"]}/${m['id_branch']}/${this.compData.folder}/${m['cam_id']}/`
          m["picture"] = this.sanitizer.bypassSecurityTrustUrl(`${path}${m['picture']}`);
          m['videoClip']  = this.sanitizer.bypassSecurityTrustUrl(`${path}${m['movie']}`);
          m["time"] = this.datepipe.transform(m["time"], "yyyy-M-dd HH:mm:ss", this.timezone);
        }
        this.source = this.compData.raw.slice().sort((a, b) => +new Date(b.time) - +new Date(a.time));
      },
      (err) => console.error(err)
    );
  }

  settings = {
    mode: "external",
    actions: false,
    pager: {
      display: true,
      perPage: 5,
    },
    noDataMessage: "No data found",
    columns: {
      picture: {
        title: "PICTURE",
        type: "custom",
        filter: false,
        renderComponent: ButtonViewComponentPic,
        onComponentInitFunction: (instance) => {
          instance.save.subscribe((row: string) => {});
        },
      },
      // movie: {
      //   title: 'VIDEO',
      //   type: 'custom',
      //   filter: false,
      //   renderComponent: WindowOpenerComponent,
      //   onComponentInitFunction(instance) {
      //     instance.save.subscribe(row => {
      //       alert(`${row.name} saved!`);
      //     });
      //   },
      // },
      time: {
        title: "TIME",
        type: "string",
        filter: false,
      },
      // alert: {
      //   title: "ALERT",
      //   type: "string",
      //   filter: false,
      // },
      cam_name: {
        title: "CAM",
        type: "string",
        filter: false,
      },
    },
  };
}

@Component({
  styles: [''],
  template: `
    <img [src]="rowData.picture" width='60' height='60' (click)="openIm()" style='cursor: pointer;'>
  `,
})
export class ButtonViewComponentPic implements ViewCell, OnInit {

  constructor(
    private windowService: NbWindowService
  ){
  }

  openIm(){
    this.windowService.open(ImagebigComponent, { title: `View image for ${this.rowData.camera_name || this.rowData.cam_name}`, context: { data: this.rowData} });
  }

  @Input() value: string | number;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
  }
}