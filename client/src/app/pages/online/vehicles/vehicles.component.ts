import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {
  
  // selectedVehicles: string[] = [];
  // processForm: FormGroup;
  // isLoading: boolean = false;
  // selectedVehicle: string;

  // constructor(private fb: FormBuilder,) { }

  // ngOnInit():void {
  //   this.formInitialization();
  // }
  // // formInitialization() {
  // //   this.processForm = this.fb.group({
  // //     bikes: [ ''],
  // //     bus: [ ''],
  // //     '3wheeler': [ ''],
  // //     car: [' '],
  // //     trucks: [ ''],
  // //     others: ['']
  // //   });
  // // }
  // formInitialization() {
  //   this.processForm = this.fb.group({
  //     bikes: [''],
  //     bus: [ ''],
  //     '3wheeler': ['false'],
  //     car: [' '],
  //     trucks: [ ''],
  //     others: [ '']
  //   });
  // }

  // // onProcessVideoSubmit() {
  // //   const selectedVehicle = Object.keys(this.processForm.value).find(key => this.processForm.value[key]);
  // //   if (selectedVehicle) {
  // //     const data = {
  // //       selectedVehicle: selectedVehicle
  // //     };
  // //     console.log(data);
  // //     // Here you can perform further actions with the selected vehicle data
  // //   }
  // // }
  // // below code is working
  // // onProcessVideoSubmit() {
  // //   this.isLoading = true;
  // //   const selectedVehicles: string[] = [];
  // //   Object.keys(this.processForm.controls).forEach(key => {
  // //     if (this.processForm.controls[key].value) {
  // //       selectedVehicles.push(key);
  // //     }
  // //   });
  // //   console.log(selectedVehicles);
  // //   // Here you can perform further actions with the selected vehicles data
  // // }
  // onProcessVideoSubmit() {
  //   this.isLoading = true;
  //   const selectedVehicleValue = this.processForm.get('vehicleClass').value;
  //   console.log('Selected vehicle value:', selectedVehicleValue);
    
  //   // Here you can perform further actions with the selected vehicle data
  // }
  // // onProcessVideoSubmit() {
  // //   const data = {
  // //     bikes: this.processForm.value.bikes,
  // //     bus: this.processForm.value.bus,
  // //     '3wheeler': this.processForm.value['3wheeler'],
  // //     car: this.processForm.value.car,
  // //     trucks: this.processForm.value.trucks,
  // //     others: this.processForm.value.others
  // //   };
  // //   console.log(data);
  // // }
  // onCancel() {
  //   // Add cancel logic here
     
     
  // }
  selectedVehicle: string = '';
  processForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,private dialogRef: NbDialogRef<VehiclesComponent>) { }

  ngOnInit(): void {
    this.formInitialization();
  }

  formInitialization() {
    this.processForm = this.fb.group({
      bikes: [''],
      bus: [''],
      '3wheeler': [''],
      car: ['Car'],
      trucks: [''],
      others: ['']
    });
  }

  onProcessVideoSubmit() {
    if (this.processForm.valid) {
      const formData = this.processForm.value;
      console.log('Submitted Data:', formData);
      // Add further processing logic here
      this.closeWindow();
    } else {
      console.log('Form is invalid. Please fill in all required fields.');
    }
    // const data = {
    //   vehicle: this.selectedVehicle // Include selected vehicle in data
    // };
    // console.log(data, 'selected vehicle');
    // Here you can perform further actions with the selected vehicle data
  }

  // onCancel() {
  //   // Add cancel logic here
  // }
  onCancel() {
    this.closeWindow();
  }

  private closeWindow() {
    this.dialogRef.close();
  }

  selectVehicle(vehicle: string) {
    console.log(vehicle); // Log the clicked vehicle value
    this.selectedVehicle = vehicle; // Update selected vehicle
  }
}
 
