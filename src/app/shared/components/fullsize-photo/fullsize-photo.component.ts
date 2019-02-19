import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-fullsize-photo',
  templateUrl: './fullsize-photo.component.html',
  styleUrls: ['./fullsize-photo.component.css']
})
export class FullsizePhotoComponent implements OnInit {
  @Input() data;
  constructor() { }

  ngOnInit() {
  }

}
