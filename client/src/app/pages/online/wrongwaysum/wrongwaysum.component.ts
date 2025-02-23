import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { FacesService } from '../../../services/faces.service';
import { DatePipe } from '@angular/common';
import { DisableService } from '../../../services/disable.service';

@Component({
  selector: 'ngx-wrongwaysum',
  templateUrl: './wrongwaysum.component.html',
  styleUrls: ['./wrongwaysum.component.scss']
})
export class WrongwaysumComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  wrongwayForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  resdata: any;
  timezone: any;
  arry:any=[]
  id: any;

  constructor(private fb: FormBuilder,public datepipe: DatePipe,private dialogRef:NbDialogRef<WrongwaysumComponent>, private face:FacesService,private disableservice: DisableService,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.id=this.disableservice.sendparamsid()
  }

  initializeForm() {
    this.wrongwayForm = this.fb.group({
      // StartTime: ['', Validators.required],
      // EndTime : ['', Validators.required],
      // PickDate: ['', Validators.required],
      ///
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required],
      
    });
  }

  onProcessSubmit() {
    if (this.wrongwayForm.valid) {
      const formData = this.wrongwayForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 8,
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
    Object.keys(this.wrongwayForm.controls).forEach(controlName => {
      if (this.wrongwayForm.get(controlName).invalid) {
        missingInputs.push(controlName);
      }
    });
    return missingInputs;
  }
  ngOnDestroy(): void {
   
    this.dialogRef.close()
 
}

}
