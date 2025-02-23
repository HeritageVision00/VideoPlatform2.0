import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FacesService } from "../../../services/faces.service";
import {
  FileUploader,
} from "ng2-file-upload";
import { api } from "../../../models/API";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { Account } from "../../../models/Account";
import { NbWindowRef } from "@nebular/theme";

const URL = `${api}/mic/upload`;

@Component({
  selector: 'ngx-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {
  constructor(
    private router: Router,
    private token: AuthService,
    private facesService: FacesService,
    protected windowRef: NbWindowRef,
  ) {}
  messageBar: string = "Processing";
  fileName: string;
  up: boolean = false;
  load: boolean = false;
  name: string;
  progress: number = 0;
  finished: boolean = false;
  now_user: Account;

  @ViewChild("fileInput", { static: false }) fileInputVariable: any;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: "file",
    allowedFileType: ["audio"],
    headers: [{ name: "x-access-token", value: this.token.getToken() }],
  });


  ngOnInit(): void {
    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    this.uploader.onAfterAddingFile = (file) => {
      //this.SpinnerService.show();
      file.withCredentials = false;
      const format = file.file.name.split(".")[1];
      const name = this.name.split(" ").join("_");
      const newName = name + "." + format;
      file.file.name = newName;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      //this.SpinnerService.hide();
      console.log(response);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      // console.log()
      this.up = false;
      // this.load = false;
      this.fileInputVariable.nativeElement.value = "";
      this.fileName = null;
      this.name = null;
    };
    this.uploader.onProgressItem = (progress: any) => {
      this.progress = progress["progress"];
      // this.progress = this.messageBar
      if (progress["progress"] === 100) {
        //this.SpinnerService.hide();
        this.finished = true;
        this.windowRef.close();
        this.router.navigate(['/pages/microphoneList']);
        console.log("video uploaded");
      }
    };

  }

  change() {
    this.fileName = null;
    if (this.fileInputVariable.nativeElement.files.length !== 0) {
      this.up = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]["name"];
      this.load = false;
    } else {
      this.up = false;
    }
  }

  uploadVideo() {
    this.up = true;
    this.load = true;
    const fileType = this.fileInputVariable.nativeElement.files[0].type;
    const fileFormat = fileType.split("/")[0];
    console.log(fileType, fileFormat)
    this.fileInputVariable.nativeElement.value = "";
    if (fileFormat === "audio") {
      this.uploader.uploadAll();
    } else {
      this.fileName = null;
      this.load = false;
      alert("Please choose audio file only");
    }
  }

  error: boolean = false
}
