import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'ngx-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }
  selectedgender: string = '';
  selectedmenfair: string = '';
  processForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.formInitialization();
  }

  formInitialization() {
    this.processForm = this.fb.group({
      
      gender:['Male'],
      
      Fair: ['Fair'],
       
    });
  }

  onProcessVideoSubmit() {
    if (this.processForm.valid) {
      const formData = this.processForm.value;
      console.log('Submitted Data:', formData);
      // Add further processing logic here
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
  }
    // const data = {
    //   menfair: this.selectedmenfair,
    //   gender: this.selectedgender // Include selected vehicle in data
    // };
    // console.log(data, 'selected menfair');
    // // Here you can perform further actions with the selected vehicle data
    onCancel() {
     
      this.processForm.reset();
    }
}

  // onCancel() {
  //   // Add cancel logic here
  // }

  // selectgender(gender: string) {
  //   console.log(gender); // Log the clicked vehicle value
  //   this.selectedgender = gender; // Update selected vehicle
  // }

  // selectmenfair(menfair: string) {
  //   console.log(menfair); // Log the clicked vehicle value
  //   this.selectedmenfair = menfair; // Update selected vehicle
  // }


