import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { FacesService } from '../../../services/faces.service'; 
import { DisableService } from '../../../services/disable.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-weaponsum',
  templateUrl: './weaponsum.component.html',
  styleUrls: ['./weaponsum.component.scss']
})
export class WeaponsumComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  weaponForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  resdata: any;
  arry:any=[]
  timezone: any;
  id: any;

  constructor(private fb: FormBuilder,public datepipe: DatePipe,private dialogRef:NbDialogRef<WeaponsumComponent>,private face:FacesService,private disableservice: DisableService,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.id=this.disableservice.sendparamsid()
  }

  initializeForm() {
    this.weaponForm = this.fb.group({
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required]
    });
  }

  onProcessSubmit() {
    if(this.weaponForm.valid) {
      const formData = this.weaponForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 35,
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
    this.dialogRef.close()
  }
  getMissingInputs(): string[] {
    const missingInputs: string[] = [];
    Object.keys(this.weaponForm.controls).forEach(controlName => {
      if (this.weaponForm.get(controlName).invalid) {
        missingInputs.push(controlName);
      }
    });
    return missingInputs;
  }
  ngOnDestroy(): void {
   
    this.dialogRef.close()
 
}

}
