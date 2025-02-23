import { Component, OnInit } from '@angular/core';
import { FacesService } from '../../../services/faces.service';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DisableService } from '../../../services/disable.service';

@Component({
  selector: 'ngx-zigzagsum',
  templateUrl: './zigzagsum.component.html',
  styleUrls: ['./zigzagsum.component.scss']
})
export class ZigzagsumComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  zigzagForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  timezone: any;
  resdata: any;
  arry:any=[];
  id: any;

  constructor(private fb: FormBuilder,public datepipe: DatePipe,private dialogRef:NbDialogRef<ZigzagsumComponent>, private face:FacesService,private disableservice: DisableService,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.id=this.disableservice.sendparamsid()
  }

  initializeForm() {
    this.zigzagForm = this.fb.group({
      // StartTime: ['', Validators.required],
      // EndTime : ['', Validators.required],
      // PickDate: ['', Validators.required],
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required],
    });
  }

  onProcessSubmit() {
    if (this.zigzagForm.valid) {
      const formData = this.zigzagForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 88,
        data: this.dataone
      };
    
      this.disableservice.onProcessSubmitdata(body);
      this.dialogRef.close();
    } else {
      console.log('Form is invalid');
      this.showMissingInputsMessage = true;
    }
  }
  oncancel(){
    this.dialogRef.close()
  }
  getMissingInputs(): string[] {
    const missingInputs: string[] = [];
    Object.keys(this.zigzagForm.controls).forEach(controlName => {
      if (this.zigzagForm.get(controlName).invalid) {
        missingInputs.push(controlName);
      }
    });
    return missingInputs;
  }
  ngOnDestroy(): void {
   
    this.dialogRef.close()
 
}

}
