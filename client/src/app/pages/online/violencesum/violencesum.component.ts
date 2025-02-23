import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { FacesService } from '../../../services/faces.service';
import { DatePipe } from '@angular/common';
import { DisableService } from '../../../services/disable.service';

@Component({
  selector: 'ngx-violencesum',
  templateUrl: './violencesum.component.html',
  styleUrls: ['./violencesum.component.scss']
})
export class ViolencesumComponent implements OnInit {
  processForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  timezone: any;
  resdata: any;
  id: any;
  arry:any=[]

  constructor(private fb: FormBuilder, public datepipe: DatePipe, private dialogRef: NbDialogRef<ViolencesumComponent>, private disableservice: DisableService, private face: FacesService) { }

  ngOnInit(): void {
    this.formInitialization();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.id=this.disableservice.sendparamsid()
  }

  formInitialization() {
    this.processForm = this.fb.group({
      // StartTime: [""],
      // EndTime: ["", Validators.required],
      // PickDate: ["", Validators.required],
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required],
    });
  }

  onProcessVideoSubmit() {
    if (this.processForm.valid) {
      const formData = this.processForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 19,
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
    this.processForm.reset();
  }

  getMissingInputs(): string[] {
    const missingInputs: string[] = [];
    if (!this.processForm.value.StartTime) {
      missingInputs.push('Start Time');
    }
    if (!this.processForm.value.EndTime) {
      missingInputs.push('End Time');
    }
    if (!this.processForm.value.PickDate) {
      missingInputs.push('Date');
    }
    return missingInputs;
  }
  ngOnDestroy(): void {
   
    this.dialogRef.close()
 
}
}
