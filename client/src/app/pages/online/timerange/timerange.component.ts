import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-timerange',
  templateUrl: './timerange.component.html',
  styleUrls: ['./timerange.component.scss']
})
export class TimerangeComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  dateRangeForm: FormGroup;
  

  constructor(private fb: FormBuilder,private dialogRef: NbDialogRef<TimerangeComponent>) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.dateRangeForm = this.fb.group({
      // endDateTime: ['', Validators.required],
      startDateTime: ['', Validators.required],
       endDateTime: ['', Validators.required]
    });
  }

  onProcessSubmit() {
 
    if (this.dateRangeForm.valid) {
       
      const formData = this.dateRangeForm.value;
      console.log('Submitted Data:', formData);
      this.dialogRef.close();
      // Add further processing logic here
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }

  onCancel() {
    // Add cancel logic here
    this.dialogRef.close();
  }
  private closeWindow() {
    // Close the dialog window
    this.dialogRef.close();
  }

}
