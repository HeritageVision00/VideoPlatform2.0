import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-videospeed',
  templateUrl: './videospeed.component.html',
  styleUrls: ['./videospeed.component.scss']
})
export class VideospeedComponent implements OnInit {
  // @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();
  // @Output() backClicked: EventEmitter<void> = new EventEmitter<void>();

  selectedSpeed: string = "";
  processForm: FormGroup;
  isLoading: boolean = false;
  // isVisible: boolean = true;
  data: { speedX: string } = null;

  constructor(private fb: FormBuilder,private dialogRef:NbDialogRef<VideospeedComponent>) { }

  ngOnInit(): void {
    this.formInitialization();
  }

  formInitialization() {
    this.processForm = this.fb.group({
      onespeed: [""],
      twospeed: [""],
      threespeed: [""],
      fourspeed: [""],
      onefastspeed: [""],
      twofastspeed: [""],
      threefastspeed: [""],
      fourfastspeed: [""]
    });
  }

  onProcessVideoSubmit() {
    this.isLoading = true;
    // const data = {
    //   speedX: this.processForm.value.onespeed
    // };
    this.data = {
      speedX: this.processForm.value.onespeed
    };
    //console.log(data, 'd11');
    console.log(this.data, 'd11');
    // Here you can perform further actions with the selected speed data
  }

  onCancel() {
    // Add cancel logic here
    //this.closeDialog.emit();
    //this.backClicked.emit();
    this.data = null;
    this.processForm.reset();
    console.log(this.data, 'd11');
    this.dialogRef.close()
  
    // this.isVisible = false;
  }
  selectSpeed(speed: string) {
    console.log(speed); // Log the clicked speed value
    this.processForm.patchValue({
      onespeed: speed
    });
  }
}
