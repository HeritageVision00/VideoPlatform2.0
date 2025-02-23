import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { api } from '../../../models/API';

@Component({
  selector: 'ngx-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

  @Input() data: any;

  constructor(
    public sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    console.log(this.data)
    if(!this.data.processed){
      this.data.processed = true
      for(let i = 0; i < this.data.filename.length; i++){
        this.data.filename[i] = this.sanitizer.bypassSecurityTrustUrl(`${api}/pictures/${this.data.filename[i]}`)
      }
    }
  }

}
