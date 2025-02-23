import { HttpEvent, HttpEventType } from "@angular/common/http";
import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FacesService } from "../../../services/faces.service";
import {
  FileUploader,
  FileLikeObject,
  FileItem,
  ParsedResponseHeaders,
} from "ng2-file-upload";
import { api } from "../../../models/API";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Account } from "../../../models/Account";
import { v4 as uuidv4 } from 'uuid';

const URL = `${api}/elastic/video`;
const uploadZipURL = `${api}/elastic/zip`;

const uploadZipURLVsd = `${api}/elastic/zipVsd`;

@Component({
  selector: "ngx-upload",
  templateUrl: "./upload.component.html",
  styleUrls: ["./upload.component.scss"],
})
export class UploadComponent implements OnInit {
  constructor(
    private router: Router,
    private token: AuthService,
    private facesService: FacesService,
    private SpinnerService: NgxSpinnerService,
    private activatedRoute: ActivatedRoute
  ) {
    this.uploader = new FileUploader({
      url: URL,
      itemAlias: "file",
      allowedFileType: ["video"],
      headers: [{ name: "x-access-token", value: this.token.getToken() }],
    });
  
    this.zipUploader = new FileUploader({
      url: uploadZipURL,
      itemAlias: "file",
      headers: [{ name: "x-access-token", value: this.token.getToken() }],
    });
  
    this.multipleVideo = new FileUploader({
      url: uploadZipURLVsd,
      itemAlias: "files",
      allowedFileType: ["video"],
      headers: [{ name: "x-access-token", value: this.token.getToken() }],
    });
  }
  vs2: boolean = false
  messageBar: string = "Processing";
  fileName: string;
  up: boolean = false;
  load: boolean = false;
  name: string;
  s3: boolean = false;
  progress: number = 0;
  finished: boolean = false;
  zipFileName: string;
  zipName: string;
  zipLoad: boolean = false;
  multipleLoad: boolean = false
  zipUploadFinished: boolean = false;
  multipleFinished: boolean = false;
  now_user: Account;
  showTable: boolean = false;

  @ViewChild("fileInput", { static: false }) fileInputVariable: any;
  @ViewChild("zipFileInput", { static: false }) zipFileInputVariable: any;
  @ViewChild("multipleVid", { static: false }) multipleVid: ElementRef;
  public uploader: FileUploader;
  public zipUploader: FileUploader;
  public multipleVideo: FileUploader;
  ngOnInit(): void {
    const params = this.activatedRoute.snapshot.routeConfig.path;
    if(params === 'uploadZip'){
      this.vs2 = true
    }

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
      this.up = false;
      // this.load = false;
      this.fileInputVariable.nativeElement.value = "";
      this.fileName = null;
      this.name = null;
      this.addRoI(JSON.parse(response));
    };
    this.uploader.onProgressItem = (progress: any) => {
      this.progress = progress["progress"];
      // this.progress = this.messageBar
      if (progress["progress"] === 100) {
        //this.SpinnerService.hide();
        this.finished = true;

        console.log("video uploaded");
      }
    };

    // Upload Zip File
    this.zipUploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const format = file.file.name.split(".")[1];
      const name = this.zipName.split(" ").join("_");
      const newName = name + "." + format;
      file.file.name = newName;
    };
    this.zipUploader.onErrorItem = (item, response, status, headers) => {
      console.log(response);
    };
    this.zipUploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.up = false;
      this.zipFileInputVariable.nativeElement.value = "";
      this.zipFileName = null;
      this.zipName = null;
      this.router.navigateByUrl("/pages/search/list");
    };
    this.zipUploader.onProgressItem = (progress: any) => {
      this.progress = progress["progress"];
      if (progress["progress"] === 100) {
        this.zipUploadFinished = true;
      }
    };

    const batchId = uuidv4();
    this.multipleVideo.onAfterAddingFile = (file) => {
      this.showTable = true
      file.withCredentials = false;
      file.file['originalName'] = file.file.name
      const name = file.file.name.split(" ").join("_");
      const newName = `${batchId}-NVS-${name}`
      file.file.name = newName;
    };
    this.multipleVideo.onErrorItem = (item, response, status, headers) => {
      console.log(response);
    };

    this.multipleVideo.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.formData.push({ key: 'batchId', value: batchId });
    };
    this.multipleVideo.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      this.up = false;
      // const final = this.multipleVideo.queue.length
      // let count = 0;
      // for(let i = 0; i < this.multipleVideo.queue.length; i++){
      //   if(this.multipleVideo.queue[i].progress === 100){
      //     count++
      //   }
      // }
      // if(count === final){
      //   this.multipleFinished = true;
      //   this.router.navigateByUrl(`/pages/search/order/${batchId}/nr`);
      // }
    };
    this.multipleVideo.onProgressItem = (file, progress: any) => {
      this.progress = (progress / this.multipleVideo.queue.length) + this.progress;
    };
    this.multipleVideo.onCompleteAll = () => {
      this.router.navigateByUrl(`/pages/search/order/${batchId}/nr`);
    }
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

  onChangeZip() {
    this.zipFileName = null;
    if (this.zipFileInputVariable.nativeElement.files.length !== 0) {
      this.up = true;
      this.zipFileName =
        this.zipFileInputVariable.nativeElement.files[0]["name"];
      this.zipLoad = false;
    } else {
      this.up = false;
    }
  }

  uploadVideo() {
    this.up = true;
    this.load = true;
    const fileType = this.fileInputVariable.nativeElement.files[0].type;
    const fileFormat = fileType.split("/")[0];
    this.fileInputVariable.nativeElement.value = "";
    if (fileFormat === "video") {
      this.uploader.uploadAll();
    } else {
      this.fileName = null;
      this.load = false;
      alert("Please choose video file only");
    }
  }

  uploadMultVideo() {
    this.up = true;
    this.multipleLoad = true;
    this.multipleVideo.uploadAll();
    // const fileType = this.multipleVid.nativeElement.files[0].type;
    // const fileFormat = fileType.split("/")[0];
    // this.multipleVid.nativeElement.value = "";
    // if (fileFormat === "video") {
    //   this.multipleVideo.uploadAll();
    // } else {
    //   this.fileName = null;
    //   this.multipleLoad = false;
    //   alert("Please choose video file only");
    // }
  }

  clearQueue(){
    this.multipleVideo.clearQueue()
  }

  uploadZip() {
    this.up = true;
    this.zipLoad = true;
    const fileType = this.zipFileInputVariable.nativeElement.files[0].type;
    this.zipFileInputVariable.nativeElement.value = "";
    if (fileType === "application/zip") {
      this.zipUploader.uploadAll();
    } else {
      this.zipFileName = null;
      this.zipLoad = false;
      alert("Please choose zip file only");
    }
  }

  error: boolean = false

  addRoI(res) {
    const id = res.id
    let response = {
      cameraId: id,
      id_account: this.now_user.id_account,
      id_branch: this.now_user.id_branch
    };

    this.facesService.doOneImage(response).subscribe(
      (res) => {
        // console.log(res)
        this.router.navigate(['/pages/cameras/algorithms/' + id]);
        // this.router.navigateByUrl("/pages/search/list");
      },
      (err) => {
        // console.error(err)
        this.error = true
        this.router.navigate(['/pages/cameras/algorithms/' + id]);
        // this.router.navigateByUrl("/pages/search/list");
      }
    );
  }
}
