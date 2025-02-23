import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-colorpallete',
  templateUrl: './colorpallete.component.html',
  styleUrls: ['./colorpallete.component.scss']
})
export class ColorpalleteComponent implements OnInit {

  processForm: FormGroup;
  isLoading: boolean = false;

  constructor(private fb: FormBuilder,private dialogRef:NbDialogRef<ColorpalleteComponent>) { }

  ngOnInit(): void {
    this.formInitialization();
  }

  formInitialization() {
    this.processForm = this.fb.group({
      color: [""], // Changed from onespeed to color
    });
  }

  onProcessVideoSubmit() {
    const data = {
      color: this.processForm.value.color
    };
    console.log(data, 'd11');
    // Here you can perform further actions with the selected color data
  }

  onCancel() {
    // Add cancel logic here
    this.dialogRef.close()
    //window.history.back();
  }
   
  

  selectcolor(color: string) {
    console.log(color); // Log the clicked color value
    this.processForm.patchValue({
       color: color
    });
  }

}
