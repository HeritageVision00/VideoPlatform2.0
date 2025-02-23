import { Component, Inject, Injectable, OnInit, ViewChild } from '@angular/core';
import { trigger, style, animate, transition } from "@angular/animations";
import { NB_WINDOW_CONTEXT, NbDialogRef, NbDialogService, NbWindowRef } from "@nebular/theme";
import { VideoService } from "../../../services/video.service";
import * as moment from "moment";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, FormControl } from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import { FacesService } from "../../../services/faces.service";
import { FileUploader } from "ng2-file-upload";
import { api } from "../../../models/APIVS";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { Account } from "../../../models/Account";

const timeFormat = "HH:mm:ss";

@Component({
  selector: 'ngx-summarization',
  providers: [
    { provide: NB_WINDOW_CONTEXT, useValue: {} }, // Provide NbWindowContext
  ],
  templateUrl: './summarization.component.html',
  styleUrls: ['./summarization.component.scss'],
  animations: [
    trigger("flyInOut", [
      // transition("void => *", [
      transition(":enter", [
        style({ transform: "translateX(100%)" }),
        //animate(400),
        animate("400ms"),
      ]),
    ]),
  ],
})

export class SummarizationComponent implements OnInit {
  
  

  constructor(
    @Inject(NB_WINDOW_CONTEXT) private windowRef: NbWindowRef,
    private dialogService: NbDialogService,
    private videoService: VideoService,
    private fb: FormBuilder,
    private http: HttpClient,
    //private router: Router,
    //private token: AuthService,
    //private facesService: FacesService,
  ) { }
  selectedFile: File;
  processForm: FormGroup;
  uploadForm: FormGroup;
  dialogRef: NbDialogRef<any>;
  videoUrl: string = "";
  videoExists = false;
  isVideoBeingUploaded: boolean = false;
  errorMessage: string = null;
  options: any;
  isLoading: boolean = false;
  successMessage: string;
  displayMessage: any;
  submitted = false;
  fileName: string;
  up: boolean = false;
  load: boolean = false;
  name: string;
  progress: number = 0;
  finished: boolean = false;
  now_user: Account;
  playList: any;
  videoPlayer: any;
  uploadInProgress: boolean = false;
  spinner: boolean = false;


  @ViewChild("fileInput", { static: false }) fileInputVariable: any;
  public uploader: FileUploader = new FileUploader({
    url: `${api}/video/upload`,
    itemAlias: "file",
    allowedFileType: ["video"],
  });

