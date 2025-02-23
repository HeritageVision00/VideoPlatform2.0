import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-imagebig',
  templateUrl: './imagebig.component.html',
  styleUrls: ['./imagebig.component.scss']
})
export class ImagebigComponent implements OnInit {

  constructor() { }

  @Input() data: any;

  ngOnInit(): void {
  }

}
