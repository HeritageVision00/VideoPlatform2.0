import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme'; 
import { FacesService } from '../../../services/faces.service';
import { ActivatedRoute } from '@angular/router';
import { DisableService } from '../../../services/disable.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-collapsesum',
  templateUrl: './collapsesum.component.html',
  styleUrls: ['./collapsesum.component.scss']
})
export class CollapsesumComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  processForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;

  dev: boolean = true
  timezone: any;
  id: any;
  resdata: any;
  arry:any=[]
  


  constructor(
    private fb: FormBuilder,
    private dialogRef:NbDialogRef<CollapsesumComponent>,
    private face:FacesService,
    private activatedRoute: ActivatedRoute,
    private disableservice: DisableService,public datepipe: DatePipe,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.id=this.disableservice.sendparamsid()
  }

  initializeForm() {
    this.processForm = this.fb.group({
      // StartTime: ['', Validators.required],
      // EndTime: ['', Validators.required],
      // PickDate: ['', Validators.required],
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required],
      gender: ['male', Validators.required], // Adding required validator for gender
    });
  }

  onProcessSubmit() {
    if(this.processForm.valid) {
      const formData = this.processForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 38,
        data: this.dataone
      };
    
      this.disableservice.onProcessSubmitdata(body);
      this.dialogRef.close();
    } else {
      console.log('Form is invalid');
      this.showMissingInputsMessage = true;
    }
  }

  onCancel() {
    // Add cancel logic here
    this.dialogRef.close();
    this.processForm.reset()
  }
   
  private closeWindow() {
    // Close the dialog window
    this.dialogRef.close();
  }
  getMissingInputs(): string[] {
    const missingInputs: string[] = [];
    Object.keys(this.processForm.controls).forEach(controlName => {
      if (this.processForm.get(controlName).invalid) {
        missingInputs.push(controlName);
      }
    });
    return missingInputs;
  }
  ngOnDestroy(): void {
   
      this.dialogRef.close()
   
  }

}