  async ngOnInit() {
    this.formInitialization();

    this.now_user = JSON.parse(localStorage.getItem('now_user'));
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      const format = file.file.name.split(".")[1];
      const name = this.fileInputVariable.nativeElement.files[0]["name"].split(" ").join("_");
      const newName = name + "." + format;
      file.file.name = newName;
    };
    this.uploader.onErrorItem = (item, response, status, headers) => {
      console.log(response);
    };
    this.uploader.onCompleteItem = (
      item: any,
      response: any,
      status: any,
      headers: any
    ) => {
      
      //this.up = false;
     // this.load = false;
      this.fileInputVariable.nativeElement.value = "";
      this.fileName = null;
      this.name = null;
      //this.isVideoBeingUploaded = false;
      this.finished = true; 
      this.uploadInProgress = false; // Reset the flag after upload is complete
      this.closeModal();
    };
    this.uploader.onProgressItem = (progress: any) => {
      this.progress = progress["progress"];
      if (progress["progress"] === 100) {
        this.finished = true;
       // window.close(); // Close the current window
        console.log("video uploaded");
      }
    };
  }


  formInitialization() {
    this.processForm = this.fb.group({
      selectedOption: ['', Validators.required],
      startTime: [""],
      endTime: [""],
      duration: [null, [Validators.min(3)]],
    });

    
  }

  //load the option
  async onOptionSelected(): Promise<void> {
    try { 

      const selectedOption = this.processForm.value.selectedOption;
      const details = await this.getVideoDetails(selectedOption);
      console.log('Fetched details:', details);
    } catch (error) {
      console.error('Error fetching option details:', error);


    }
  }

  async getVideoDetails(selectedOption: string): Promise<any> {
    try {
      const response = await this.videoService.getVideo().toPromise();
     
      return response;
    } catch (error) {
      console.log(error);

    }
  }

  async fetchAndDisplayItems(): Promise<void> {
    try {
      const options = await this.videoService.getVideo().toPromise();
      console.log(this.options);
    } catch (error) {
      console.error('Error fetching and displaying items:', error);
    }
  }
  refreshPage() {
    this.processForm.reset();
    this.errorMessage = null;
    this.successMessage = null;

  

  }

  videoList: { name: string; link: string  }[] = []; // This should be populated with available videos
  selectedVideo: { name: string; link: string } | null = null;
  selectedVideoUrl: string | null = null; // To store the selected video URL
 
  openVideoModal(template: any) {
    // Fetch the list of videos and populate the videoList array
    this.videoService.getSummariseVideo().subscribe(
      (res: any) => {
        console.log(res);
        this.videoList = res.data;
        this.selectedVideo = null; //reset the selected video
        // Open the dialog only after the list is fetched
        this.dialogRef = this.dialogService.open(template, {
          hasScroll: true,
          dialogClass: "model-full",
        });
        // Get a reference to the video player element
        this.videoPlayer = document.getElementById('videoPlayer') as HTMLVideoElement;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  loadSelectedVideo() {
    if (this.videoPlayer) {
      if (this.videoPlayer.paused) {
        this.videoPlayer.play();
      } else {
        this.videoPlayer.pause();
      }
    }
  }
   // Update the selected video URL when an option is selected
   onSelectVideo(video: { name: string; link: string }) {
    this.selectedVideoUrl = video.link;
  }

  
   openModal(template: any) {
    this.formInitialization();
    

    this.videoService.getVideo().subscribe(
      res => {
        this.options = res['data'];
        console.log(res);
        this.dialogRef = this.dialogService.open(template, {
          hasScroll: true,
          dialogClass: "model-full",
          closeOnBackdropClick: false,
        });
      },

      err => {
        console.log(err)
        this.dialogRef = this.dialogService.open(template, {
          hasScroll: true,
          dialogClass: "model-full",
          closeOnBackdropClick: false,
        });
      }
    );
  }

  clearStartOrEnd(type: string) {
    (<HTMLInputElement>document.getElementById(type)).value = "";
    if (type === "startTime") {
      this.processForm.patchValue({ startTime: "" });
    } else {
      this.processForm.patchValue({ endTime: "" });
    }
  }

  checkStartTimeAndEndTime(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get("startTime").value;
    const endTime = control.get("endTime").value;
    if (startTime && endTime) {
      const difference = moment(startTime, timeFormat).diff(moment(endTime, timeFormat))
      if (difference >= 0) {
        return { 'invalidStartTimeEndTime': true }
      }
    }
    return null;
  }
  async onProcessVideoSubmit() {
    this.submitted = true;

    this.isLoading = true;
    this.errorMessage = null;
    const selectedOption = this.processForm.value.selectedOption;
    const data = {
      inputFileName: selectedOption,
      startTime: this.processForm.value.startTime
        ? moment(this.processForm.value.startTime).format(timeFormat)
        : "",
      endTime: this.processForm.value.endTime
        ? moment(this.processForm.value.endTime).format(timeFormat)
        : "",
      duration: this.processForm.value.duration,
    };

    try {
      const res = await this.videoService.processVideo(data).toPromise();
      this.closeModal();
      this.successMessage = "Video processed successfully";
      console.log(res);

    } catch (error) {
      console.log(error);
      if (error.status === 400) {
        this.errorMessage = 'Bad request. Please check your input.';
      } else if (error.status === 401) {
        this.errorMessage = 'Video length should be greater then 3 Minutes ';
      } else if (error.status === 404) {
        this.errorMessage = 'Video not found.';
      } else if (error.status === 500) {
        this.errorMessage = 'Internal server error. Please try again later.';
      } else {
        this.errorMessage = 'An error occurred. Please try again.';
      }
    } finally {
      this.isLoading = false;
      this.submitted = false;
     
      this.successMessage = null;

    }
  }

  onUploadVideoSubmit() {
    this.errorMessage = null;
    if (this.uploadForm.invalid || !this.selectedFile) {
      return;
    }
    const formData = new FormData();
    formData.append('uploadVideo', this.selectedFile, this.selectedFile.name);
    this.isVideoBeingUploaded = true;


    this.videoService.uploadVideo(formData).subscribe(
      (res: any) => {
        this.isVideoBeingUploaded = false;
        this.closeModal();
        this.successMessage = res.message;
        console.log(res.message);
        this.selectedFile = null;
      },
      (error) => {
        this.isVideoBeingUploaded = false;  //upload failed
        console.log(error);


  //       if (error.status === 400) {
  //         this.errorMessage = 'error occurred while processing your request.';
  //       } else if (error.status === 401) {
  //         this.errorMessage = 'wrong video selected'; 
  //       }else if (error.status === 404) {
  //         this.errorMessage = 'Requested page was not found.';
  //       } else if (error.status === 500) {
  //         this.errorMessage = 'internal server error occurred.';
  //       } else {
  //         this.errorMessage = 'unknown error occurred.';
  //       }
  //       console.log('Error message:', this.errorMessage);

  //       //this.uploadForm.reset(); // Reset the form
       }
     )
   };

  onFileSelect(event) {
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      this.selectedFile = file;
      this.errorMessage = null;   //clear the error message when upload is clicked
    }
  };
  closeModal() {
    this.fileName = null;
    this.successMessage = null;
    this.errorMessage = null;
    this.selectedVideoUrl = null;
    if (this.dialogRef) {
      this.dialogRef.close(); // Close the modal
      this.isVideoBeingUploaded = false;
      this.uploadInProgress = false;
      this.error =false;
    }

  }

  change() {
    this.fileName = null;
    //this.up = false;
    // ------//
   // this.load = false;
    //this.isVideoBeingUploaded = false;

    if (this.fileInputVariable.nativeElement.files.length !== 0) {
     // this.up = true;
      this.fileName = this.fileInputVariable.nativeElement.files[0]["name"];  
      //this.load = false;
    } else {

     // this.up = false;
      
    }
  }



 uploadVideo() {
   // this.up = true;
    //this.load = true;
    //this.isVideoBeingUploaded = false;
    //this.uploadInProgress = true; // Set the flag to indicate upload is in progress



    if (this.fileInputVariable.nativeElement.files.length !== 0) {
      const fileType = this.fileInputVariable.nativeElement.files[0].type;
      const fileFormat = fileType.split("/")[0];
      console.log(fileType, fileFormat);

      if (fileFormat === "video") {
        try{
        this.uploadInProgress = true; // Set the flag to indicate upload is in progress
        this.spinner = true; // Show the spinner

        this.uploader.uploadAll()
      } catch (error) {
        this.handleUploadError(error);
      }
      
    }else {
      //this.load = false;
        this.fileName = null;
       
       // this.isVideoBeingUploaded = false;
        //alert("Please choose a video file only");
        this.displayErrorMessage("Please choose a video file only");
      }
    } else {
      //this.load = false;
      this.fileName = null;
      
     // this.isVideoBeingUploaded = false;
      //alert("Please select a file to upload");
      this.displayErrorMessage("Please select a file to upload");
    }

  }

  handleUploadError(error: any) {
    //this.load = false;
    this.fileName = null;
    this.error = true;
  
    // Handle different error scenarios based on the error details
    if (error.status === 400) {
      alert("Bad request. Please check your input.");
    } else if (error.status === 401) {
      alert("Unauthorized. Please login to proceed."); 
    } else if (error.status === 404) {
      alert("Not found. The requested resource was not found.");
    } else if (error.status === 500) {
      alert("Internal server error occurred");
    } else {
      alert("Unknown error occurred");
    }
  }
  error: boolean = false;

  displayErrorMessage(message: string) {
    const errorMessageElement = document.getElementById("errorMessage");
    if (errorMessageElement) {
      errorMessageElement.innerText = message;
      errorMessageElement.style.color = "red";
    }
  }

}
