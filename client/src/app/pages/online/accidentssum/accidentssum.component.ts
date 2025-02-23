import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme'; 
import { FacesService } from '../../../services/faces.service'; 
import { DatePipe } from '@angular/common';
import { DisableService } from '../../../services/disable.service';
//import { ActivatedRoute } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'ngx-accidentssum',
  templateUrl: './accidentssum.component.html',
  styleUrls: ['./accidentssum.component.scss']
})
export class AccidentssumComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  accidentForm: FormGroup;
  showMissingInputsMessage: boolean = false;
  dataone: any;
  resdata: any;
  timezone: any;
  arry:any=[]
  id: any;

  constructor(private fb: FormBuilder,public datepipe: DatePipe,private dialogRef:NbDialogRef<AccidentssumComponent>, private face:FacesService,private disableservice: DisableService,private activatedRoute: ActivatedRoute,) { }

  ngOnInit(): void {
    this.initializeForm();
    this.timezone = JSON.parse(localStorage.getItem("info")).timezone
    // console.log(this.activatedRoute.snapshot.params.id,'cam id this.activatedRoute.snapshot.params.id')
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   const id = params['id'];
    //   console.log(id, 'cam id');
    //   // Now, you can use the 'id' variable here or assign it to a class property
    // });
    this.id=this.disableservice.sendparamsid()
  }

  initializeForm() {
    this.accidentForm = this.fb.group({
      // StartTime: ['', Validators.required],
      // EndTime : ['', Validators.required],
      // PickDate: ['', Validators.required],
      startdateTimePicker:['', Validators.required],
      enddateTimePicker:['', Validators.required],
    });
  }

  onProcessSubmit() {
    if (this.accidentForm.valid) {
      const formData = this.accidentForm.value;
      this.dataone = formData;
      this.showMissingInputsMessage = false;

      let body = {
        algorithmId: 29,
        data: this.dataone
      };
;
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
    Object.keys(this.accidentForm.controls).forEach(controlName => {
      if (this.accidentForm.get(controlName).invalid) {
        missingInputs.push(controlName);
      }
    });
    return missingInputs;
  }
  ngOnDestroy(): void {
   
    this.dialogRef.close()
 
}
}
