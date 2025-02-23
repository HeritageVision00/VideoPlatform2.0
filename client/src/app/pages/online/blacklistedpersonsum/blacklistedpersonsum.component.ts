 import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacesService } from '../../../services/faces.service';
import { NbDialogRef } from '@nebular/theme';
import { DisableService } from '../../../services/disable.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-blacklistedpersonsum',
  templateUrl: './blacklistedpersonsum.component.html',
  styleUrls: ['./blacklistedpersonsum.component.scss']
})
export class BlacklistedpersonsumComponent implements OnInit {

  processForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  resdata: any;
  arry:any=[]
  timezone: any;
  id: any;
  nameperson=false

  constructor(private fb: FormBuilder, private dialogRef: NbDialogRef<BlacklistedpersonsumComponent>, private face: FacesService,private disableservice: DisableService,public datepipe: DatePipe,) { }

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
      gender: ['', Validators.required],
      name: ['', Validators.required],
      Age: ['', Validators.required]
    });
  }

  onProcessSubmit() {
      if(this.processForm.valid) {
        const formData = this.processForm.value;
        this.dataone = formData;
        this.showMissingInputsMessage = false;
  
        let body = {
          algorithmId: 0,
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
