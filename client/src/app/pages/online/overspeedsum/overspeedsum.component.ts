import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { FacesService } from '../../../services/faces.service';
import { DatePipe } from '@angular/common';
import { DisableService } from '../../../services/disable.service';

@Component({
  selector: 'ngx-overspeedsum',
  templateUrl: './overspeedsum.component.html',
  styleUrls: ['./overspeedsum.component.scss']
})
export class OverspeedsumComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  processForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  resdata: any;
  timezone: any;
  fildata:any={};
   
  listspeed:any=[]
  nump:any;
  numc:any;
  id: any;
  arry:any=[]
  vspeed=false;

  constructor(private fb: FormBuilder,private dialogRef: NbDialogRef<OverspeedsumComponent>,private face:FacesService,public datepipe: DatePipe,private disableservice: DisableService,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    this.id=this.disableservice.sendparamsid()
  }

  initializeForm() {
    this.processForm = this.fb.group({
      // numberPlate:['',Validators.required],
      // time: ['', Validators.required],
      // day: ['Monday', Validators.required],
      // color:['Black'],
      // plates: ['Dubai 1111(Four Digit)', Validators.required],
      // StartTime: ['', Validators.required],
      // EndTime : ['', Validators.required],
      // PickDate: ['', Validators.required],
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required],
      maxSpeed: ['100', Validators.required]
    });
  }
  
  
  //************** */
  
  //*********** */

  onProcessSubmit() {
    if(this.processForm.valid) {
      const formData = this.processForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 5,
        data: this.dataone
      };
    
      this.disableservice.onProcessSubmitdata(body);
      this.dialogRef.close();
    } else {
      console.log('Form is invalid');
      this.showMissingInputsMessage = true;
    }
  }
  //*******time format changing  */
//   formatDate(date: Date): string {
//     const year = date.getFullYear();
//     const month = this.padZero(date.getMonth() + 1);
//     const day = this.padZero(date.getDate());
//     const hours = this.padZero(date.getHours());
//     const minutes = this.padZero(date.getMinutes());
//     const seconds = this.padZero(date.getSeconds());
//     return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

// padZero(num: number): string {
//     return num < 10 ? `0${num}` : num.toString();
// }
//******above*time format changing  */
  onCancel() {
    // Add cancel logic here
    this.dialogRef.close();
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
